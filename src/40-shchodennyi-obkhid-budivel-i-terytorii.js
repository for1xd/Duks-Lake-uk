// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Щоденний обхід будівель і території.

/* INSP:BEGIN — Щоденний обхід будівель і території.
   Обхідник: майстер по точках (фото з водяним знаком, стиснення, чернетка в IndexedDB, черга відправки без мережі).
   Перевіряючі (CEO Asgard, керівник Facility, Dev): стрічка, матриця покриття, погодження/повернення, задачі, Word-звіти.
   db: buildings_assignments/<bid>, inspections/<date>_<bid>_<staffId>, inspection_photos/<inspId>_<lid>, inspection_exports.
   Фото: оригінал у сховищі файлів (assets), мініатюри — у документах; якщо сховище недоступне — стиснена копія в документі. */
/* хто робить обхід: у режимі «Перегляд як» (лише Dev) — реальна людина з цією роллю, щоб бачити її будівлі */
function inspAsPerson(){if(!S.asRole||!realDev())return null;const L=S.staff.filter(x=>x.role===S.asRole||x.extraRole===S.asRole);if(!L.length)return null;
  return L.find(x=>ARCH.some(bb=>inspAssigned(bb.id).includes(x.id)))||L.find(x=>x.userId)||L[0];}
function inspMe(){return inspAsPerson()||myStaff();}
const INSP_PRIO={low:'низький',mid:'середній',high:'терміновий'};
const INSP_ST={none:['не розпочато','none'],draft:['чернетка','draft'],queued:['очікує мережу','queued'],submitted:['на перевірці','sub'],returned:['повернуто','ret'],approved:['погоджено','ok']};
const INSP_FIRE_DEF=[['ext','Вогнегасник на місці']];
function inspFireList(){const t=S.cfg&&S.cfg.inspFire;if(Array.isArray(t)&&t.length)return t.map((x,i)=>['c'+i,String(x)]);return INSP_FIRE_DEF;}
function inspPts(bid){const L=[
  {k:'water',n:'Насосна',req:true,max:3,hint:'1–3 фото насосної та лічильника',meter:true},
  {k:'vrp',n:'ВРП',req:true,max:3,hint:'1–3 фото вступно-розподільчого пристрою'},
  {k:'fire',n:'Пожежний пост',req:true,max:3,hint:'1–3 фото пожежного поста',check:inspFireList()},
  {k:'terr',n:'Територія',req:false,max:6,hint:'Необов’язково: вхідна група, сміттєві майданчики, освітлення, паркінг (до 6 фото)'}];
  const c=bid&&((S.cfg&&S.cfg.inspBld)||{})[bid];const pump=(c&&c.pump)||'req';return L.filter(p=>!(p.k==='water'&&pump==='none')).map(p=>p.k==='water'&&pump==='opt'?Object.assign({},p,{req:false}):p);}
function inspPt(k){return inspPts().find(p=>p.k===k)||{k,n:k};}
function inspB(id){return ARCH.find(b=>b.id===id);}
function inspBName(id){const b=inspB(id);return b?'Буд. '+b.fac+' · '+b.name:id;}
function inspBShort(id){const b=inspB(id);return b?'Буд. '+b.fac:id;}
/* ролі */
function inspCanReview(){return hasAny(['ceo','director','dev']);}
function inspCanAssign(){return hasAny(['director','dev']);}
function inspAssignedRaw(bid){const a=(S.inspAs||{})[bid];return a&&Array.isArray(a.userIds)?a.userIds:[];}
function inspAllIds(){const a=(S.inspAs||{})._all;return a&&Array.isArray(a.userIds)?a.userIds:[];}
function inspAssigned(bid){return [...new Set([...inspAssignedRaw(bid),...inspAllIds()])];}
function inspMyBlds(){const m=inspMe();if(!m)return [];return ARCH.filter(b=>inspAssigned(b.id).includes(m.id));}
function inspIsWalker(){return inspMyBlds().length>0;}
function inspCan(){return inspCanReview()||inspIsWalker()||isUK();}
function inspId(date,bid,sid){return date+'_'+bid+'_'+sid;}
function inspList(){return Object.values(S.insp||{});}
function inspPending(){return inspList().filter(x=>x.status==='submitted').length;}
function inspRemarks(x){return Object.values(x.points||{}).filter(p=>p&&p.status==='remark').length;}
let _inspAssets;async function inspAssetsNs(){if(_inspAssets!==undefined)return _inspAssets;try{_inspAssets=await claude.use('assets');}catch(e){_inspAssets=null;}return _inspAssets;}
async function inspWaterSend(d,pt){/* показник у «Облік → Вода»: один діючий загальнобудинковий лічильник будинку, відкритий період */
  try{const b=inspB(d.buildingId);if(!b)return 'немає будинку';const oid=b.fac==='2'||b.fac==='4'?'b24':'b'+String(b.fac).replace('.','');
    const ms=(S.wMet||[]).filter(m=>m.obj===oid&&m.kind==='main'&&m.active!==false&&(oid!=='b24'||!m.section||String(m.section).includes(b.fac)));
    if(ms.length!==1)return ms.length?'кілька загальнобудинкових лічильників — внесіть вручну':'не знайдено загальнобудинковий лічильник';
    const per=d.date.slice(0,7);if(!S.wPerD||!S.wPerD[per])return 'період «'+perLabel(per)+'» в обліку води ще не створено';
    await S.db.doc('wPeriods/'+per).update({reads:{[ms[0].id]:{e:+pt.meterValue}},updatedAt:Date.now(),updatedBy:S.myId});return 'ok';}catch(e){return 'помилка запису';}}
/* ---------- черга на телефоні (IndexedDB з запасним варіантом у пам’яті): невідправлені фото й зміни точок ---------- */
const IDBX={p:null,mem:new Map(),
  open(){if(this.p)return this.p;this.p=new Promise(res=>{try{const r=indexedDB.open('dl-insp',1);r.onupgradeneeded=()=>{try{r.result.createObjectStore('drafts',{keyPath:'id'});}catch(e){}};r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);r.onblocked=()=>res(null);}catch(e){res(null);}});return this.p;},
  async tx(mode,fn){const db=await this.open();if(!db)return null;return new Promise(res=>{try{const t=db.transaction('drafts',mode);const st=t.objectStore('drafts');const r=fn(st);t.oncomplete=()=>res(r&&r.result!==undefined?r.result:true);t.onerror=()=>res(null);t.onabort=()=>res(null);}catch(e){res(null);}});},
  async all(){const r=await this.tx('readonly',st=>st.getAll());return Array.isArray(r)?r:[...this.mem.values()];},
  async put(d){this.mem.set(d.id,d);const ok=await this.tx('readwrite',st=>st.put(d));return !!ok;},
  async del(id){this.mem.delete(id);await this.tx('readwrite',st=>st.delete(id));}};
/* S.inspQ: {id → запис черги}. Запис фото: {id:'ph:'+lid, kind:'photo', inspId, bid, date, pointKey, authorId, lid, blob|raw, meta, err, stage, at}
   Запис точки: {id:'pt:'+inspId+':'+key, kind:'patch', inspId, bid, date, key, patch, at} */
function inspSid(id){return String(id||'').replace(/^(\d{4}-\d{2}-\d{2})_(b\d+)$/,'$1|$2');}
function inspRid(date,bid){return date+'_'+bid;}
async function inspLoadDrafts(){const a=await IDBX.all();S.inspQ={};const legacy=[];for(const d of a){if(d.kind==='photo'||d.kind==='patch')S.inspQ[d.id]=d;else if(Array.isArray(d.photos))legacy.push(d);}
  /* старі особисті чернетки (до спільних звітів) → у чергу спільного звіту того ж дня; нічого не губимо */
  for(const d of legacy){const rid=inspRid(d.date,d.buildingId);let ok=true;
    for(const p of d.photos){if(p.docId)continue;const q={id:'ph:'+p.lid,kind:'photo',inspId:rid,bid:d.buildingId,date:d.date,pointKey:p.pointKey,authorId:d.authorId,lid:p.lid,blob:p.blob,meta:{thumb:p.thumb,mini:p.mini,takenAt:p.takenAt,fromGallery:!!p.fromGallery,sizeKb:p.sizeKb,w:p.w,h:p.h},at:Date.now()};if(!(await IDBX.put(q))&&!IDBX.mem.has(q.id))ok=false;S.inspQ[q.id]=q;}
    for(const [k,v] of Object.entries(d.points||{})){if(!v||(!v.status&&!v.comment&&v.meterValue==null))continue;const q={id:'pt:'+rid+':'+k,kind:'patch',inspId:rid,bid:d.buildingId,date:d.date,key:k,patch:{status:v.status||'ok',comment:v.comment||'',priority:v.priority||null,meterValue:v.meterValue??null,toWater:!!v.toWater,checklist:v.checklist||null},at:Date.now()};await IDBX.put(q);S.inspQ[q.id]=q;}
    if(ok)await IDBX.del(d.id);}
  S.inspDr={};}
function inspQueued(){return Object.values(S.inspQ||{}).filter(q=>q.kind==='photo');}
function inspQOf(rid){return Object.values(S.inspQ||{}).filter(q=>q.inspId===rid);}
async function inspQPut(q){S.inspQ=S.inspQ||{};S.inspQ[q.id]=q;await IDBX.put(q);}
async function inspQDel(id){if(S.inspQ)delete S.inspQ[id];await IDBX.del(id);}
/* ---------- фото: читання заголовка (формат, EXIF-дата, розмір), декодування зі зменшенням, водяний знак, стиснення ---------- */
function inspUA(){const u=navigator.userAgent||'';const b=/MiuiBrowser\/[\d.]+/.exec(u)||/SamsungBrowser\/[\d.]+/.exec(u)||/EdgA?\/[\d.]+/.exec(u)||/CriOS\/[\d.]+/.exec(u)||/FxiOS\/[\d.]+/.exec(u)||/Chrome\/[\d.]+/.exec(u)||/Version\/[\d.]+.*Safari/.exec(u);
  const os=/iPhone|iPad/.test(u)?'iOS '+((/OS ([\d_]+)/.exec(u)||[])[1]||'').replace(/_/g,'.'):/Android ([\d.]+)/.test(u)?'Android '+RegExp.$1:'';const dev=(/;\s*([^;)]*(?:Redmi|Xiaomi|MI |POCO|SM-|Pixel)[^;)]*)/i.exec(u)||[])[1]||'';
  return [os,dev,b?b[0].replace('/',' '):'',innerWidth+'×'+innerHeight].filter(Boolean).join(' · ');}
/* місцевий час Києва → мітка часу (EXIF зберігає час без поясу) */
function inspKyivToTs(y,mo,d,h,mi,s){const guess=Date.UTC(y,mo-1,d,h,mi,s||0);const off=inspKyivOff(guess);return guess-off*60000;}
function inspKyivOff(ts){try{const f=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Kyiv',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});const p=Object.fromEntries(f.formatToParts(new Date(ts)).map(x=>[x.type,x.value]));return Math.round((Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute)-Math.floor(ts/60000)*60000)/60000);}catch(e){return -new Date(ts).getTimezoneOffset();}}
function inspKyivYmd(ts){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Kyiv'}).format(new Date(ts));}catch(e){return ymd(new Date(ts));}}
function inspKyivHM(ts){try{return new Intl.DateTimeFormat('uk-UA',{timeZone:'Europe/Kyiv',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(ts));}catch(e){return hm(ts);}}
async function inspFileHead(file){const out={fmt:'',w:0,h:0,orient:1,exifAt:null};let buf;try{buf=new DataView(file instanceof ArrayBuffer?file:await file.slice(0,1048576).arrayBuffer());}catch(e){return out;}
  const u8=i=>buf.getUint8(i);const len=buf.byteLength;if(len<12)return out;
  if(u8(0)===0xFF&&u8(1)===0xD8){out.fmt='jpeg';let o=2;
    while(o+4<len){if(u8(o)!==0xFF){o++;continue;}const m=u8(o+1);const sl=buf.getUint16(o+2);
      if(m===0xE1&&o+10<len&&buf.getUint32(o+4)===0x45786966){const t=o+10;try{const le=buf.getUint16(t)===0x4949;const g16=i=>buf.getUint16(t+i,le),g32=i=>buf.getUint32(t+i,le);
          const rd=(ifd,cb)=>{const n=g16(ifd);for(let i=0;i<n;i++){const e=ifd+2+i*12;cb(g16(e),g16(e+2),g32(e+4),e+8);}};let exif=0;
          rd(g32(4),(tag,typ,cnt,vo)=>{if(tag===0x0112)out.orient=g16(vo);if(tag===0x8769)exif=g32(vo);});
          if(exif)rd(exif,(tag,typ,cnt,vo)=>{if((tag===0x9003||tag===0x9004)&&!out.exifAt){const p=g32(vo);let s='';for(let k=0;k<19&&t+p+k<len;k++)s+=String.fromCharCode(buf.getUint8(t+p+k));const m2=/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/.exec(s);if(m2&&+m2[1]>2000)out.exifAt=inspKyivToTs(+m2[1],+m2[2],+m2[3],+m2[4],+m2[5],+m2[6]);}});}catch(e){}}
      if(m>=0xC0&&m<=0xCF&&m!==0xC4&&m!==0xC8&&m!==0xCC){out.h=buf.getUint16(o+5);out.w=buf.getUint16(o+7);break;}
      o+=2+sl;}}
  else if(u8(0)===0x89&&u8(1)===0x50){out.fmt='png';out.w=buf.getUint32(16);out.h=buf.getUint32(20);}
  else if(buf.getUint32(4)===0x66747970){const br=String.fromCharCode(u8(8),u8(9),u8(10),u8(11));out.fmt=/heic|heix|hevc|mif1|msf1|heim|heis/.test(br)?'heic':/avif/.test(br)?'avif':'isobmff';}
  else if(u8(0)===0x52&&u8(8)===0x57)out.fmt='webp';
  return out;}
function inspErr(stage,code,msg,extra){return Object.assign(new Error(msg||code),{stage,code},extra||{});}
/* читаємо байти файлу одразу в пам’ять: на Android файл із галереї (content://) може стати недоступним або не читатися зовсім */
async function inspReadBytes(f){const errs=[];const ways=[['arrayBuffer',()=>f.arrayBuffer()],['FileReader',()=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error||new Error('FileReader'));r.readAsArrayBuffer(f);})]];
  if(f instanceof Blob)ways.push(['Response',()=>new Response(f).arrayBuffer()]);
  for(const [k,w] of ways){try{const b=await w();if(b&&b.byteLength)return b;errs.push(k+': 0 байт');}catch(e){errs.push(k+': '+((e&&(e.name||'')+' '+(e.message||''))||'?').trim().slice(0,80));}}
  /* частинами: якщо телефон повідомив неправильний розмір файлу, читаємо все, що вдається */
  if(f instanceof Blob&&f.size){const parts=[];let o=0;const step=async n=>{const b=await f.slice(o,o+n).arrayBuffer();if(!b.byteLength)throw new Error('0');parts.push(new Uint8Array(b));o+=b.byteLength;};
    try{while(o<f.size){try{await step(Math.min(262144,f.size-o));}catch(e){let ok=false;for(let n=16384;n>=512&&!ok;n>>=2){try{await step(Math.min(n,f.size-o));ok=true;}catch(e2){}}if(!ok)break;}}}catch(e){}
    if(o>4096){const u=new Uint8Array(o);let i=0;for(const pt of parts){u.set(pt,i);i+=pt.length;}errs.push('частинами: '+Math.round(o/1024)+' з '+Math.round(f.size/1024)+' КБ');
      if(u[0]===0xFF&&u[1]===0xD8||u[0]===0x89){const buf=u.buffer;buf.partial=o<f.size;buf.notes=errs;return buf;}}
    else errs.push('частинами: 0 КБ');}
  throw inspErr('read','unreadable',errs.join('; ')||'read failed');}
async function inspSrc(f){if(!f||!f.size)throw inspErr('read','empty','порожній файл');if(f.size>INSP_MAXFILE)throw inspErr('read','toolarge','файл '+Math.round(f.size/1048576)+' МБ');
  const buf=await inspReadBytes(f);const hd=await inspFileHead(buf);hd.partial=!!buf.partial;hd.notes=buf.notes||null;const u=new Uint8Array(buf);
  hd.hex=Array.from(u.subarray(0,12),x=>x.toString(16).padStart(2,'0')).join(' ');
  if(hd.fmt==='jpeg'){let e=false;for(let i=u.length-2;i>=Math.max(0,u.length-4096);i--)if(u[i]===0xFF&&u[i+1]===0xD9){e=true;break;}hd.eoi=e;}
  const type={jpeg:'image/jpeg',png:'image/png',webp:'image/webp',heic:'image/heic',avif:'image/avif'}[hd.fmt]||f.type||'application/octet-stream';
  return {blob:new Blob([buf],{type}),hd};}
async function inspDecode(file,hd){const auto=!!hd;hd=hd||{};const tries=[];const note=(k,e)=>tries.push(k+': '+((e&&(e.name&&e.name!=='Error'?e.name+' ':'')+(e.message||''))||'?').trim().slice(0,90));
  const side=hd.w&&hd.h?Math.max(hd.w,hd.h):0;const tw=side?(side>2000?Math.max(1,Math.round(hd.w*2000/side)):0):(auto?1600:0);
  const cib=async(src,o,k)=>{try{const im=await createImageBitmap(src,o);if(im&&im.width)return im;note(k,new Error('0×0'));}catch(e){note(k,e);}return null;};
  const tag=src=>new Promise(res=>{const u=URL.createObjectURL(src);const i=new Image();i.decoding='async';
    const ok=()=>{setTimeout(()=>URL.revokeObjectURL(u),3000);res(i);};
    i.onload=()=>{if(i.decode)i.decode().then(ok,e=>{if(i.naturalWidth)ok();else{note('img.decode',e);URL.revokeObjectURL(u);res(null);}});else ok();};
    i.onerror=()=>{note('img',new Error('onerror'));URL.revokeObjectURL(u);res(null);};i.src=u;});
  const chain=async(src,sfx)=>{let r=null;
    if(window.createImageBitmap){
      if(tw)r=await cib(src,{imageOrientation:'from-image',resizeWidth:tw,resizeQuality:'medium'},'зменшення'+sfx);
      if(!r)r=await cib(src,{imageOrientation:'from-image'},'повне'+sfx);
      if(!r)r=await cib(src,undefined,'просте'+sfx);}
    if(!r)r=await tag(src);return r;};
  let img=await chain(file,'');
  /* обрізаний JPEG (немає маркера кінця): дописуємо FFD9 і пробуємо ще раз */
  if(!img&&hd.fmt==='jpeg'&&hd.eoi===false)img=await chain(new Blob([file,new Uint8Array([0xFF,0xD9])],{type:'image/jpeg'}),' (дописано кінець)');
  if(img)return img;
  throw inspErr('decode',hd.fmt==='heic'?'heic':hd.fmt?'decode':'notimage',tries[tries.length-1]||'image decode failed',{tries});}
function inspDims(img){return [img.naturalWidth||img.width,img.naturalHeight||img.height];}
function inspCanvas(img,max){const [w,h]=inspDims(img);if(!w||!h)throw inspErr('decode','empty','zero size');const k=Math.min(1,max/Math.max(w,h));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));const g=c.getContext('2d');if(!g)throw inspErr('compress','canvas','no 2d context');g.drawImage(img,0,0,c.width,c.height);return c;}
function inspStamp(c,lines){const g=c.getContext('2d');const fs=Math.max(16,Math.round(Math.min(c.width,c.height)*0.032));g.font='700 '+fs+'px Manrope, system-ui, sans-serif';const pad=Math.round(fs*.6),lh=Math.round(fs*1.3);
  const bh=pad*2+lh*lines.length;g.fillStyle='rgba(6,20,24,.62)';g.fillRect(0,c.height-bh,c.width,bh);g.fillStyle='#fff';g.textBaseline='top';
  lines.forEach((t,i)=>{let s=t;while(g.measureText(s).width>c.width-pad*2&&s.length>4)s=s.slice(0,-2);if(s!==t)s=s.slice(0,-1)+'…';g.fillText(s,pad,c.height-bh+pad+i*lh);});}
function inspBlob(c,q){return new Promise(res=>{try{c.toBlob(b=>res(b),'image/jpeg',q);}catch(e){res(null);}});}
async function inspFit(c,limit){let q=.7,cv=c,b=await inspBlob(cv,q);let n=0;while(b&&b.size>limit&&n<10){if(q>.45)q-=.08;else{const k=.85;const c2=document.createElement('canvas');c2.width=Math.round(cv.width*k);c2.height=Math.round(cv.height*k);c2.getContext('2d').drawImage(cv,0,0,c2.width,c2.height);cv=c2;}b=await inspBlob(cv,q);n++;}return b;}
const INSP_MAXFILE=80*1024*1024;
async function inspProcess(file,ctx,src){src=src||await inspSrc(file);const hd=src.hd;let img;try{img=await inspDecode(src.blob,hd);}catch(e){throw e.stage?e:inspErr('decode',hd.fmt==='heic'?'heic':'decode',e&&e.message);}
  let c;try{c=inspCanvas(img,1600);}catch(e){throw e.stage?e:inspErr('compress','canvas',e&&e.message);}
  const at=ctx.takenAt;inspStamp(c,[dmy(new Date(at))+' '+inspKyivHM(at)+' · '+inspBName(ctx.bid),ctx.point+' · '+ctx.who+(ctx.gallery?' · з галереї':'')]);
  const blob=await inspFit(c,300*1024);if(!blob)throw inspErr('compress','encode','toBlob повернув порожньо');
  const th=inspCanvas(c,320).toDataURL('image/jpeg',.7);const mi=inspCanvas(c,120).toDataURL('image/jpeg',.6);try{img.close&&img.close();}catch(e){}
  return {blob,thumb:th,mini:mi,sizeKb:Math.round(blob.size/1024),w:c.width,h:c.height,hd};}
function inspB2U(b){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(b);});}
/* людські тексти помилок за етапом */
function inspErrText(e){const c=e&&e.code,s=e&&e.stage;
  if(c==='rights')return 'Ця будівля не закріплена за вами — зверніться до Віталія Головньова.';
  if(c==='locked')return 'Звіт уже погоджено — змінювати його не можна.';
  if(c==='heic')return 'Формат HEIC цей браузер не відкриває. Фото збережено — натисніть «Спробувати ще раз» або зробіть знімок кнопкою «Зробити фото».';
  if(c==='toolarge')return 'Фото завелике ('+((e.message||'').replace(/\D+/g,'')||'')+' МБ). Збережено — спробуйте ще раз або зробіть знімок кнопкою «Зробити фото».';
  if(c==='empty')return 'Телефон передав порожній файл. Зробіть фото ще раз.';
  if(c==='unreadable')return 'Телефон не дав прочитати це фото з галереї (так буває, коли фото лежить у хмарі Google Фото, ще не докачане або в захищеній папці). Зробіть знімок кнопкою «Зробити фото» — так спрацює.';
  if(c==='notimage')return 'Цей файл не схожий на звичайне фото — браузер його не розпізнав. Зробіть знімок кнопкою «Зробити фото».';
  if(s==='decode')return 'Браузер не зміг відкрити це фото. Натисніть «Спробувати ще раз» або зробіть знімок кнопкою «Зробити фото».';
  if(s==='compress')return 'Фото завелике для стиснення — стискаємо ще раз. Якщо не вийде, натисніть «Спробувати ще раз».';
  if(s==='save')return 'Телефон не дав зберегти фото (мало місця). Звільніть пам’ять і спробуйте ще раз.';
  if(s==='upload'&&(c==='resource_exhausted'||c==='quota_or_state'))return 'Сховище фото заповнене — повідомте Віталія Головньова. Фото збережено на телефоні.';
  if(s==='upload')return 'Немає зв’язку — фото збережено і відправиться автоматично.';
  return 'Фото не вдалося обробити. Воно збережене — натисніть «Спробувати ще раз».';}
function inspLogErr(e,q,file){const b=inspB(q&&q.bid);const m=inspMe();
  devLog('Обхід: помилка фото · '+(b?'Буд. '+b.fac:'')+' · '+inspPt(q&&q.pointKey).n+' · етап: '+((e&&e.stage)||'?'),'err',
    [m?m.name:'',q&&q.meta?(q.meta.fromGallery?'галерея':'камера'):'',file?(file.type||'тип ?')+' · '+Math.round((file.size||0)/1024)+' КБ'+(file.lastModified?' · змінено '+dmy(new Date(file.lastModified))+' '+inspKyivHM(file.lastModified):''):'',q&&q.meta?'формат '+(q.meta.fmt||'не розпізнано')+(q.meta.dims?' '+q.meta.dims:'')+(q.meta.eoi===false?' · без кінця файлу':''):'',q&&q.meta&&q.meta.hex?'байти '+q.meta.hex:'',(e&&(e.code||''))+' '+((e&&e.message)||''),e&&e.tries&&e.tries.length?'спроби: '+e.tries.join('; '):'',inspUA()].filter(Boolean).join(' | '));}
/* ---------- спільний звіт: один документ на будівлю за день ---------- */
function inspRep(rid){return (S.insp||{})[rid]||null;}
function inspLocked(x){return !!x&&x.status==='approved';}
function inspCanEditRep(bid){const m=inspMe();return !!m&&inspAssigned(bid).includes(m.id);}
function inspCanDelPhoto(p){const m=inspMe();return !!p&&((m&&p.authorId===m.id)||hasAny(['director','dev']));}
async function inspEnsure(rid,bid,date){if(inspRep(rid))return true;const ref=S.db.doc('inspections/'+rid);let sn=await ref.get();if(sn.exists)return true;
  let lease=null;if(typeof ref.acquire==='function'){try{lease=await ref.acquire({ttlMs:8000});}catch(e){lease=null;}if(lease&&lease.acquired===false){await new Promise(r=>setTimeout(r,1200));sn=await ref.get();if(sn.exists)return true;}}
  sn=await ref.get();if(sn.exists)return true;const m=inspMe();const now=Date.now();
  await ref.set({buildingId:bid,date,shared:true,status:'draft',createdBy:m?m.id:'',authorId:m?m.id:'',authorUid:S.myId||'',participants:m?{[m.id]:true}:{},points:{},ptPh:{},generalComment:'',createdAt:now,lastChangeAt:now,submittedAt:null,submittedBy:null,reviewerId:null,reviewComment:'',walkerReply:'',reviewedAt:null,archived:false,exportId:null,purged:false});
  devLog('Обхід: створено спільний звіт · '+inspBShort(bid)+' · '+dm(date));return true;}
/* фото звіту (живий список, поки відкритий майстер) */
function inspLiveOn(rid){if(S.inspLive&&S.inspLive.rid===rid)return;inspLiveOff();const L={rid,list:[],unsub:null,ok:false};S.inspLive=L;
  try{L.unsub=S.db.collection('inspection_photos').where('inspectionId','==',rid).onSnapshot(q=>{L.list=q.docs.map(d=>({id:d.id,...d.data()}));L.ok=true;S.inspPhById=S.inspPhById||{};L.list.forEach(p=>S.inspPhById[p.id]=p);if(S.inspW&&S.inspW.id===rid)render();},()=>{L.ok=true;});}catch(e){L.ok=true;}}
function inspLiveOff(){if(S.inspLive&&S.inspLive.unsub)try{S.inspLive.unsub();}catch(e){}S.inspLive=null;}
/* фото точки: з бази (спільні), з черги (ще не відправлені) */
function inspPhotosOf(x,k,photos){if(!x)return [];if(x.shared){const pm=(x.ptPh||{})[k]||{};const src=photos||S.inspPhById||{};return Object.entries(pm).filter(([,v])=>v).map(([id,v])=>src[id]||{id,thumb:v.mini,mini:v.mini,authorId:v.by,addedAt:v.at,takenAt:v.takenAt||v.at,fromGallery:!!v.gal,_stub:true}).sort((a,b)=>(a.addedAt||0)-(b.addedAt||0));}
  const v=(x.points||{})[k];return ((v&&v.photoIds)||[]).map(id=>(photos||S.inspPhById||{})[id]).filter(Boolean);}
function inspPhCount(x,k){if(!x)return 0;if(x.shared)return Object.values((x.ptPh||{})[k]||{}).filter(Boolean).length;const v=(x.points||{})[k];return ((v&&v.photoIds)||[]).length;}
function inspMini(x){if(!x)return [];if(!x.shared)return x.mini||[];const a=[];Object.values(x.ptPh||{}).forEach(m=>Object.values(m||{}).forEach(v=>{if(v&&v.mini)a.push(v);}));return a.sort((p,q)=>(p.at||0)-(q.at||0)).map(v=>v.mini);}
function inspPhN(x){if(!x)return 0;if(!x.shared)return x.photosN||0;return Object.values(x.ptPh||{}).reduce((a,m)=>a+Object.values(m||{}).filter(Boolean).length,0);}
function inspWho(x){if(!x)return [];const ids=new Set([x.authorId,x.createdBy,...Object.keys(x.participants||{})]);Object.values(x.ptPh||{}).forEach(m=>Object.values(m||{}).forEach(v=>v&&ids.add(v.by)));Object.values(x.points||{}).forEach(v=>v&&v.by&&ids.add(v.by));ids.delete(undefined);ids.delete(null);ids.delete('');return [...ids].map(staffById).filter(Boolean);}
function inspAfterSubmit(x){if(!x||!x.shared||!x.submittedAt||!['submitted','returned'].includes(x.status))return [];const a=[];
  Object.entries(x.ptPh||{}).forEach(([k,m])=>Object.values(m||{}).forEach(v=>{if(v&&v.at>x.submittedAt)a.push({k,by:v.by,at:v.at,what:'фото'});}));
  Object.entries(x.points||{}).forEach(([k,v])=>{if(v&&v.at>x.submittedAt)a.push({k,by:v.by,at:v.at,what:'стан'});});return a.sort((p,q)=>p.at-q.at);}
/* стан точок з урахуванням ще не відправлених змін */
function inspPointsOf(rid){const x=inspRep(rid)||{};const P=JSON.parse(JSON.stringify(x.points||{}));inspQOf(rid).filter(q=>q.kind==='patch').forEach(q=>{P[q.key]=Object.assign(P[q.key]||{},q.patch,{_pending:true});});return P;}
/* ---------- відправка черги ---------- */
async function inspUploadPhoto(q){const A=await inspAssetsNs();const m=staffById(q.authorId);let assetId=q.assetId||null,data=null;
  if(!assetId&&A){try{const up=await A.upload(q.blob,{type:'image/jpeg'});assetId=up.id;q.assetId=assetId;await IDBX.put(q);}catch(e){if(e&&['not_granted','unsupported_type','quota_or_state','resource_exhausted'].includes(e.code)){assetId=null;q.storeNote=e.code;}else throw inspErr('upload',(e&&e.code)||'network',e&&e.message);}}
  if(!assetId){const small=q.blob.size>170*1024?await inspFit(inspCanvas(await inspDecode(q.blob),1280),170*1024):q.blob;data=await inspB2U(small);}
  const x=inspRep(q.inspId);const after=!!(x&&x.submittedAt&&['submitted','returned'].includes(x.status));const docId=q.inspId+'_'+q.lid;const now=Date.now();
  await S.db.doc('inspection_photos/'+docId).set({inspectionId:q.inspId,pointKey:q.pointKey,assetId,data,thumb:q.meta.thumb,takenAt:q.meta.takenAt,exifAt:q.meta.exifAt||null,fromGallery:!!q.meta.fromGallery,sizeKb:q.meta.sizeKb,w:q.meta.w||null,h:q.meta.h||null,purged:false,authorId:q.authorId,addedAt:q.at||now,afterSubmit:after});
  await S.db.doc('inspections/'+q.inspId).update({ptPh:{[q.pointKey]:{[docId]:{by:q.authorId,at:q.at||now,takenAt:q.meta.takenAt,gal:!!q.meta.fromGallery,mini:q.meta.mini}}},participants:{[q.authorId]:true},lastChangeAt:now});
  return docId;}
async function inspSync(){if(inspSync.busy||!S.db)return 0;const Q=Object.values(S.inspQ||{}).filter(q=>(q.kind==='photo'&&q.blob)||q.kind==='patch');if(!Q.length)return 0;inspSync.busy=true;let sent=0;
  try{for(const q of Q.sort((a,b)=>a.at-b.at)){try{
        const x=inspRep(q.inspId);if(inspLocked(x)){q.err='locked';q.stage='rights';await IDBX.put(q);continue;}
        await inspEnsure(q.inspId,q.bid,q.date);
        if(q.kind==='photo'){await inspUploadPhoto(q);}
        else{const m=inspMe();await S.db.doc('inspections/'+q.inspId).update({points:{[q.key]:Object.assign({},q.patch,{by:q.by||(m?m.id:''),at:q.at})},participants:q.by?{[q.by]:true}:{},lastChangeAt:Date.now()});}
        await inspQDel(q.id);sent++;}
      catch(e){q.err=(e&&(e.code||e.message))||'network';q.stage=(e&&e.stage)||'upload';q.lastTry=Date.now();q.tries=(q.tries||0)+1;try{await IDBX.put(q);}catch(_){}
        if(q.kind==='photo'&&q.tries===1)inspLogErr(Object.assign(e||{},{stage:q.stage}),q,null);}}}
  finally{inspSync.busy=false;}
  if(sent&&S.tab==='uk')render();return sent;}
addEventListener('online',()=>{inspSync();});setInterval(()=>{if(Object.keys(S.inspQ||{}).length&&navigator.onLine!==false)inspSync();},20000);
/* додати фото до точки: обробка → черга на телефоні → відправка; при помилці фото лишається в черзі з «Спробувати ще раз» */
/* байти читаємо одразу після вибору — до очищення поля і перемальовування (Android відкликає доступ до файлу з галереї) */
async function inspPreRead(files){S.inspBusy=(S.inspBusy||0)+1;try{return await Promise.all(files.slice(0,6).map(f=>inspSrc(f).then(s=>({s}),e=>({e}))));}finally{S.inspBusy=Math.max(0,S.inspBusy-1);}}
async function inspAddPhotos(rid,bid,date,p,files,gallery,pre){const m=inspMe();if(!m){toast('Спершу оберіть себе в колективі');return;}
  if(!inspCanEditRep(bid)){toast(inspErrText({code:'rights'}));devLog('Обхід: спроба додати фото без закріплення · '+inspBShort(bid),'err',m.name+' | '+inspUA());return;}
  if(inspLocked(inspRep(rid))){toast(inspErrText({code:'locked'}));return;}
  for(let fi=0;fi<files.length;fi++){const f=files[fi];const have=inspPhCount(inspRep(rid),p.k)+inspQOf(rid).filter(q=>q.kind==='photo'&&q.pointKey===p.k).length;if(have>=p.max){toast('Для цієї точки до '+p.max+' фото');break;}
    const lid=Date.now().toString(36)+Math.random().toString(36).slice(2,6);const q={id:'ph:'+lid,kind:'photo',inspId:rid,bid,date,pointKey:p.k,authorId:m.id,lid,at:Date.now(),meta:{fromGallery:!!gallery,name:f.name||'',type:f.type||'',size:f.size||0}};
    S.inspBusy=(S.inspBusy||0)+1;render();
    let src=null;try{const pr=pre&&pre[fi];if(pr&&pr.e)throw pr.e;src=pr&&pr.s?pr.s:await inspSrc(f);const hd=src.hd;Object.assign(q.meta,{fmt:hd.fmt,dims:hd.w?hd.w+'×'+hd.h:'',hex:hd.hex,eoi:hd.eoi,partial:hd.partial});if(hd.partial)devLog('Обхід: фото прочитано частково · '+inspBShort(bid)+' · '+p.n,'err',m.name+' | '+(hd.notes||[]).join('; ')+' | '+inspUA());q.meta.exifAt=hd.exifAt||null;const tk=hd.exifAt||(gallery?(f.lastModified||Date.now()):Date.now());q.meta.takenAt=tk;
      const r=await inspProcess(f,{takenAt:tk,bid,point:p.n,who:m.name,gallery},src);Object.assign(q.meta,{thumb:r.thumb,mini:r.mini,sizeKb:r.sizeKb,w:r.w,h:r.h});q.blob=r.blob;
      const saved=await IDBX.put(q);S.inspQ=S.inspQ||{};S.inspQ[q.id]=q;if(!saved&&!IDBX.mem.has(q.id))throw inspErr('save','idb','IndexedDB не зберіг');}
    catch(e){q.raw=src?src.blob:f;q.err=(e&&e.code)||'error';q.stage=(e&&e.stage)||'decode';q.msg=(e&&e.message)||'';await inspQPut(q);inspLogErr(e,q,f);toast(inspErrText(e));}
    finally{S.inspBusy=Math.max(0,(S.inspBusy||1)-1);}}
  render();const n=await inspSync();const left=inspQOf(rid).filter(q=>q.kind==='photo'&&q.blob);if(left.length&&navigator.onLine===false)toast(inspErrText({stage:'upload'}));}
async function inspRetry(q){if(q.blob){q.err=null;await IDBX.put(q);await inspSync();const still=(S.inspQ||{})[q.id];if(still)toast(inspErrText({stage:still.stage||'upload',code:still.err}));render();return;}
  if(!q.raw){toast('Оригінал фото не зберігся — зробіть знімок ще раз.');return;}const f=q.raw;const m=staffById(q.authorId)||inspMe();
  try{const src=await inspSrc(f);if(!(f instanceof File))q.raw=src.blob;Object.assign(q.meta,{fmt:src.hd.fmt,dims:src.hd.w?src.hd.w+'×'+src.hd.h:'',hex:src.hd.hex,eoi:src.hd.eoi});const tk=q.meta.takenAt||src.hd.exifAt||(q.meta.fromGallery?(f.lastModified||Date.now()):q.at);const r=await inspProcess(f,{takenAt:tk,bid:q.bid,point:inspPt(q.pointKey).n,who:m?m.name:'',gallery:q.meta.fromGallery},src);
    Object.assign(q.meta,{thumb:r.thumb,mini:r.mini,sizeKb:r.sizeKb,w:r.w,h:r.h,takenAt:tk});q.blob=r.blob;delete q.raw;q.err=null;q.stage=null;await inspQPut(q);await inspSync();}
  catch(e){q.err=(e&&e.code)||'error';q.stage=(e&&e.stage)||'decode';q.tries=(q.tries||0)+1;await inspQPut(q);inspLogErr(e,q,f);toast(inspErrText(e));}render();}
/* зміна стану точки: злиття поля в документі звіту (без перезапису чужих точок); офлайн — у чергу */
let _inspPT={};function inspSetPoint(rid,bid,date,k,patch,now){const m=inspMe();if(!m)return;if(!inspCanEditRep(bid)){toast(inspErrText({code:'rights'}));return;}if(inspLocked(inspRep(rid))){toast(inspErrText({code:'locked'}));return;}
  const id='pt:'+rid+':'+k;const cur=(S.inspQ||{})[id];const q={id,kind:'patch',inspId:rid,bid,date,key:k,by:m.id,patch:Object.assign({},cur?cur.patch:{},patch),at:Date.now()};S.inspQ=S.inspQ||{};S.inspQ[id]=q;IDBX.put(q);
  clearTimeout(_inspPT[id]);_inspPT[id]=setTimeout(()=>inspSync(),now?0:700);}
/* ---------- стан будівлі сьогодні ---------- */
function inspTodayOf(bid){const m=inspMe();if(!m)return null;const date=ymd(new Date());const rid=inspRid(date,bid);const x=inspRep(rid);
  if(x)return {id:rid,st:x.status||'draft',doc:x,shared:true};
  const lg=(S.insp||{})[inspId(date,bid,m.id)];if(lg&&lg.status!=='draft')return {id:lg.id,st:lg.status,doc:lg,legacy:true};
  if(inspQOf(rid).length)return {id:rid,st:'draft',shared:true};return {id:rid,st:'none',shared:true};}
/* хто що заповнив: «Віктор: 2 з 4 точок · Роман: 1» */
function inspFillText(bid,x){if(!x||!x.shared)return '';const pts=inspPts(bid);const by={};
  pts.forEach(p=>{const who=new Set();Object.values((x.ptPh||{})[p.k]||{}).forEach(v=>v&&who.add(v.by));const v=(x.points||{})[p.k];if(v&&v.by&&v.status==='remark')who.add(v.by);who.forEach(s=>{by[s]=(by[s]||0)+1;});});
  const filled=pts.filter(p=>inspPhCount(x,p.k)>0).length;const names=Object.entries(by).map(([s,n])=>{const st=staffById(s);const nm=st?st.name.split(/\s+/)[0]:'—';return nm+': '+n;});
  return 'заповнено '+filled+' з '+pts.length+' точок'+(names.length?' · '+names.join(', '):'');}
function inspPill(st){const s=INSP_ST[st]||INSP_ST.none;return el('span',{class:'ip-st ip-'+s[1]},el('i'),s[0]);}
/* ---------- головний екран модуля ---------- */
function inspHead(){const g=FG.find(x=>x.id==='insp');return el('section',{class:'uk-head',style:'--c1:'+g.c1+';--c2:'+g.c2},el('span',{class:'uk-ic big'},svg(g.ic)),el('div',{},el('span',{class:'eyebrow',text:'Facility відділ'}),el('h2',{text:g.name}),el('p',{text:g.sub})));}
function inspView(){if(S.inspW)return inspWizard();inspLiveOff();if(S.inspA)return inspAssignView();if(S.inspDone)return inspDoneView();if(S.inspR)return inspReport(S.inspR);
  const rev=inspCanReview(),walk=inspIsWalker();const tabs=[walk?['mine','Мої будівлі']:null,rev?['feed','Звіти']:null,rev?['cov','Покриття']:null].filter(Boolean);
  if(!S.inspTab||!tabs.some(t=>t[0]===S.inspTab))S.inspTab=tabs.length?tabs[0][0]:'mine';
  const out=[inspHead()];
  const qd=inspQueued().filter(q=>q.authorId===(inspMe()||{}).id);if(qd.length){const bad=qd.filter(q=>!q.blob);
    out.push(el('div',{class:'card ip-q',role:'status'},el('span',{class:'ip-qd'}),el('div',{class:'stack',style:'gap:2px;flex:1'},el('b',{text:'На телефоні чекають відправки: '+qd.length+' фото'}),el('span',{class:'muted small',text:bad.length?bad.length+' потребують «Спробувати ще раз» у кроці обходу.':'Відправляться самі, щойно з’явиться зв’язок.'})),
      el('button',{class:'btn sm ghost',type:'button',onclick:async ev=>{ev.currentTarget.disabled=true;await inspSync();render();}},'Спробувати зараз')));}
  const acts=[];if(rev)acts.push(el('button',{class:'btn sm',type:'button',onclick:inspExportSheet},svg('<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>'),' Сформувати звіт'));
  if(inspCanAssign())acts.push(el('button',{class:'btn sm ghost',type:'button',onclick:inspAssignOpen},'Закріплення будівель'));
  if(tabs.length>1||acts.length)out.push(el('div',{class:'ip-bar'},tabs.length>1?el('div',{class:'seg',role:'tablist'},tabs.map(([k,l])=>el('button',{type:'button','aria-pressed':String(S.inspTab===k),onclick:()=>{S.inspTab=k;render();}},el('span',{text:l}),k==='feed'&&inspPending()?el('small',{text:inspPending()+' на перевірці'}):null))):el('span'),acts.length?el('div',{class:'row',style:'gap:8px'},acts):null));
  if(!tabs.length){out.push(el('div',{class:'card empty'},el('b',{text:'За вами не закріплено будівель'}),el('p',{class:'muted',style:'margin:0',text:'Зверніться до Віталія Головньова, щоб він закріпив за вами будівлі для обходу.'})));return out;}
  if(S.inspTab==='mine')out.push(...inspMine());else if(S.inspTab==='feed')out.push(...inspFeed());else out.push(...inspCoverage());
  return out;}
function inspMine(){const bl=inspMyBlds();const out=[];const st=bl.map(b=>({b,s:inspTodayOf(b.id)}));const done=st.filter(x=>['submitted','approved'].includes(x.s.st)).length;
  out.push(el('div',{class:'ip-sum'},el('b',{text:'Мої будівлі сьогодні'}),el('span',{class:'muted small',text:dmy(new Date())+' · відправлено '+done+' з '+bl.length+' · звіт по будівлі спільний для всіх обхідників'})));
  if(!done&&!st.some(x=>x.s.st==='draft'))out.push(el('div',{class:'card empty ip-empty'},el('b',{text:'Сьогодні ще жодного обходу'}),el('p',{class:'muted',style:'margin:0',text:'Фото насосної, ВРП і пожежного поста — це хвилини 3 на будівлю.'}),
    el('button',{class:'btn',type:'button',onclick:()=>inspStart(st[0].b.id)},'Почати обхід')));
  out.push(el('div',{class:'ip-blds'},st.map(({b,s})=>{const x=s.doc;const fill=s.shared&&x?inspFillText(b.id,x):'';const upd=x?inspAfterSubmit(x).length:0;
    return el('button',{type:'button',class:'card ip-b ip-b-'+(INSP_ST[s.st]||INSP_ST.none)[1],onclick:()=>{if(s.legacy||s.st==='approved')inspOpen(s.id);else inspStart(b.id);}},
      el('span',{class:'ip-bn'},el('b',{text:'Буд. '+b.fac}),el('span',{text:b.name}),el('small',{class:'muted',text:fill||b.addr})),inspPill(s.st),
      upd?el('span',{class:'ip-rc upd',text:'Оновлено після відправки: '+upd}):null,
      s.st==='returned'&&x?el('span',{class:'ip-rc',text:'Повернуто: '+(x.reviewComment||'')}):null,el('span',{class:'uk-go'},svg('<path d="m9 6 6 6-6 6"/>')));})));
  return out;}
/* ---------- майстер обходу (спільний звіт) ---------- */
async function inspStart(bid){const m=inspMe();if(!m){toast('Спершу оберіть себе в колективі');return;}if(!inspCanEditRep(bid)){toast(inspErrText({code:'rights'}));return;}
  const date=ymd(new Date());const rid=inspRid(date,bid);const x=inspRep(rid);if(inspLocked(x)){inspOpen(rid);return;}
  S.hist.push(snap());S.inspW={id:rid,bid,date,step:0};inspLiveOn(rid);SC().scrollTop=0;render();
  if(!x)inspEnsure(rid,bid,date).then(()=>devLog('Обхід: почато · '+inspBShort(bid))).catch(()=>{});else devLog('Обхід: відкрито спільний звіт · '+inspBShort(bid));}
function inspWD(){const w=S.inspW;return w?{id:w.id,bid:w.bid||(inspRep(w.id)||{}).buildingId,date:w.date||(inspRep(w.id)||{}).date}:null;}
function inspMissing(rid,bid){const x=inspRep(rid);return inspPts(bid).filter(p=>p.req&&!(inspPhCount(x,p.k)>0));}
function inspBadRemark(rid,bid){const P=inspPointsOf(rid);return inspPts(bid).filter(p=>{const v=P[p.k];return v&&v.status==='remark'&&!(v.comment||'').trim();});}
function inspExit(){const n=inspQOf((S.inspW||{}).id).filter(q=>q.kind==='photo').length;confirmSheet(n?'Вийти з обходу? '+n+' фото ще на телефоні — вони відправляться самі.':'Вийти з обходу? Усе вже збережено у спільному звіті.','Вийти з обходу',()=>{S.inspW=null;inspLiveOff();render();});}
function inspStepState(rid,p){const x=inspRep(rid);const n=inspPhCount(x,p.k)+inspQOf(rid).filter(q=>q.kind==='photo'&&q.pointKey===p.k).length;const v=inspPointsOf(rid)[p.k];if(v&&v.status==='remark')return 'rem';if(n||(!p.req&&v&&v.seen))return 'done';return '';}
function inspWizard(){const d=inspWD();if(!d||!d.bid){S.inspW=null;return inspView();}inspLiveOn(d.id);const x=inspRep(d.id);const pts=inspPts(d.bid);const N=pts.length+1;const step=Math.min(S.inspW.step,pts.length);
  const go=i=>{S.inspW.step=i;render();SC().scrollTop=0;};
  const tabs=el('div',{class:'iw-steps',role:'tablist','aria-label':'Кроки обходу'},pts.map((p,i)=>{const st=inspStepState(d.id,p);return el('button',{type:'button',role:'tab','aria-selected':String(i===step),class:'iw-s'+(i===step?' on':'')+(st?' '+st:''),onclick:()=>go(i)},
      el('span',{class:'iw-si','aria-hidden':'true',text:st==='rem'?'⚠':st==='done'?'✓':''}),el('span',{text:p.n}),p.req?el('span',{class:'iw-req',title:'обов’язково','aria-label':'обов’язково',text:'•'}):null);}),
    el('button',{type:'button',role:'tab','aria-selected':String(step===pts.length),class:'iw-s'+(step===pts.length?' on':''),onclick:()=>go(pts.length)},el('span',{class:'iw-si','aria-hidden':'true'}),el('span',{text:'Підсумок'})));
  setTimeout(()=>{const a=tabs.querySelector('.iw-s.on');if(a&&tabs.scrollWidth>tabs.clientWidth)tabs.scrollLeft=Math.max(0,a.offsetLeft-tabs.clientWidth/2+a.offsetWidth/2);},0);
  const who=inspWho(x).map(s=>s.name.split(/\s+/)[0]);const lock=inspLocked(x);
  const wrap=el('div',{class:'iw-wrap'},
    el('div',{class:'iw-top'},el('div',{class:'stack',style:'gap:2px;min-width:0;flex:1'},el('span',{class:'eyebrow',text:'Спільний звіт · '+dm(d.date)+(who.length?' · '+who.join(', '):'')}),el('b',{class:'iw-bn',text:inspBName(d.bid)})),x?inspPill(x.status||'draft'):null,
      el('button',{type:'button',class:'iconbtn sm','aria-label':'Вийти з обходу',onclick:inspExit},svg('<path d="M6 6l12 12M18 6 6 18"/>'))),
    lock?el('p',{class:'iw-lock',role:'note',text:'Звіт погоджено — його заблоковано, доступний лише перегляд.'}):x&&x.status==='submitted'?el('p',{class:'iw-info',role:'note',text:'Звіт уже на перевірці. Нові фото й зміни позначаться для перевіряючого як «оновлено після відправки».'}):x&&x.status==='returned'?el('p',{class:'iw-lock ret',role:'note',text:'Повернуто на доопрацювання: '+(x.reviewComment||'')}):null,
    el('div',{class:'iw-prog'},el('div',{class:'row between'},el('b',{text:'Крок '+(step+1)+' з '+N}),el('span',{class:'muted small'},el('span',{class:'iw-req',text:'•'}),' — обов’язково')),el('div',{class:'iw-bar','aria-hidden':'true'},el('i',{style:'width:'+((step+1)/N*100)+'%'}))),
    tabs);
  if(step<pts.length)wrap.append(...inspPointStep(d,pts[step],step,pts));else wrap.append(...inspSummary(d));
  return [wrap];}
function inspPhTile(p,lock,d,pt){const a=staffById(p.authorId);const old=p.exifAt&&inspKyivYmd(p.exifAt)!==d.date;const can=!lock&&!p._stub&&inspCanDelPhoto(p);
  return el('span',{class:'iw-t2'},el('span',{class:'thumb iw-t'},el('img',{src:p.thumb||p.mini,alt:pt.n}),p.fromGallery?el('span',{class:'iw-gal',text:'з галереї'}):null,
      can?el('button',{type:'button',class:'x','aria-label':'Видалити фото','data-tip':'Видалити фото',onclick:()=>inspDelPhoto(d,pt,p)},'×'):null),
    el('small',{class:'iw-by',text:'Додав: '+(a?a.name:'—')+' · '+inspKyivHM(p.addedAt||p.takenAt)}),old?el('small',{class:'iw-old',text:'знято '+dm(inspKyivYmd(p.exifAt))}):null);}
function inspQTile(q,pt){const busy=!q.err&&q.blob;const st=q.err?inspErrText({code:q.err,stage:q.stage}):busy?'Надсилається…':'';
  return el('span',{class:'iw-t2 q'+(q.err?' err':'')},el('span',{class:'thumb iw-t'},q.meta&&q.meta.thumb?el('img',{src:q.meta.thumb,alt:pt.n}):el('span',{class:'iw-qph','aria-hidden':'true',text:'!'})),
    el('small',{class:'iw-by',role:q.err?'alert':null,text:st}),
    q.err?el('span',{class:'iw-qa'},el('button',{type:'button',class:'btn sm',onclick:()=>inspRetry(q)},'Спробувати ще раз'),el('button',{type:'button',class:'btn sm ghost',onclick:()=>{const t=['Обхід: фото',inspBShort(q.bid),inspPt(q.pointKey).n,'етап: '+(q.stage||'?'),'код: '+(q.err||''),q.msg||'',(q.meta&&(q.meta.fromGallery?'галерея ':'камера ')+(q.meta.type||'')+' '+Math.round((q.meta.size||0)/1024)+' КБ · формат '+(q.meta.fmt||'?')+(q.meta.dims?' '+q.meta.dims:'')+(q.meta.hex?' · '+q.meta.hex:''))||'',inspUA(),new Date(q.at).toISOString()].join(' | ');try{navigator.clipboard.writeText(t).then(()=>toast('Деталі скопійовано'),()=>toast(t));}catch(e){toast(t);}}},'Скопіювати деталі'),el('button',{type:'button',class:'btn sm ghost',onclick:()=>confirmSheet('Прибрати це фото з черги? Його ще не відправлено.','Прибрати фото',async()=>{await inspQDel(q.id);render();})},'Прибрати')):null);}
async function inspDelPhoto(d,pt,p){confirmSheet('Видалити фото з точки «'+pt.n+'»? Його бачитимуть усі в спільному звіті.','Видалити фото',async()=>{const A=await inspAssetsNs();
  await write(async()=>{await S.db.doc('inspections/'+d.id).update({ptPh:{[pt.k]:{[p.id]:null}},lastChangeAt:Date.now()});if(p.assetId&&A){try{await A.delete(p.assetId);}catch(e){}}await S.db.doc('inspection_photos/'+p.id).delete();},'Фото видалено');render();});}
function inspPointStep(d,p,step,pts){const x=inspRep(d.id);const lock=inspLocked(x);const P=inspPointsOf(d.id);const v=P[p.k]||{status:'ok'};
  if(!v.seen&&!lock&&!p.req){/* необов’язкова точка вважається переглянутою */}
  const box=el('section',{class:'card iw-card','aria-labelledby':'iwH'});const err=el('p',{class:'iw-err',role:'alert',hidden:true});
  const set=(patch,now)=>inspSetPoint(d.id,d.bid,d.date,p.k,patch,now);
  const phs=inspPhotosOf(x,p.k,Object.fromEntries(((S.inspLive&&S.inspLive.list)||[]).map(q=>[q.id,q])));const qs=inspQOf(d.id).filter(q=>q.kind==='photo'&&q.pointKey===p.k);
  const grid=el('div',{class:'iw-ph'},phs.map(q=>inspPhTile(q,lock,d,p)),qs.map(q=>inspQTile(q,p)),S.inspBusy?el('span',{class:'thumb iw-sk','aria-label':'Обробляємо фото'}):null);
  const cam=el('input',{type:'file',accept:'image/*',capture:'environment',class:'iw-file','aria-label':'Зробити фото: '+p.n});cam.addEventListener('change',async()=>{const f=[...cam.files];const pre=await inspPreRead(f);cam.value='';inspAddPhotos(d.id,d.bid,d.date,p,f,false,pre);});
  const gal=el('input',{type:'file',accept:'image/*',multiple:true,class:'iw-file','aria-label':'Додати з галереї: '+p.n});gal.addEventListener('change',async()=>{const f=[...gal.files];const pre=await inspPreRead(f);gal.value='';inspAddPhotos(d.id,d.bid,d.date,p,f,true,pre);});
  const n=phs.length+qs.length;
  box.append(el('div',{class:'stack',style:'gap:4px'},el('h2',{id:'iwH',text:p.n}),el('span',{class:'muted small',text:(p.req?'Обов’язково · ':'Необов’язково · ')+p.hint})),
    lock?null:el('div',{class:'iw-cam'},el('label',{class:'btn filebtn iw-camb'},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' Зробити фото',cam),el('label',{class:'btn ghost filebtn iw-camb'},svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'),' З галереї',gal)),
    n||S.inspBusy?grid:'',el('span',{class:'muted small',text:n+' з '+p.max+' фото'+(p.req&&!n?' · потрібне хоча б одне (додати може будь-хто з обхідників)':'')}));
  const dis=lock?true:null;
  if(p.meter){const mi=el('input',{id:'iwMeter',type:'text',inputmode:'decimal',disabled:dis,placeholder:'напр. 6534,5',value:v.meterValue!=null?String(v.meterValue):''});
    mi.addEventListener('change',()=>{const t=mi.value.trim().replace(',','.');if(t!==''&&isNaN(+t)){err.textContent='Показник — це число, напр. 6534 або 6534,5';err.hidden=false;return;}err.hidden=true;set({meterValue:t===''?null:+t});});
    const tw=el('input',{type:'checkbox',class:'ck',id:'iwToW',disabled:dis,checked:v.toWater?true:null});tw.addEventListener('change',()=>set({toWater:tw.checked}));
    box.append(el('label',{for:'iwMeter'},'Показник лічильника, м³ (необов’язково)',mi),el('label',{class:'ck-row',for:'iwToW'},tw,el('span',{text:'Передати показник в «Облік → Вода»'})));}
  if(p.check){const cl=Object.assign({},v.checklist||{});box.append(el('fieldset',{class:'iw-fs'},el('legend',{class:'flabel',text:'Перевірте на місці'}),el('div',{class:'iw-cl'},p.check.map(([k,l])=>{const id='iwCk_'+k;const c=el('input',{type:'checkbox',class:'ck',id,disabled:dis,checked:cl[k]?true:null});c.addEventListener('change',()=>{cl[k]=c.checked;set({checklist:Object.assign({},cl)});});
    return el('label',{class:'ck-row',for:id},c,el('span',{text:l}));}))));}
  const cm=el('textarea',{id:'iwCm',disabled:dis,placeholder:'напр. «Немає вогнегасника на посту»',maxlength:'600'});cm.value=v.comment||'';
  cm.addEventListener('input',()=>{if(cm.value.trim())err.hidden=true;});cm.addEventListener('change',()=>set({comment:cm.value}));
  cm.addEventListener('blur',()=>{if((v.status)==='remark'&&!cm.value.trim()){err.textContent='Опишіть зауваження — без коментаря його не зрозуміють.';err.hidden=false;}});
  const seg=el('div',{class:'iw-seg',role:'radiogroup','aria-label':'Стан точки'},[['ok','Норма','✓'],['remark','Зауваження','⚠']].map(([k,l,ic])=>el('button',{type:'button',role:'radio',disabled:dis,class:'iw-sb '+k,'aria-checked':String((v.status||'ok')===k),onclick:()=>{set({status:k,priority:k==='remark'?(v.priority||'mid'):null,seen:true},true);render();if(k==='remark')setTimeout(()=>{const c=document.getElementById('iwCm');if(c&&!IS_TOUCH)c.focus();},0);}},el('span',{class:'iw-si','aria-hidden':'true',text:ic}),l)));
  const by=v.by&&staffById(v.by);
  box.append(el('fieldset',{class:'iw-fs'},el('legend',{class:'flabel',text:'Стан'}),seg,by?el('small',{class:'muted',text:'Стан вказав: '+by.name+(v.at?' · '+inspKyivHM(v.at):'')+(v._pending?' · ще не відправлено':'')}):null));
  if(v.status==='remark')box.append(el('label',{for:'iwCm'},'Коментар до зауваження (обов’язково)',cm),
    el('fieldset',{class:'iw-fs'},el('legend',{class:'flabel',text:'Пріоритет'}),el('div',{class:'iw-seg three',role:'radiogroup','aria-label':'Пріоритет'},Object.entries(INSP_PRIO).map(([k,l])=>el('button',{type:'button',role:'radio',disabled:dis,class:'iw-sb pr-'+k,'aria-checked':String((v.priority||'mid')===k),onclick:()=>{set({priority:k},true);render();}},l)))));
  box.append(err);
  const nav=el('div',{class:'iw-nav'},step>0?el('button',{class:'btn ghost',type:'button',onclick:()=>{S.inspW.step=step-1;render();SC().scrollTop=0;}},'Назад'):el('button',{class:'btn ghost',type:'button',onclick:inspExit},'Вийти'),
    el('button',{class:'btn',type:'button',onclick:()=>{const vv=inspPointsOf(d.id)[p.k]||{};if(!lock&&vv.status==='remark'&&!(cm.value||vv.comment||'').trim()){err.textContent='Опишіть зауваження — без коментаря його не зрозуміють.';err.hidden=false;cm.focus();return;}if(!lock&&cm.value!==(vv.comment||''))set({comment:cm.value});if(!lock&&!p.req&&!vv.seen)set({seen:true});S.inspW.step=step+1;render();SC().scrollTop=0;}},step===pts.length-1?'До підсумку':'Далі'));
  return [box,nav];}
function inspSummary(d){const x=inspRep(d.id);const lock=inspLocked(x);const P=inspPointsOf(d.id);const miss=inspMissing(d.id,d.bid),bad=inspBadRemark(d.id,d.bid);const qn=inspQOf(d.id).filter(q=>q.kind==='photo');const out=[];
  const gc=el('textarea',{id:'iwGc',disabled:lock?true:null,placeholder:'напр. «Біля входу перегоріла лампа»',maxlength:'800'});gc.value=(x&&x.generalComment)||'';
  gc.addEventListener('change',()=>{if(!x)return;S.db.doc('inspections/'+d.id).update({generalComment:gc.value,lastChangeAt:Date.now()}).catch(()=>toast('Немає зв’язку — коментар не збережено, спробуйте пізніше.'));});
  out.push(el('section',{class:'card iw-card','aria-labelledby':'iwSum'},el('h2',{id:'iwSum',text:'Підсумок'}),el('div',{class:'iw-rows'},inspPts(d.bid).map((p,i)=>{const ph=inspPhotosOf(x,p.k);const v=P[p.k]||{};const who=[...new Set(ph.map(q=>q.authorId))].map(staffById).filter(Boolean).map(s=>s.name.split(/\s+/)[0]);const qp=qn.filter(q=>q.pointKey===p.k).length;
    return el('button',{type:'button',class:'iw-row',onclick:()=>{S.inspW.step=i;render();}},el('span',{class:'iw-rn'},el('b',{text:p.n}),el('small',{class:v.status==='remark'?'iw-rem':'muted',text:(v.status==='remark'?'⚠ Зауваження · '+INSP_PRIO[v.priority||'mid']+(v.comment?' — '+v.comment:''):'✓ Норма')+(p.meter&&v.meterValue!=null?' · показник '+v.meterValue:'')+(who.length?' · фото: '+who.join(', '):'')+(qp?' · '+qp+' на телефоні':'')})),
      el('span',{class:'iw-mini'},ph.length?ph.slice(0,3).map(q=>el('img',{src:q.mini||q.thumb,alt:''})):el('span',{class:p.req?'iw-need':'muted small',text:p.req?'немає фото':'без фото'})));})),
    el('label',{for:'iwGc'},'Загальний коментар (необов’язково)',gc)));
  if(lock){out.push(el('div',{class:'iw-nav'},el('button',{class:'btn ghost',type:'button',onclick:()=>{S.inspW.step=inspPts(d.bid).length-1;render();}},'Назад'),el('button',{class:'btn',type:'button',onclick:()=>{S.inspW=null;inspOpen(d.id);}},'Відкрити звіт')));return out;}
  const resend=x&&x.status==='returned';const already=x&&x.status==='submitted';
  const why=qn.length?'Спершу мають відправитися фото з телефону ('+qn.length+'). Перевірте зв’язок.':miss.length?'Щоб відправити, додайте фото: '+miss.map(p=>p.n).join(', ')+'. Додати може будь-хто з обхідників.':bad.length?'Опишіть зауваження: '+bad.map(p=>p.n).join(', ')+'.':'';
  if(already)out.push(el('p',{class:'iw-info',text:'Звіт уже відправлено на перевірку'+(x.submittedBy&&staffById(x.submittedBy)?' ('+staffById(x.submittedBy).name+', '+inspKyivHM(x.submittedAt)+')':'')+'. Доповнювати можна до погодження.'}));
  else if(why)out.push(el('p',{id:'iwWhy',class:'iw-why',text:why}));
  const rep=resend?el('textarea',{id:'iwRep',placeholder:'Що виправили — для перевіряючого',maxlength:'600'}):null;if(rep)rep.value=(x&&x.walkerReply)||'';
  if(rep)out.push(el('label',{for:'iwRep'},'Коментар для перевіряючого (обов’язково)',rep));
  const go=el('button',{class:'btn',type:'button',disabled:(why||already)?true:null,'aria-describedby':why?'iwWhy':null,onclick:async()=>{if(rep&&!rep.value.trim()){toast('Напишіть, що виправили');rep.focus();return;}
      go.disabled=true;go.textContent='Надсилаю…';await inspSync();const ok=await inspSubmit(d,rep?rep.value.trim():null,gc.value);if(!ok){go.disabled=false;go.textContent=resend?'Надіслати повторно':'Відправити звіт';return;}
      S.inspDone={id:d.id,bid:d.bid,sent:true};S.inspW=null;inspLiveOff();S.inspR=null;render();SC().scrollTop=0;}},resend?'Надіслати повторно':already?'Вже на перевірці':'Відправити звіт');
  out.push(el('div',{class:'iw-nav'},el('button',{class:'btn ghost',type:'button',onclick:()=>{S.inspW.step=inspPts(d.bid).length-1;render();}},'Назад'),go));
  return out;}
async function inspSubmit(d,reply,gcom){const x=inspRep(d.id);const m=inspMe();if(!x){toast('Немає зв’язку з базою — звіт ще не створено. Спробуйте за хвилину.');return false;}
  if(inspQOf(d.id).some(q=>q.kind==='photo')){toast('Спершу мають відправитися фото з телефону. Перевірте зв’язок.');return false;}
  if(inspMissing(d.id,d.bid).length){toast('Не всі обов’язкові точки мають фото');return false;}
  const P=inspPointsOf(d.id);const upd={status:'submitted',submittedAt:Date.now(),submittedBy:m?m.id:null,generalComment:gcom!=null?gcom:(x.generalComment||''),lastChangeAt:Date.now(),remarks:Object.values(P).filter(v=>v&&v.status==='remark').length,participants:m?{[m.id]:true}:{}};
  if(reply!=null)upd.walkerReply=reply;
  const wp=inspPts(d.bid).find(p=>p.meter);if(wp){const v=P[wp.k];if(v&&v.toWater&&v.meterValue!=null&&!v.waterSent){const r=await inspWaterSend({buildingId:d.bid,date:d.date},v);upd.points={[wp.k]:{waterSent:r==='ok',waterNote:r==='ok'?'':r}};}}
  try{await S.db.doc('inspections/'+d.id).update(upd);devLog('Обхід: відправлено спільний звіт · '+inspBShort(d.bid)+' · '+dm(d.date)+(reply!=null?' (повторно)':''));toast(reply!=null?'Звіт надіслано повторно':'Звіт відправлено');return true;}
  catch(e){toast('Немає зв’язку — звіт не відправлено. Усі фото вже збережені, спробуйте ще раз.');logErr('Обхід: відправка звіту — '+((e&&(e.code||e.message))||''),'insp');return false;}}
function inspDoneView(){const x=S.inspDone;const left=inspMyBlds().filter(b=>{const s=inspTodayOf(b.id);return s.st==='none'||s.st==='draft';});
  return [el('div',{class:'iw-wrap narrow'},el('section',{class:'card empty iw-done'+(x.sent?' ok':' wait')},el('span',{class:'iw-done-ic','aria-hidden':'true',text:x.sent?'✓':'⟳'}),el('h2',{text:x.sent?'Звіт відправлено':'Збережено на телефоні'}),
    el('p',{class:'muted',style:'margin:0',text:x.sent?inspBName(x.bid)+' — звіт отримано, його перевірять.':'Зв’язку немає, тож звіт чекає мережі й відправиться сам. Не видаляйте застосунок, поки звіт не піде.'})),
    el('div',{class:'iw-nav static'},el('button',{class:'btn ghost',type:'button',onclick:()=>{S.inspDone=null;render();}},'До списку будівель'),left.length?el('button',{class:'btn',type:'button',onclick:()=>{S.inspDone=null;inspStart(left[0].id);}},'Далі: Буд. '+left[0].fac):null))];}
/* ---------- закріплення будівель (окрема сторінка) ---------- */
const INSP_REV_ROLES={director:'керівник Facility',ceo:'CEO Asgard'};
function inspRoles(s){return [s.role,s.extraRole].filter(Boolean);}
function inspIsRevStaff(s){return inspRoles(s).some(r=>INSP_REV_ROLES[r]);}
/* Хто може обходити: працівники Facility за звичайними ролями + керівники з увімкненим «Також проводить обхід» */
const INSP_WALK_ROLES=['senior','engineer','master'];
function inspCandidates(){return sortedStaff().filter(s=>inspRoles(s).some(r=>INSP_WALK_ROLES.includes(r))||(s.walks&&inspIsRevStaff(s)));}
function inspAssignOpen(){S.hist.push(snap());S.inspA=true;S.inspAD=null;SC().scrollTop=0;render();}
function inspAssignView(){if(!inspCanAssign()){S.inspA=false;return inspView();}
  const D=S.inspAD=S.inspAD||Object.assign(Object.fromEntries(ARCH.map(b=>[b.id,new Set(inspAssignedRaw(b.id))])),{_all:new Set(inspAllIds())});
  const cand=inspCandidates();const extra=[...new Set([...ARCH.flatMap(b=>[...D[b.id]]),...D._all])].map(staffById).filter(s=>s&&!cand.includes(s));const cols=[...cand,...extra];
  const dirty=ARCH.some(b=>{const o=inspAssignedRaw(b.id);return o.length!==D[b.id].size||o.some(id=>!D[b.id].has(id));})||(()=>{const o=inspAllIds();return o.length!==D._all.size||o.some(id=>!D._all.has(id));})();
  const sum=b=>{const sn=s=>{const t=s.name.trim().split(/\s+/);const l=t[t.length-1];return t.length>1&&l.replace('.','').length>2?l:s.name;};const n=cols.filter(s=>D[b.id].has(s.id)||D._all.has(s.id)).map(sn);return n.length?el('small',{class:'muted',text:'Відповідальні: '+n.join(', ')}):el('small',{class:'ia-warn',text:'⚠ Нікого не закріплено'});};
  const revs=sortedStaff().filter(inspIsRevStaff);
  const out=[el('div',{class:'ia-wrap'},el('div',{class:'stack',style:'gap:4px'},el('span',{class:'eyebrow',text:'Обхід будівель'}),el('h2',{text:'Закріплення будівель'}),el('p',{class:'muted',style:'margin:0',text:'Обхідник бачить лише закріплені за ним будівлі. На одну будівлю можна закріпити кількох людей.'})),
    revs.length?el('p',{class:'ia-info'},el('b',{text:'Бачать усі будівлі: '}),revs.map(s=>s.name+' ('+inspRoles(s).map(r=>INSP_REV_ROLES[r]).filter(Boolean)[0]+')').join(', ')):null)];
  if(!cols.length){out.push(el('div',{class:'ia-wrap'},el('section',{class:'card empty'},el('b',{text:'У Facility відділі ще немає людей для обходу'}),el('p',{class:'muted',style:'margin:0',text:'Обхід проводять старший менеджер, головний інженер і майстри. Призначте цю роль потрібним людям у розділі «Колектив».'}),el('button',{class:'btn',type:'button',onclick:()=>go('team')},'Відкрити «Колектив»'))));return out;}
  const toggle=(bid,sid,on)=>{on?D[bid].add(sid):D[bid].delete(sid);render();};
  /* ПК / планшет: матриця */
  const tb=el('table',{class:'ia-mx'},el('thead',{},el('tr',{},el('th',{class:'nm',scope:'col',text:'Будівля'}),cols.map(s=>el('th',{scope:'col'},el('span',{class:'ia-ph'},avatar(s,'xs'),el('span',{text:s.name})),cand.includes(s)?null:el('small',{class:'muted',text:'поза Facility'}))))),
    el('tbody',{},el('tr',{class:'ia-all'},el('th',{class:'nm',scope:'row'},el('b',{text:'Усі будівлі'}),el('small',{class:'muted',text:'включно з новими з довідника'})),cols.map(s=>{const on=D._all.has(s.id);const id='ia_all_'+s.id;const c=el('input',{type:'checkbox',class:'ck',id,checked:on?true:null,'aria-label':'Закріпити '+s.name+' за всіма будівлями'});c.addEventListener('change',()=>toggle('_all',s.id,c.checked));return el('td',{class:on?'on':''},el('label',{class:'ia-cell',for:id},c));})),
      ARCH.map(b=>el('tr',{},el('th',{class:'nm',scope:'row'},el('b',{text:'Буд. '+b.fac+' · '+b.name}),sum(b)),cols.map(s=>{const viaAll=D._all.has(s.id);const on=D[b.id].has(s.id)||viaAll;const id='ia_'+b.id+'_'+s.id;const c=el('input',{type:'checkbox',class:'ck',id,checked:on?true:null,disabled:viaAll?true:null,title:viaAll?'Через «Усі будівлі»':null,'aria-label':'Закріпити '+s.name+' за Буд. '+b.fac+(viaAll?' (через «Усі будівлі»)':'')});c.addEventListener('change',()=>toggle(b.id,s.id,c.checked));
      return el('td',{class:on?'on':''},el('label',{class:'ia-cell',for:id},c));})))));
  /* телефон: список будівель → шторка */
  const list=el('div',{class:'ia-list'},el('button',{type:'button',class:'card ia-b ia-allb',onclick:()=>{const box=el('div',{class:'stack',style:'gap:4px'},cols.map(s=>{const id='iamall_'+s.id;const c=el('input',{type:'checkbox',class:'ck',id,checked:D._all.has(s.id)?true:null});c.addEventListener('change',()=>{c.checked?D._all.add(s.id):D._all.delete(s.id);});return el('label',{class:'ck-row big',for:id},c,avatar(s,'xs'),el('span',{text:s.name}));}));
      openSheet(el('h2',{text:'Усі будівлі'}),el('p',{class:'muted',style:'margin:0',text:'Ці люди бачать і можуть звітувати по всіх будівлях, включно з новими з довідника.'}),box,el('div',{class:'btn-pair'},el('button',{class:'btn',type:'button',onclick:()=>{closeSheet();render();}},'Готово')));}},
    el('span',{class:'stack',style:'gap:2px;min-width:0;flex:1;text-align:left'},el('b',{text:'Усі будівлі'}),el('small',{class:'muted',text:D._all.size?cols.filter(s=>D._all.has(s.id)).map(s=>s.name).join(', '):'нікого — закріплення по кожній будівлі окремо'})),el('span',{class:'uk-go','aria-hidden':'true'},svg('<path d="m9 6 6 6-6 6"/>'))),
    ARCH.map(b=>el('button',{type:'button',class:'card ia-b',onclick:()=>{const box=el('div',{class:'stack',style:'gap:4px'});const draw=()=>box.replaceChildren(...cols.map(s=>{const id='iam_'+s.id;const c=el('input',{type:'checkbox',class:'ck',id,checked:D[b.id].has(s.id)?true:null});c.addEventListener('change',()=>{c.checked?D[b.id].add(s.id):D[b.id].delete(s.id);});return el('label',{class:'ck-row big',for:id},c,avatar(s,'xs'),el('span',{text:s.name+(cand.includes(s)?'':' (поза Facility)')}));}));draw();
      openSheet(el('h2',{text:'Буд. '+b.fac+' · '+b.name}),el('p',{class:'muted',style:'margin:0',text:'Оберіть, хто обходить цю будівлю.'}),box,el('div',{class:'btn-pair'},el('button',{class:'btn',type:'button',onclick:()=>{closeSheet();render();}},'Готово')));}},
    el('span',{class:'stack',style:'gap:2px;min-width:0;flex:1;text-align:left'},el('b',{text:'Буд. '+b.fac+' · '+b.name}),sum(b)),el('span',{class:'uk-go','aria-hidden':'true'},svg('<path d="m9 6 6 6-6 6"/>')))));
  const save=el('button',{class:'btn',type:'button',disabled:dirty?null:true,onclick:()=>{const m=inspMe();write(async()=>{for(const b of ARCH){const ids=sortedStaff().map(s=>s.id).filter(id=>D[b.id].has(id));const old=inspAssignedRaw(b.id);if(ids.length===old.length&&ids.every(id=>old.includes(id)))continue;
      const prev=(S.inspAs||{})[b.id]||{};await S.db.doc('buildings_assignments/'+b.id).set({buildingId:b.id,userIds:ids,since:prev.since&&old.length?prev.since:ymd(new Date()),updatedBy:m?m.id:'',updatedAt:Date.now()});}
      {const o=inspAllIds();const ids=sortedStaff().map(s=>s.id).filter(id=>D._all.has(id));if(!(ids.length===o.length&&ids.every(id=>o.includes(id)))){const prev=(S.inspAs||{})._all||{};await S.db.doc('buildings_assignments/_all').set({buildingId:'_all',userIds:ids,since:prev.since&&o.length?prev.since:ymd(new Date()),updatedBy:m?m.id:'',updatedAt:Date.now()});}}
      devLog('Обхід: оновлено закріплення будівель');},'Збережено').then(()=>{S.inspAD=null;render();});}},'Зберегти зміни');
  out.push(el('div',{class:'ia-wrap wide'},el('div',{class:'card ia-tw'},el('div',{class:'tbl-x'},tb)),list,
    el('div',{class:'btn-pair end'},el('button',{class:'btn ghost',type:'button',disabled:dirty?null:true,onclick:()=>{S.inspAD=null;render();}},'Скасувати зміни'),save)));
  out.push(el('div',{class:'ia-wrap wide'},inspPumpCard(),inspSelfCheckCard()));
  return out;}
/* насосна по будівлях: обов’язкова / необов’язкова / немає (settings/main.inspBld) */
function inspPumpCard(){const cfg=(S.cfg&&S.cfg.inspBld)||{};return el('section',{class:'card stack',style:'gap:8px'},el('b',{text:'Точка «Насосна» по будівлях'}),el('span',{class:'muted small',text:'Там, де насосної немає, точка не показується в обході. Зміна діє для нових кроків одразу.'}),
  el('div',{class:'ia-pump'},ARCH.map(b=>{const id='iaP_'+b.id;const sel=el('select',{id},[['req','обов’язкова'],['opt','необов’язкова'],['none','немає']].map(([v,t])=>el('option',{value:v,text:t})));sel.value=(cfg[b.id]&&cfg[b.id].pump)||'req';
    sel.addEventListener('change',()=>write(()=>S.db.doc('settings/main').update({inspBld:{[b.id]:{pump:sel.value}},updatedAt:Date.now(),updatedBy:S.myId||''}).catch(()=>S.db.doc('settings/main').set({...(S.cfg||{}),inspBld:{...cfg,[b.id]:{pump:sel.value}},updatedAt:Date.now(),updatedBy:S.myId||''})),'Обхід: насосна · Буд. '+b.fac+' — '+sel.selectedOptions[0].textContent));
    return el('label',{for:id,class:'ia-pr'},el('span',{text:'Буд. '+b.fac+' · '+b.name}),sel);})));}
/* самоперевірка: id будівель у закріпленнях ↔ довідник «Архітектура та інформація» */
function inspSelfCheck(){const ids=new Set(ARCH.map(b=>b.id));const as=S.inspAs||{};const w=[];
  Object.keys(as).forEach(k=>{if(k!=='_all'&&!ids.has(k))w.push('У закріпленнях є будівля «'+k+'», якої немає в довіднику');});
  ARCH.forEach(b=>{if(!inspAssigned(b.id).length)w.push('Буд. '+b.fac+' ні за ким не закріплена');});
  Object.entries(as).forEach(([k,a])=>(a.userIds||[]).forEach(id=>{if(!staffById(id))w.push('У закріпленні «'+k+'» є людина з id «'+id+'», якої немає в колективі');}));return w;}
function inspSelfCheckCard(){const w=inspSelfCheck();if(w.length&&!inspSelfCheck.logged&&(realDev()||hasAny(['director']))){inspSelfCheck.logged=1;devLog('Обхід: самоперевірка закріплень — '+w.join('; '),'err');}
  return el('section',{class:'card stack',style:'gap:6px'},el('b',{text:'Самоперевірка закріплень'}),w.length?el('ul',{class:'ia-warnl'},w.map(t=>el('li',{text:t}))):el('span',{class:'ip-okk',text:'Усі id будівель і людей у закріпленнях збігаються з довідником і колективом.'}));}
/* ---------- перевірка ---------- */
function inspFiltered(){const f=S.inspF||{};const now=new Date();const t0=ymd(now);let from=null;
  if(f.per==='today')from=t0;else if(f.per==='week'){const d=new Date(now);d.setDate(d.getDate()-6);from=ymd(d);}else if(!f.per||f.per==='month'){const d=new Date(now);d.setDate(d.getDate()-30);from=ymd(d);}
  return inspList().filter(x=>x.status!=='draft'&&(!from||x.date>=from)&&(!f.b||x.buildingId===f.b)&&(!f.w||x.authorId===f.w||!!(x.participants||{})[f.w])&&(!f.s||(f.s==='remark'?x.remarks>0:x.status===f.s)))
    .sort((a,b)=>b.date.localeCompare(a.date)||(b.submittedAt||0)-(a.submittedAt||0));}
function inspFeed(){const f=S.inspF=S.inspF||{per:'week'};const out=[];
  const sel=(id,lbl,key,opts)=>{const s=el('select',{id,class:'dz-bsel','aria-label':lbl},el('option',{value:'',text:lbl}),opts.map(([v,t])=>el('option',{value:v,text:t})));s.value=f[key]||'';s.addEventListener('change',()=>{f[key]=s.value;render();});return s;};
  const walkers=[...new Set(inspList().flatMap(x=>[x.authorId,...Object.keys(x.participants||{})]))].map(id=>staffById(id)).filter(Boolean);
  out.push(el('div',{class:'ip-fl'},el('div',{class:'seg ip-per'},[['today','Сьогодні'],['week','7 днів'],['month','30 днів'],['all','Усі']].map(([k,l])=>el('button',{type:'button','aria-pressed':String((f.per||'week')===k),onclick:()=>{f.per=k;render();}},l))),
    el('div',{class:'dz-fsel'},sel('ipB','Усі будівлі','b',ARCH.map(b=>[b.id,'Буд. '+b.fac+' · '+b.name])),sel('ipW','Усі обхідники','w',walkers.map(s=>[s.id,s.name])),sel('ipS','Усі статуси','s',[['submitted','На перевірці'],['approved','Погоджено'],['returned','Повернуто'],['remark','Є зауваження']]))));
  if(!S.inspLoaded){out.push(el('div',{class:'ip-feed'},[0,1,2].map(()=>el('div',{class:'card ip-sk','aria-hidden':'true'},el('i'),el('i'),el('i')))));return out;}
  const L=inspFiltered();
  if(!L.length){out.push(el('div',{class:'card empty'},el('b',{text:'Звітів за цими умовами немає'}),el('p',{class:'muted',style:'margin:0',text:'Змініть період або фільтри.'}),(f.b||f.w||f.s)?el('button',{class:'btn ghost',type:'button',onclick:()=>{f.b=f.w=f.s='';render();}},'Скинути фільтри'):null));return out;}
  out.push(el('div',{class:'ip-feed'},L.map(x=>{const a=staffById(x.authorId);return el('button',{type:'button',class:'card ip-fi',onclick:()=>inspOpen(x.id)},
    el('div',{class:'row between',style:'gap:8px;flex-wrap:nowrap'},el('span',{class:'ip-bn'},el('b',{text:inspBName(x.buildingId)}),el('small',{class:'muted',text:dm(x.date)+'.'+x.date.slice(0,4)+' · '+(x.shared?inspWho(x).map(s=>s.name.split(/\s+/)[0]).join(', '):(a?a.name:'—'))+' · '+(x.submittedAt?hm(x.submittedAt):'')})),inspPill(x.status)),
    el('div',{class:'ip-mi'},inspMini(x).slice(0,4).map(u=>el('img',{src:u,alt:''})),inspPhN(x)>4?el('span',{class:'ip-more',text:'+'+(inspPhN(x)-4)}):null),
    inspAfterSubmit(x).length?el('span',{class:'ip-rc upd',text:'Оновлено після відправки'}):null,
    inspRemarks(x)?el('span',{class:'ip-rm',text:inspRemarks(x)+' '+plural(inspRemarks(x),'зауваження','зауваження','зауважень')}):null);})));
  return out;}
function inspStatusOn(bid,date){const L=inspList().filter(x=>x.buildingId===bid&&x.date===date&&x.status!=='draft');if(!L.length)return null;const pr=['approved','submitted','returned'];L.sort((a,b)=>pr.indexOf(a.status)-pr.indexOf(b.status));return L[0];}
function inspCovDays(mode,off){const now=new Date();now.setHours(12,0,0,0);const out=[];if(mode==='month'){const y=now.getFullYear(),m=now.getMonth()+off;const a=new Date(y,m,1,12),n=new Date(y,m+1,0).getDate();for(let i=0;i<n;i++){const d=new Date(a);d.setDate(i+1);out.push(d);}}
  else{const mon=new Date(now);mon.setDate(mon.getDate()-((mon.getDay()+6)%7)+off*7);for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);out.push(d);}}return out;}
function inspExpected(bid,ds){if(!inspAssigned(bid).length)return false;const a=(S.inspAs||{})[bid]||(S.inspAs||{})._all||{};const since=a.since||(a.updatedAt?ymd(new Date(a.updatedAt)):'');return ds>=since;}
function inspCellSt(bid,d){const ds=ymd(d),t=ymd(new Date());const x=inspStatusOn(bid,ds);if(x)return {k:x.status==='approved'?'ok':x.status==='returned'?'ret':x.remarks?'rem':'sub',x};if(ds>t)return {k:'fut'};if(!inspExpected(bid,ds))return {k:'na'};if(ds<t)return {k:'miss'};return {k:'wait'};}
const INSP_CELL={ok:['✓','погоджено'],sub:['●','на перевірці'],rem:['⚠','є зауваження'],ret:['↺','повернуто'],miss:['✕','пропущено'],wait:['','сьогодні ще не відправлено'],na:['','не закріплено'],fut:['','ще не настав'],empty:['','ще не настав / не закріплено']};
function inspCoverage(){const mode=S.inspCm||'week',off=S.inspCo||0;const days=inspCovDays(mode,off);const W=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  const lbl=mode==='month'?perLabel(ymd(days[0]).slice(0,7)):dm(ymd(days[0]))+' – '+dm(ymd(days[6]));
  const out=[el('div',{class:'ip-fl cov'},el('div',{class:'seg ip-per'},[['week','Тиждень'],['month','Місяць']].map(([k,l])=>el('button',{type:'button','aria-pressed':String(mode===k),onclick:()=>{S.inspCm=k;S.inspCo=0;render();}},l))),
    el('div',{class:'row',style:'gap:6px'},el('button',{class:'iconbtn sm',type:'button','aria-label':'Попередній період',onclick:()=>{S.inspCo=off-1;render();}},svg('<path d="M15 5l-7 7 7 7"/>')),el('b',{class:'ip-clb',text:lbl}),
      el('button',{class:'iconbtn sm',type:'button','aria-label':'Наступний період',disabled:off>=0?true:null,onclick:()=>{S.inspCo=off+1;render();}},svg('<path d="m9 5 7 7-7 7"/>'))))];
  const t=ymd(new Date());
  const tb=el('table',{class:'ip-mx'+(mode==='month'?' mon':'')},el('colgroup',{},el('col',{class:'c-nm'}),days.map(()=>el('col',{class:'c-d'}))),el('thead',{},el('tr',{},el('th',{class:'nm',scope:'col',text:'Будівля'}),days.map(d=>el('th',{scope:'col',class:(ymd(d)===t?'now':'')+((d.getDay()+6)%7>4?' we':'')},el('span',{text:W[(d.getDay()+6)%7]}),el('b',{text:pad(d.getDate())}))))),
    el('tbody',{},ARCH.map(b=>el('tr',{},el('td',{class:'nm'},el('b',{text:'Буд. '+b.fac}),el('small',{class:'muted',text:b.name})),days.map(d=>{const c=inspCellSt(b.id,d);const lab=INSP_CELL[c.k];const cls='c-'+c.k+(ymd(d)===t?' now':'')+((d.getDay()+6)%7>4?' we':'');
      return el('td',{class:cls},c.x?el('button',{type:'button',class:'ip-cb','aria-label':'Буд. '+b.fac+', '+dm(ymd(d))+': '+lab[1]+' — відкрити звіт',title:lab[1]+(c.x.remarks?' · зауважень: '+c.x.remarks:''),onclick:()=>inspOpen(c.x.id)},lab[0]):el('span',{class:'ip-ce',title:lab[1],'aria-label':'Буд. '+b.fac+', '+dm(ymd(d))+': '+lab[1]},lab[0]));})))));
  const miss=ARCH.reduce((a,b)=>a+days.filter(d=>inspCellSt(b.id,d).k==='miss').length,0);
  out.push(el('div',{class:'card ip-mxw'},el('div',{class:'tbl-x'},tb),el('div',{class:'ip-lg'},['ok','sub','rem','ret','miss','empty'].map(k=>el('span',{class:'c-'+k},el('i',{text:INSP_CELL[k][0]}),INSP_CELL[k][1])),miss?el('b',{class:'ip-miss',text:'Пропущено обходів: '+miss}):el('span',{class:'ip-okk',text:'Пропусків немає'}))));
  return out;}
/* ---------- картка звіту ---------- */
function inspOpen(id){S.hist.push(snap());S.inspR=id;S.inspPhL=null;SC().scrollTop=0;render();inspLoadPhotos(id);}
async function inspLoadPhotos(id){try{const q=await S.db.collection('inspection_photos').where('inspectionId','==',id).get();S.inspPhById=S.inspPhById||{};q.docs.forEach(d=>{S.inspPhById[d.id]={id:d.id,...d.data()};});S.inspPhL=id;}catch(e){S.inspPhL='err:'+id;}if(S.inspR===id)render();}
function inspPhUrl(p,full){if(!p)return '';if(full&&!p.purged){if(p.assetId)return '/_blob/'+p.assetId;if(p.data)return p.data;}return p.thumb||'';}
function inspReport(id){return [el('div',{class:'iw-wrap wide'},...inspReport0(id))];}
function inspReport0(id){const x=(S.insp||{})[id];if(!x)return [el('div',{class:'card empty'},el('b',{text:'Звіт не знайдено'}),el('button',{class:'btn ghost',type:'button',onclick:()=>{S.inspR=null;render();}},'До списку'))];
  const a=staffById(x.authorId),rv=x.reviewerId&&staffById(x.reviewerId);const m=inspMe();const mine=x.shared?inspCanEditRep(x.buildingId):(m&&x.authorId===m.id);const aft=inspAfterSubmit(x);const rev=inspCanReview();const out=[];const loaded=S.inspPhL===id;const err=S.inspPhL==='err:'+id;
  out.push(el('div',{class:'card ip-rh'},el('div',{class:'row between',style:'gap:8px;flex-wrap:nowrap;align-items:flex-start'},el('div',{class:'stack',style:'gap:2px;min-width:0'},el('span',{class:'eyebrow',text:'Звіт обходу · '+dmy(parseYmd(x.date))}),el('h2',{text:inspBName(x.buildingId)})),inspPill(x.status)),
    el('dl',{class:'ip-meta'},el('dt',{text:x.shared?'Обхідники':'Обхідник'}),el('dd',{text:x.shared?(inspWho(x).map(s=>s.name).join(', ')||'—'):(a?a.name:'—')}),el('dt',{text:'Почато'}),el('dd',{text:x.createdAt?dm(ymd(new Date(x.createdAt)))+' '+hm(x.createdAt):'—'}),el('dt',{text:'Відправлено'}),el('dd',{text:x.submittedAt?dm(ymd(new Date(x.submittedAt)))+' '+hm(x.submittedAt):'—'}),
      x.reviewedAt?el('dt',{text:x.status==='approved'?'Погодив':'Перевірив'}):null,x.reviewedAt?el('dd',{text:(rv?rv.name:'—')+' · '+dm(ymd(new Date(x.reviewedAt)))+' '+hm(x.reviewedAt)}):null),
    x.status==='returned'&&x.reviewComment?el('div',{class:'rework',role:'note'},el('div',{class:'rw-h'},el('b',{text:'Повернуто на доопрацювання'})),el('p',{class:'rw-t',text:x.reviewComment})):null,
    aft.length?el('div',{class:'ip-upd',role:'note'},el('b',{text:'Оновлено після відправки'}),el('ul',{},aft.map(u=>{const s2=staffById(u.by);return el('li',{text:inspPt(u.k).n+' — '+u.what+' · '+(s2?s2.name:'—')+' · '+inspKyivHM(u.at)});}))):null,
    x.walkerReply?el('p',{class:'ip-reply'},el('b',{text:'Відповідь обхідника: '}),x.walkerReply):null,
    x.shared&&mine&&!inspLocked(x)?el('button',{class:'btn ghost sm',type:'button',style:'align-self:flex-start',onclick:()=>{S.hist.push(snap());S.inspR=null;S.inspW={id:x.id,bid:x.buildingId,date:x.date,step:0};inspLiveOn(x.id);render();}},'Доповнити звіт'):null,
    x.generalComment?el('p',{class:'t-note',text:x.generalComment}):null,
    x.purged?el('p',{class:'muted small',style:'margin:0',text:'Оригінали в архіві за '+perLabel(x.date.slice(0,7)).toLowerCase()+' (Word-звіт). Тут лишились мініатюри.'}):null));
  const pts=inspPts().filter(p=>x.shared?(inspPts(x.buildingId).some(q=>q.k===p.k)||(x.points||{})[p.k]||inspPhCount(x,p.k)):(x.points||{})[p.k]);const allPh=[];
  pts.forEach(p=>{const v=(x.points||{})[p.k]||{status:'ok'};const phs=inspPhotosOf(x,p.k,S.inspPhById);phs.forEach(q=>allPh.push({q,p}));
    out.push(el('div',{class:'card stack ip-pt'},el('div',{class:'row between',style:'gap:8px'},el('b',{class:'ip-pn',text:p.n}),v.status==='remark'?el('span',{class:'ip-tag rem',text:'Зауваження · '+INSP_PRIO[v.priority||'mid']}):el('span',{class:'ip-tag ok',text:'Норма'})),
      v.comment?el('p',{class:'t-note',text:v.comment}):null,
      v.meterValue!=null?el('span',{class:'small'},'Показник лічильника: ',el('b',{text:String(v.meterValue)+' м³'}),v.toWater?el('span',{class:'muted',text:v.waterSent?' · передано в облік води':' · не передано в облік води: '+(v.waterNote||'')}):null):null,
      v.checklist?el('ul',{class:'ip-cl'},Object.entries(v.checklist).map(([l,ok])=>el('li',{class:ok?'y':'n'},el('span',{text:ok?'✓':'✕'}),l))):null,
      inspPhCount(x,p.k)?el('div',{class:'ip-gal'},loaded||err?phs.map(q=>el('button',{type:'button',class:'ip-ph',onclick:()=>inspLight(allPh,allPh.findIndex(z=>z.q===q))},el('img',{src:inspPhUrl(q,false),alt:p.n+', '+hm(q.takenAt),loading:'lazy'}),q.fromGallery?el('span',{class:'iw-gal',text:'з галереї'}):null,el('small',{text:(x.shared&&staffById(q.authorId)?staffById(q.authorId).name.split(/\s+/)[0]+' · ':'')+inspKyivHM(q.addedAt||q.takenAt)+(x.submittedAt&&q.addedAt>x.submittedAt&&x.status!=='approved'?' · після відправки':'')}))):Array.from({length:inspPhCount(x,p.k)},()=>el('span',{class:'ip-ph ip-sk-ph','aria-hidden':'true'}))):el('span',{class:'muted small',text:'Без фото'}),
      v.by&&staffById(v.by)?el('small',{class:'muted',text:'Стан вказав: '+staffById(v.by).name+(v.at?' · '+inspKyivHM(v.at):'')}):null,
      err?el('p',{class:'muted small',text:'Фото не вдалося завантажити. Перевірте зв’язок і відкрийте звіт ще раз.'}):null,
      rev&&v.status==='remark'?el('button',{class:'btn ghost sm',type:'button',style:'align-self:flex-start',onclick:()=>inspTask(x,p,v,phs)},'+ Створити задачу'):null));});
  if(rev&&x.status!=='draft')out.push(el('div',{class:'btn-pair end ip-acts'},x.status!=='returned'?el('button',{class:'btn danger',type:'button',onclick:()=>inspReturnSheet(x)},'Повернути на доопрацювання'):null,x.status!=='approved'?el('button',{class:'btn',type:'button',onclick:()=>inspApprove(x)},'Погодити'):null));
  if(mine&&x.status==='returned'){const r=el('textarea',{id:'ipRep',placeholder:'Що виправили або пояснення',maxlength:'600'});r.value=x.walkerReply||'';
    out.push(el('div',{class:'card stack'},el('label',{for:'ipRep'},'Ваш коментар для перевіряючого',r),el('button',{class:'btn ip-one',type:'button',onclick:()=>{const t=r.value.trim();if(!t){toast('Напишіть коментар');r.focus();return;}
      write(()=>S.db.doc('inspections/'+x.id).update({walkerReply:t,status:'submitted',submittedAt:Date.now()}),'Обхід: звіт надіслано повторно · '+inspBShort(x.buildingId));}},'Надіслати повторно')));}
  if(inspCanDelete(x))out.push(el('div',{class:'ip-del'},el('button',{class:'btn danger sm',type:'button',onclick:()=>inspDelete(x)},svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),' Видалити обхід')));
  return out;}
function inspCanDelete(x){const m=inspMe();return !!(x&&((m&&x.authorId===m.id)||hasAny(['dev','ceo','director'])));}
function inspDelete(x){if(!inspCanDelete(x))return;confirmSheet('Видалити обхід «'+inspBName(x.buildingId)+' · '+dm(x.date)+'» разом з усіма фото? Відновити його не можна.','Видалити обхід',async()=>{
  const A=await inspAssetsNs();let fail=0;
  await write(async()=>{let q=null;try{q=await S.db.collection('inspection_photos').where('inspectionId','==',x.id).get();}catch(e){}
    for(const d of (q?q.docs:[])){const p=d.data()||{};if(p.inspectionId!==x.id)continue;if(p.assetId&&!p.purged&&A){try{await A.delete(p.assetId);}catch(e){fail++;}}await S.db.doc('inspection_photos/'+d.id).delete();}
    await S.db.doc('inspections/'+x.id).delete();},'Обхід видалено');
  devLog('Обхід: видалено · '+inspBShort(x.buildingId)+' · '+dm(x.date)+(fail?' · файлів фото не видалено: '+fail:''));
  if(S.inspR===x.id){S.inspR=null;if(S.hist.length&&S.hist[S.hist.length-1].ir===x.id)S.hist.pop();}render();});}
function inspDraftDelete(d){confirmSheet('Видалити чернетку обходу «'+inspBName(d.buildingId)+'» разом із зробленими фото?','Видалити чернетку',async()=>{await IDBX.del(d.id);delete S.inspDr[d.id];S.inspW=null;devLog('Обхід: видалено чернетку · '+inspBShort(d.buildingId));toast('Чернетку видалено');render();});}
function inspApprove(x){const m=inspMe();write(()=>S.db.doc('inspections/'+x.id).update({status:'approved',reviewerId:m?m.id:null,reviewedAt:Date.now()}),'Обхід: погоджено · '+inspBShort(x.buildingId)+' · '+dm(x.date));}
function inspReturnSheet(x){const t=el('textarea',{id:'ipRet',placeholder:'Що переробити: напр. «Фото ВРП розмите, перезніміть»',maxlength:'600'});const er=el('p',{class:'iw-err',role:'alert',hidden:true,text:'Без коментаря обхідник не знатиме, що виправити.'});
  t.addEventListener('input',()=>{if(t.value.trim())er.hidden=true;});openSheet(el('h2',{text:'Повернути звіт на доопрацювання?'}),el('p',{class:'muted',style:'margin:0',text:inspBName(x.buildingId)+' · '+dm(x.date)}),el('label',{for:'ipRet'},'Коментар для обхідника (обов’язково)',t),er,
    el('div',{class:'btn-pair'},el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'),el('button',{class:'btn danger',type:'button',onclick:()=>{const c=t.value.trim();if(!c){er.hidden=false;t.focus();return;}const m=inspMe();closeSheet();
      write(()=>S.db.doc('inspections/'+x.id).update({status:'returned',reviewComment:c,reviewerId:m?m.id:null,reviewedAt:Date.now()}),'Обхід: повернуто · '+inspBShort(x.buildingId)+' · '+dm(x.date));}},'Повернути звіт')));
  if(!IS_TOUCH)t.focus();}
function inspTask(x,p,v,phs){newTask({title:'Обхід: '+p.n+' — '+inspBShort(x.buildingId),note:(v.comment||'')+'\nПріоритет: '+INSP_PRIO[v.priority||'mid']+'\nЗвіт обходу від '+dm(x.date)+' ('+inspBName(x.buildingId)+')',insp:x.id,refThumbs:phs.slice(0,4).map(q=>q.thumb).filter(Boolean)});}
/* лайтбокс: свайп, стрілки, Esc */
function inspLight(list,i){if(!list.length)return;let k=Math.max(0,i);const img=el('img',{class:'phx-img',alt:''});const cap=el('div',{class:'phx-cap'});
  const show=()=>{const {q,p}=list[k];img.src=inspPhUrl(q,true);img.alt=p.n;cap.replaceChildren(el('b',{text:p.n}),el('span',{text:dmy(new Date(q.takenAt))+' '+hm(q.takenAt)+(q.fromGallery?' · з галереї':'')+(q.purged?' · оригінал в архіві':'')}),el('span',{class:'muted',text:(k+1)+' / '+list.length}));};
  const go=d=>{k=(k+d+list.length)%list.length;show();};
  const bg=el('div',{class:'phx',role:'dialog','aria-modal':'true','aria-label':'Перегляд фото',onclick:e=>{if(e.target===bg)cl();}},img,cap,
    el('button',{class:'phx-b phx-x',type:'button','aria-label':'Закрити',onclick:()=>cl()},'×'),list.length>1?el('button',{class:'phx-b phx-p',type:'button','aria-label':'Попереднє фото',onclick:()=>go(-1)},'‹'):null,list.length>1?el('button',{class:'phx-b phx-n',type:'button','aria-label':'Наступне фото',onclick:()=>go(1)},'›'):null);
  const key=e=>{if(e.key==='Escape')cl();else if(e.key==='ArrowLeft')go(-1);else if(e.key==='ArrowRight')go(1);else if(e.key==='Tab'){const f=[...bg.querySelectorAll('button')];const k=f.indexOf(document.activeElement);e.preventDefault();(f[(k+(e.shiftKey?-1:1)+f.length)%f.length]||f[0]).focus();}};let x0=null;
  bg.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});bg.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50)go(dx<0?1:-1);});
  const prevFocus=document.activeElement;const cl=()=>{document.removeEventListener('keydown',key);bg.remove();try{prevFocus&&prevFocus.focus();}catch(e){}};document.addEventListener('keydown',key);document.body.append(bg);show();bg.querySelector('.phx-x').focus();}
/* ---------- Word-звіт (.docx) ---------- */
let _docxP=null;function loadDocx(){if(window.docx)return Promise.resolve(window.docx);if(!_docxP){const ld=src=>new Promise((res,rej)=>{const sc=document.createElement('script');sc.src=src;sc.onload=()=>window.docx?res(window.docx):rej(new Error('docx'));sc.onerror=()=>{sc.remove();rej(new Error(src));};document.head.append(sc);});
  _docxP=ld('https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js').catch(()=>ld('https://unpkg.com/docx@8.5.0/build/index.umd.js')).catch(e=>{_docxP=null;throw e;});}return _docxP;}
function inspIsoWeek(d){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y0=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()+'-W'+pad(Math.ceil(((t-y0)/864e5+1)/7));}
function inspExportSheet(){const now=new Date();const mon=new Date(now);mon.setDate(now.getDate()-((now.getDay()+6)%7));let per='week';
  const f=el('input',{id:'ieF',type:'date'}),t=el('input',{id:'ieT',type:'date'});const setPer=k=>{per=k;if(k==='week'){f.value=ymd(mon);const e=new Date(mon);e.setDate(mon.getDate()+6);t.value=ymd(e);}else if(k==='month'){f.value=ymd(new Date(now.getFullYear(),now.getMonth(),1));t.value=ymd(new Date(now.getFullYear(),now.getMonth()+1,0));}
    seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));dates.hidden=k!=='custom';};
  const seg=el('div',{class:'seg'},[['week','Тиждень'],['month','Місяць'],['custom','Довільний']].map(([k,l])=>{const b=el('button',{type:'button',onclick:()=>setPer(k)},l);b.dataset.k=k;return b;}));
  const dates=el('div',{class:'grid2',hidden:true},el('label',{for:'ieF'},'З',f),el('label',{for:'ieT'},'По',t));
  const bs=new Set(ARCH.map(b=>b.id));const ws=new Set();const walkers=[...new Set(inspList().flatMap(x=>[x.authorId,...Object.keys(x.participants||{})]))].map(staffById).filter(Boolean);
  const chip=(set,id,label)=>{const b=el('button',{type:'button',class:'pk','aria-pressed':String(set.has(id)),onclick:()=>{set.has(id)?set.delete(id):set.add(id);b.setAttribute('aria-pressed',String(set.has(id)));}},el('span',{text:label}));return b;};
  const go=el('button',{class:'btn',type:'button',onclick:async()=>{if(!f.value||!t.value||f.value>t.value){toast('Перевірте дати періоду');return;}if(!bs.size){toast('Оберіть хоча б одну будівлю');return;}
    go.disabled=true;go.textContent='Формую…';await inspWord({per,from:f.value,to:t.value,blds:[...bs],walkers:[...ws]});closeSheet();}},'Сформувати Word');
  openSheet(el('h2',{text:'Звіт обходу будівель (Word)'}),el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Період'}),seg,dates),
    el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Будівлі'}),el('div',{class:'pick'},ARCH.map(b=>chip(bs,b.id,'Буд. '+b.fac)))),
    walkers.length?el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Обхідники (не вибрано — усі)'}),el('div',{class:'pick'},walkers.map(s=>chip(ws,s.id,s.name)))):null,
    el('div',{class:'btn-pair'},el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'),go),inspExportsList());setPer('week');}
function inspExportsList(){const L=(S.inspEx||[]).slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,6);if(!L.length)return null;
  return el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Сформовані звіти'}),L.map(e=>{const by=staffById(e.createdBy);const can=e.period==='month'&&!e.purgedAt;const at=(e.createdAt||0)+14*864e5;const ready=Date.now()>=at;
    return el('div',{class:'ip-ex'},el('div',{class:'stack',style:'gap:2px;min-width:0;flex:1'},el('b',{text:e.fileName}),el('small',{class:'muted',text:dm(ymd(new Date(e.createdAt)))+' · '+(by?by.name:'—')+' · '+e.reportsCount+' звітів, '+e.photosCount+' фото'+(e.purgedAt?' · оригінали очищено':'')})),
      can?el('button',{class:'btn sm danger',type:'button',disabled:ready?null:true,title:ready?'':'Можна очистити з '+dm(ymd(new Date(at))),onclick:()=>inspPurge(e)},ready?'Звіт збережено, очистити фото':'Очищення з '+dm(ymd(new Date(at)))):null);}));}
async function inspFetchImg(p,max){try{let src=null;if(!p.purged&&p.assetId){const r=await fetch('/_blob/'+p.assetId);if(r.ok)src=await r.blob();}else if(!p.purged&&p.data)src=await (await fetch(p.data)).blob();
    if(!src&&p.thumb)src=await (await fetch(p.thumb)).blob();if(!src)return null;const im=await inspDecode(src);const c=inspCanvas(im,max);const b=await inspFit(c,260*1024);return {data:new Uint8Array(await b.arrayBuffer()),w:c.width,h:c.height};}catch(e){return null;}}
async function inspWord(o){toast('Готую Word-звіт…');let D;try{D=await loadDocx();}catch(e){toast('Не вдалося завантажити модуль Word. Перевірте зв’язок і спробуйте ще раз.');return;}
  const L=inspList().filter(x=>x.status!=='draft'&&x.date>=o.from&&x.date<=o.to&&o.blds.includes(x.buildingId)&&(!o.walkers.length||o.walkers.includes(x.authorId)||o.walkers.some(w=>(x.participants||{})[w]))).sort((a,b)=>a.date.localeCompare(b.date)||a.buildingId.localeCompare(b.buildingId));
  const photos={};for(const x of L){try{const q=await S.db.collection('inspection_photos').where('inspectionId','==',x.id).get();q.docs.forEach(d=>{photos[d.id]={id:d.id,...d.data()};});}catch(e){}}
  const totalKb=Object.values(photos).reduce((a,p)=>a+Math.min(p.sizeKb||200,260),0);
  const lab=o.per==='month'?o.from.slice(0,7)+'_місяць':o.per==='week'?inspIsoWeek(parseYmd(o.from))+'_тиждень':o.from+'_'+o.to;
  const parts=totalKb>36*1024?o.blds.map(b=>({blds:[b],sfx:'_Буд-'+(inspB(b)||{}).fac})):[{blds:o.blds,sfx:''}];
  const me=inspMe();let n=0;
  for(const part of parts){const LL=L.filter(x=>part.blds.includes(x.buildingId));if(parts.length>1&&!LL.length)continue;
    const blob=await inspDocx(D,o,LL,photos,part.blds,me);const name='Обхід_DucksLake_'+lab+part.sfx+'.docx';await saveFile(name,blob);n++;}
  const pc=L.reduce((a,x)=>a+inspPhN(x),0);
  try{const ref=await S.db.collection('inspection_exports').add({period:o.per,from:o.from,to:o.to,createdBy:me?me.id:'',createdAt:Date.now(),buildings:o.blds,reportsCount:L.length,photosCount:pc,fileName:'Обхід_DucksLake_'+lab+'.docx',parts:n});
    for(const x of L)if(!x.exportId||o.per==='month')await S.db.doc('inspections/'+x.id).update({exportId:ref.id});}catch(e){}
  devLog('Обхід: сформовано Word · '+lab+' · '+L.length+' звітів');}
async function inspDocx(D,o,L,photos,blds,me){const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ImageRun,AlignmentType,Header,Footer,PageNumber,ShadingType,BorderStyle,VerticalAlign}=D;
  const C={acc:'1F6F78',ink:'0F2A33',mut:'53686F',soft:'DCEEEC',bg:'F4F8F7',ok:'2E7D4F',okS:'DDF0E4',warn:'B4232A',warnS:'F8DEDF',amb:'B9781F',ambS:'F6E3C4',line:'D3DFDD'};const F='Calibri';
  const T=(t,x)=>new TextRun(Object.assign({text:String(t==null?'':t),font:F,size:21,color:C.ink},x||{}));
  const P=(runs,x)=>new Paragraph(Object.assign({children:Array.isArray(runs)?runs:[runs],spacing:{after:80}},x||{}));
  const H=(t,x)=>P([T(t,{bold:true,size:30,color:C.acc})],Object.assign({spacing:{before:200,after:120}},x||{}));
  const bd={top:{style:BorderStyle.SINGLE,size:4,color:C.line},bottom:{style:BorderStyle.SINGLE,size:4,color:C.line},left:{style:BorderStyle.SINGLE,size:4,color:C.line},right:{style:BorderStyle.SINGLE,size:4,color:C.line}};
  const cell=(c,x)=>new TableCell(Object.assign({children:Array.isArray(c)?c:[c instanceof Paragraph?c:P(T(c))],borders:bd,margins:{top:60,bottom:60,left:90,right:90},verticalAlign:VerticalAlign.CENTER},x||{}));
  const hcell=t=>cell(P(T(t,{bold:true,color:'FFFFFF',size:19})),{shading:{type:ShadingType.CLEAR,color:'auto',fill:C.acc}});
  const tbl=(rows,w)=>new Table({rows,width:{size:100,type:WidthType.PERCENTAGE},columnWidths:w});
  const per=(o.per==='month'?perLabel(o.from.slice(0,7)):dmy(parseYmd(o.from))+' – '+dmy(parseYmd(o.to)));const kids=[];
  /* 1. титул */
  kids.push(P(T('DUCK’S LAKE · FACILITY ВІДДІЛ',{bold:true,color:C.acc,size:20}),{spacing:{before:2400,after:200}}),P(T('Звіт обходу будівель',{bold:true,size:56,color:C.ink})),P(T(per,{size:32,color:C.acc}),{spacing:{after:600}}),
    P([T('Дата формування: ',{color:C.mut}),T(dmy(new Date()))]),P([T('Сформував: ',{color:C.mut}),T(me?me.name+(ROLE_NAME[me.role]?' ('+ROLE_NAME[me.role]+')':''):'—')]),
    P([T('Будівлі: ',{color:C.mut}),T(blds.map(b=>inspBShort(b)).join(', '))]),P([T('Звітів у документі: ',{color:C.mut}),T(String(L.length))]));
  /* 2. зведення */
  const days=[];for(let d=parseYmd(o.from);ymd(d)<=o.to;d.setDate(d.getDate()+1))days.push(new Date(d));const today=ymd(new Date());
  kids.push(H('Зведення',{pageBreakBefore:true}));
  kids.push(tbl([new TableRow({tableHeader:true,children:['Будівля','Обходів','Пропущено днів','Зауважень','Погоджено'].map(hcell)}),...blds.map(b=>{const xs=L.filter(x=>x.buildingId===b);const miss=days.filter(d=>ymd(d)<today&&inspExpected(b,ymd(d))&&!xs.some(x=>x.date===ymd(d))).length;
    return new TableRow({children:[cell(inspBName(b)),cell(String(xs.length)),cell(P(T(String(miss),{color:miss?C.warn:C.ink,bold:!!miss}))),cell(String(xs.reduce((a,x)=>a+(x.remarks||0),0))),cell(String(xs.filter(x=>x.status==='approved').length))]});})],[3600,1300,1600,1300,1300]));
  const open=[];L.forEach(x=>Object.entries(x.points||{}).forEach(([k,v])=>{if(v&&v.status==='remark')open.push({x,k,v});}));const po={high:0,mid:1,low:2};open.sort((a,b)=>(po[a.v.priority]??1)-(po[b.v.priority]??1));
  kids.push(P(T('Відкриті зауваження',{bold:true,size:24,color:C.acc}),{spacing:{before:240,after:80}}));
  if(!open.length)kids.push(P(T('Зауважень за період немає.',{color:C.mut})));
  open.forEach(({x,k,v})=>kids.push(P([T((v.priority==='high'?'● терміновий':v.priority==='low'?'● низький':'● середній')+'  ',{bold:true,color:v.priority==='high'?C.warn:v.priority==='low'?C.mut:C.amb}),T(dm(x.date)+' · '+inspBShort(x.buildingId)+' · '+inspPt(k).n+': ',{bold:true}),T(v.comment||'')],{indent:{left:200}})));
  /* 3. матриця покриття */
  kids.push(H('Матриця покриття',{pageBreakBefore:true}));const fills={ok:[C.okS,C.ok,'✓'],sub:[C.ambS,C.amb,'●'],ret:[C.warnS,C.warn,'↺'],miss:[C.warnS,C.warn,'✕'],wait:[C.bg,C.mut,'·'],na:['FFFFFF',C.mut,'—'],fut:['FFFFFF',C.mut,'']};
  const cw=Math.max(240,Math.floor(7600/Math.max(1,days.length)));const sm=days.length>10?14:18;
  kids.push(tbl([new TableRow({tableHeader:true,children:[hcell('Будівля'),...days.map(d=>cell(P(T(String(d.getDate()),{bold:true,color:'FFFFFF',size:sm}),{alignment:AlignmentType.CENTER}),{shading:{type:ShadingType.CLEAR,color:'auto',fill:C.acc},margins:{top:40,bottom:40,left:20,right:20}}))]}),
    ...blds.map(b=>new TableRow({children:[cell(P(T(inspBShort(b),{bold:true,size:sm+2}))),...days.map(d=>{const ds=ymd(d);const x=L.find(z=>z.buildingId===b&&z.date===ds);const k=x?(x.status==='approved'?'ok':x.status==='returned'?'ret':'sub'):ds>today?'fut':!inspExpected(b,ds)?'na':ds<today?'miss':'wait';const f=fills[k];
      return cell(P(T(f[2],{bold:true,color:f[1],size:sm}),{alignment:AlignmentType.CENTER,spacing:{after:0}}),{shading:{type:ShadingType.CLEAR,color:'auto',fill:f[0]},margins:{top:40,bottom:40,left:20,right:20}});})]}))],[1800,...days.map(()=>cw)]));
  kids.push(P([T('✓ погоджено   ',{color:C.ok,bold:true}),T('● на перевірці   ',{color:C.amb,bold:true}),T('↺ повернуто   ',{color:C.warn,bold:true}),T('✕ пропущено',{color:C.warn,bold:true})],{spacing:{before:120}}));
  /* 4. по днях → по будівлях */
  for(const x of L){const a=staffById(x.authorId),rv=x.reviewerId&&staffById(x.reviewerId);const st=(INSP_ST[x.status]||INSP_ST.none)[0];
    kids.push(H(inspBName(x.buildingId)+' · '+dmy(parseYmd(x.date))+' · '+(x.shared?inspWho(x).map(s=>s.name).join(', '):(a?a.name:'—')),{pageBreakBefore:true}));
    kids.push(P([T('Статус перевірки: ',{color:C.mut}),T(st,{bold:true,color:x.status==='approved'?C.ok:x.status==='returned'?C.warn:C.amb}),T(rv?'   ·   Перевірив: '+rv.name:'',{color:C.mut}),T(x.submittedAt?'   ·   Відправлено: '+hm(x.submittedAt):'',{color:C.mut})]));
    if(x.reviewComment)kids.push(P([T('Коментар перевіряючого: ',{bold:true,color:C.warn}),T(x.reviewComment)]));
    if(x.generalComment)kids.push(P([T('Загальний коментар: ',{bold:true}),T(x.generalComment)]));
    for(const pt of inspPts()){const v=(x.points||{})[pt.k]||(x.shared&&inspPhCount(x,pt.k)?{status:'ok'}:null);if(!v)continue;
      kids.push(P([T(pt.n+'  ',{bold:true,size:24}),T(v.status==='remark'?' Зауваження · '+INSP_PRIO[v.priority||'mid']+' ':' Норма ',{bold:true,color:'FFFFFF',shading:{type:ShadingType.CLEAR,color:'auto',fill:v.status==='remark'?C.warn:C.ok}})],{spacing:{before:200,after:60}}));
      if(v.comment)kids.push(P(T(v.comment)));
      if(v.meterValue!=null)kids.push(P([T('Показник лічильника: ',{color:C.mut}),T(v.meterValue+' м³',{bold:true})]));
      if(v.checklist)kids.push(P(T(Object.entries(v.checklist).map(([l,ok])=>(ok?'✓ ':'✕ ')+l).join('   '),{size:19,color:C.mut})));
      const phs=inspPhotosOf(x,pt.k,photos).filter(q=>!q._stub);
      for(let i=0;i<phs.length;i+=4){const four=phs.slice(i,i+4);const imgs=await Promise.all(four.map(p=>inspFetchImg(p,1200)));
        const mk=j=>{const p=four[j],im=imgs[j];if(!p)return cell(P(T('')),{borders:{top:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},bottom:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},left:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},right:{style:BorderStyle.NONE,size:0,color:'FFFFFF'}}});
          let W=290,Hh=im?Math.round(W*im.h/im.w):0;if(Hh>380){W=Math.round(W*380/Hh);Hh=380;}const ch=[];if(im)ch.push(new Paragraph({children:[new ImageRun({data:im.data,transformation:{width:W,height:Hh}})],alignment:AlignmentType.CENTER}));else ch.push(P(T('фото недоступне',{color:C.mut,italics:true})));
          ch.push(P([T(pt.n+' · '+inspKyivHM(p.addedAt||p.takenAt)+(staffById(p.authorId)?' · '+staffById(p.authorId).name:''),{size:17,color:C.mut}),p.fromGallery?T(' · з галереї',{size:17,color:C.warn,bold:true}):T('')],{alignment:AlignmentType.CENTER}));return cell(ch);};
        const rows=[new TableRow({children:[mk(0),mk(1)]})];if(four.length>2)rows.push(new TableRow({children:[mk(2),mk(3)]}));kids.push(tbl(rows,[4800,4800]));}}}
  /* 5. підписи */
  const ceo=S.staff.find(s=>s.role==='ceo'||s.extraRole==='ceo');
  kids.push(H('Підписи',{pageBreakBefore:L.length>0}));
  kids.push(P([T('Перевірив: CEO Asgard '+(ceo?ceo.name:'Б. Александрович')+'   ______________________',{size:22})],{spacing:{before:400,after:400}}),P([T('Керівник Facility '+dirName()+'   ______________________',{size:22})],{spacing:{after:400}}),P([T('Дата: ____________',{color:C.mut})]));
  const doc=new Document({creator:'Duck’s Lake',title:'Звіт обходу будівель '+per,styles:{default:{document:{run:{font:F}}}},
    sections:[{properties:{page:{margin:{top:1000,bottom:1000,left:1000,right:1000}}},
      headers:{default:new Header({children:[P([T('Duck’s Lake · Facility відділ   ',{bold:true,color:C.acc,size:17}),T('Звіт обходу будівель · '+per,{color:C.mut,size:17})],{alignment:AlignmentType.RIGHT})]})},
      footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[T('стор. ',{size:17,color:C.mut}),new TextRun({children:[PageNumber.CURRENT],size:17,color:C.mut,font:F}),T(' з ',{size:17,color:C.mut}),new TextRun({children:[PageNumber.TOTAL_PAGES],size:17,color:C.mut,font:F})]})]})},
      children:kids}]});
  return await Packer.toBlob(doc);}
/* ---------- очищення оригіналів після місячного звіту ---------- */
function inspPurge(e){confirmSheet('Очистити оригінали фото за '+perLabel(e.from.slice(0,7)).toLowerCase()+'? Мініатюри й усі тексти лишаться.','Звіт збережено, очистити фото',async()=>{toast('Очищаю…');const A=await inspAssetsNs();let n=0,fail=0;
  const L=inspList().filter(x=>x.date>=e.from&&x.date<=e.to&&!x.purged);
  for(const x of L){let q;try{q=await S.db.collection('inspection_photos').where('inspectionId','==',x.id).get();}catch(_){fail++;continue;}
    for(const d of q.docs){const p=d.data();if(p.purged)continue;try{if(p.assetId){if(!A)throw {code:'not_granted'};await A.delete(p.assetId);}await S.db.doc('inspection_photos/'+d.id).update({purged:true,data:null});n++;}catch(err){fail++;}}
    try{await S.db.doc('inspections/'+x.id).update({purged:true});}catch(_){}}
  try{const R=clRevs().filter(r=>r.status!=='draft'&&!r.purged&&r.date>=e.from&&r.date<=e.to);if(R.length){const z=await clPurge(R);n+=z.n;fail+=z.fail;}}catch(_){}
  try{await S.db.doc('inspection_exports/'+e.id).update({purgedAt:Date.now(),purgedBy:(inspMe()||{}).id||''});}catch(_){}
  devLog('Обхід: очищено оригінали фото · '+e.from.slice(0,7)+' · '+n+' фото'+(fail?' · не вдалося '+fail:''));
  toast(fail?'Очищено '+n+' фото. '+fail+' не вдалося — їх може видалити власник артефакту.':'Очищено '+n+' фото');render();});}
/* ---------- Dev: сховище й чекліст ---------- */
function inspDevCards(){const u=S.assetUse;const card=el('div',{class:'card stack',style:'gap:8px;margin-bottom:12px'},el('b',{text:'Сховище фото (обхід, чат)'}));
  if(u===undefined){S.assetUse=null;inspAssetsNs().then(A=>A?A.list():null).then(r=>{S.assetUse=r?r.usage:false;if(S.fg==='dev')render();}).catch(()=>{S.assetUse=false;});}
  if(u){const p=u.maxBytes?u.bytes/u.maxBytes:0;card.append(el('div',{class:'w-prog'},el('i',{style:'width:'+Math.min(100,Math.round(p*100))+'%;'+(p>=.8?'background:var(--warn)':'')})),
    el('span',{class:p>=.8?'small iw-rem':'muted small',text:'Використано сховища: '+(u.bytes/1048576).toFixed(1)+' МБ з '+Math.round(u.maxBytes/1048576)+' МБ · файлів '+u.files+(u.maxFiles?' з '+u.maxFiles:'')+(p>=.8?' — понад 80%: сформуйте місячний Word-звіт і очистіть оригінали.':'')}));}
  else card.append(el('span',{class:'muted small',text:u===false?'Дані про сховище недоступні для цього перегляду.':'Завантажую…'}));
  const fl=inspFireList().map(x=>x[1]).join('\n');const ta=el('textarea',{id:'inspFl',rows:'4'});ta.value=fl;
  const ck=el('div',{class:'card stack',style:'gap:8px;margin-bottom:12px'},el('label',{for:'inspFl'},'Чекліст пожежного поста (по пункту в рядку)',ta),el('div',{class:'row'},el('button',{class:'btn sm',type:'button',onclick:()=>{const a=ta.value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,10);
    write(()=>S.db.doc('settings/main').set({...(S.cfg||{}),inspFire:a.length?a:null,updatedAt:Date.now(),updatedBy:S.myId||''}),'Обхід: оновлено чекліст пожежного поста');}},'Зберегти чекліст')));
  return [card,clDevCard(),ck];}
/* INSP:END */

function inspTileStat(){const t=ymd(new Date());const bl=ARCH.filter(b=>inspAssigned(b.id).length);const tot=bl.length||ARCH.length;const td=inspList().filter(x=>x.date===t&&x.status!=='draft');
  const done=new Set(td.map(x=>x.buildingId)).size;const pend=inspPending();const rem=td.reduce((a,x)=>a+(x.remarks||0),0);
  return [done+' / '+tot+' будівель сьогодні',pend+' '+plural(pend,'очікує','очікують','очікують')+' · '+rem+' '+plural(rem,'зауваження','зауваження','зауважень')];}
function inspTodayCard(){const bl=inspMyBlds();if(!bl.length)return null;const me=inspMe();const st=bl.map(b=>({b,s:inspTodayOf(b.id)}));
  const done=st.filter(x=>['submitted','approved'].includes(x.s.st)).length;const ret=st.filter(x=>x.s.st==='returned').length;const left=st.filter(x=>x.s.st==='none'||x.s.st==='draft');
  const all=done===bl.length&&!ret;const open=()=>{S.tab='uk';S.ukSec=null;S.fg='insp';S.inspTab='mine';S.inspW=null;S.inspR=null;render();};
  return el('div',{class:'card ip-today'+(all?' ok':'')},el('div',{class:'ip-th'},el('span',{class:'ip-ti'},svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v3h6V3M9 12l2 2 4-4"/>')),
      el('div',{style:'flex:1;min-width:0'},el('b',{text:'Обхід будівель сьогодні'}),el('span',{class:'muted small',text:(me&&me!==myStaff()?me.name+' · ':'')+'виконано '+done+' з '+bl.length+(ret?' · повернуто '+ret:'')})),
      el('span',{class:'ip-tn'+(all?' ok':''),text:done+'/'+bl.length})),
    all?el('p',{class:'muted small',style:'margin:0',text:'Усі будівлі пройдено. Дякуємо!'}):el('p',{class:'small',style:'margin:0',text:'Залишилось: '+left.map(x=>'Буд. '+x.b.fac).join(', ')+(ret?'. Є повернуті звіти — їх треба виправити.':'')}),
    el('button',{class:all?'btn ghost':'btn',type:'button',onclick:()=>{if(!all&&left.length&&!ret){open();inspStart(left[0].b.id);}else open();}},all?'Відкрити обходи':(ret?'Виправити звіт':'Почати обхід')));}
function inspBadge(){let n=inspCanReview()?inspPending():0;const m=inspMe();if(m)n+=inspList().filter(x=>x.authorId===m.id&&x.status==='returned').length;return n;}
function inspGoto(id){S.hist.push(snap());S.tab='uk';S.ukSec=null;S.fg='insp';S.inspW=null;S.inspR=id;SC().scrollTop=0;render();inspLoadPhotos(id);}
function pwaCard(){let os=/iPhone|iPad|iPod/.test(navigator.userAgent)?'ios':'and';const body=el('ol',{class:'pwa-l'});
  const steps={ios:['Відкрийте посилання на Duck’s Lake у Safari (саме Safari, не в Telegram чи Instagram).','Натисніть «Поділитися» — квадрат зі стрілкою вгору внизу екрана.','Прокрутіть список і оберіть «На екран “Додому”».','Назва — «Duck’s Lake», натисніть «Додати». На головному екрані з’явиться іконка.','Відкрийте застосунок з іконки, увійдіть своїм акаунтом Claude і оберіть своє ім’я в колективі. Камера відкриється сама, коли натиснете «Зробити фото».'],
    and:['Відкрийте посилання на Duck’s Lake у Chrome.','Натисніть меню ⋮ у правому верхньому куті.','Оберіть «Додати на головний екран» (або «Установити застосунок»).','Підтвердьте «Додати» — на головному екрані з’явиться іконка Duck’s Lake.','Відкрийте застосунок з іконки, увійдіть своїм акаунтом Claude і оберіть своє ім’я в колективі. Дозвольте доступ до камери, коли телефон запитає.']};
  const seg=el('div',{class:'seg',role:'tablist'});const draw=()=>{seg.replaceChildren(...[['ios','iPhone (iOS)'],['and','Android']].map(([k,l])=>el('button',{type:'button',role:'tab','aria-selected':String(os===k),'aria-pressed':String(os===k),onclick:()=>{os=k;draw();}},l)));body.replaceChildren(...steps[os].map(t=>el('li',{text:t})));};draw();
  return el('div',{class:'card stack pwa'},el('h2',{text:'Встановити Duck’s Lake на телефон'}),el('p',{class:'muted',style:'margin:0',text:'Застосунок відкривається з іконки, як звичайна програма. Потрібно для обходу будівель і фото.'}),seg,body);}
function openFg(id){S.hist.push(snap());S.fg=id;S.arB=null;S.arHi=null;SC().scrollTop=0;render();animIn(1);}
function openUk(id){S.hist.push(snap());S.ukSec=id;S.fg='obl';SC().scrollTop=0;render();animIn(1);}
function viewUK(){if(!isUK()&&inspIsWalker()){S.fg='insp';S.ukSec=null;return inspView();}if(!isUK())return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Цей розділ доступний лише для управлінської компанії.'}))];
  if(S.ukSec==='water')return S.wObjSel?waterObject(S.wObjSel):waterHome();
  if(S.ukSec==='debt')return debtView();
  if(S.ukSec==='waste')return wasteView();
  if(S.ukSec==='park')return pkView();
  if(S.ukSec==='res')return resView();
  if(S.ukSec&&UKS[S.ukSec])return ukSection(S.ukSec);
  if(!S.fg)return fgHome();
  if(S.fg==='insp')return inspView();
  if(S.fg==='dev')return devView();
  if(S.fg==='arch')return S.arB?arBuilding():arHome();
  if(S.fg==='docs')return dkView();
  if(S.fg==='clean')return clView();
  if(S.fg!=='obl')return fgSection(S.fg);
  const out=[el('section',{class:'uk-hero'},el('span',{class:'eyebrow',text:'Facility відділ'}),el('h2',{text:'Облік'}),el('p',{text:'Вода, сміття, дебіторка, паркінг, інвентар та електроенергія Duck’s Lake. Оберіть блок, щоб відкрити.'}))];
  out.push(el('div',{class:'uk-grid'},Object.entries(UKS).map(([id,u])=>{const st=ukStat(id);return el('button',{type:'button',class:'uk-tile'+(st?'':' soon-t'),style:'--c1:'+u.c1+';--c2:'+u.c2,onclick:()=>openUk(id)},
    el('div',{class:'uk-tt'},el('span',{class:'uk-ic'},svg(u.ic)),st?null:el('span',{class:'soon',text:'скоро'}),el('span',{class:'uk-go'},svg('<path d="m9 6 6 6-6 6"/>'))),
    el('span',{class:'uk-t'},el('b',{text:u.name}),el('small',{text:u.sub})),
    el('span',{class:'uk-st'},st?[el('b',{text:st[0]}),el('small',{text:st[1]})]:el('small',{text:'Блок у розробці'})));})));
  return out;}
function ukSection(id){const u=UKS[id];
  return [el('section',{class:'uk-head',style:'--c1:'+u.c1+';--c2:'+u.c2},el('span',{class:'uk-ic big'},svg(u.ic)),el('div',{},el('span',{class:'eyebrow',text:'Облік'}),el('h2',{text:u.name}),el('p',{text:u.sub}))),
    el('div',{class:'card uk-soon'},el('span',{class:'soon',text:'у розробці'}),el('p',{style:'margin:0',text:'Структуру цього блоку наповнюємо поступово. Ось що тут планується:'})),
    el('div',{class:'uk-plan'},u.plan.map(([e,t,d])=>el('div',{class:'card uk-pi'},el('span',{class:'uk-pe',text:e}),el('div',{},el('b',{text:t}),el('small',{text:d})),el('span',{class:'soon',text:'скоро'}))))];}
