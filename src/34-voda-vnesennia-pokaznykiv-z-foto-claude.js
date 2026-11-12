// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Вода: внесення показників з фото (Claude читає лічильники)

/* ---------- Вода: внесення показників з фото (Claude читає лічильники) ---------- */
function wImgBlob(img,max,q){return new Promise(res=>{const k=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(b=>res(b),'image/jpeg',q);});}
function wPrevVal(per,mid){const r=wRead(per,mid);if(r&&r.s!=null&&r.s!=='')return +r.s;const ks=Object.keys(S.wPerD).filter(k=>k<per).sort().reverse();for(const k of ks){const x=(S.wPerD[k].reads||{})[mid];if(x&&x.e!=null&&x.e!=='')return +x.e;}return null;}
function wMeterLabel(m){const o=S.wObj.find(x=>x.id===m.obj);return [o?o.name:'',m.tenant||(m.kind==='main'?'Загальнобудинковий':''),m.serial?'№ '+m.serial:''].filter(Boolean).join(' · ');}
function wNormSer(s){return String(s||'').toUpperCase().replace(/[^0-9A-Z]/g,'');}
function wMatchSerial(ser){const n=wNormSer(ser);if(n.length<4)return null;const ms=S.wMet.filter(m=>m.serial);let best=null,bs=0;
  for(const m of ms){const t=wNormSer(m.serial);let sc=0;if(t===n)sc=100;else if(t.endsWith(n)||n.endsWith(t))sc=80;else if(t.includes(n)||n.includes(t))sc=70;else{const a=t.slice(-6),b=n.slice(-6);if(a.length>=5&&a===b)sc=60;}
    if(sc>bs){bs=sc;best=m;}}return bs>=60?best:null;}
async function wPhotoImport(per){if(!S.wPerD[per]){toast('Спершу створіть період «'+perLabel(per)+'»');return;}
  const sample=await claude.use('sample').catch(()=>null);const caps=sample?await sample.limits().catch(()=>null):null;
  if(!sample||!caps||!caps.images){toast('Розпізнавання фото тут недоступне');return;}
  const inp=el('input',{type:'file',accept:(caps.images.mediaTypes||['image/jpeg','image/png']).join(',')+',image/*',multiple:true});
  inp.addEventListener('change',()=>{const fs=[...inp.files];if(fs.length)wPhotoRun(per,fs,sample,caps);});inp.click();}
async function wPhotoRun(per,files,sample,caps){const items=files.map((f,i)=>({i,f,thumb:null,full:null,blob:null,mid:null,val:null,ser:null,conf:null,note:'',on:false,err:null}));
  const prog=el('div',{class:'wp-prog'},el('b',{text:'Готую фото…'}),el('div',{class:'w-prog'},el('i',{style:'width:0%'})));const list=el('div',{class:'wp-list'});
  const saveBtn=el('button',{class:'btn',type:'button',disabled:true},'Зберегти показники');const sum=el('small',{class:'muted'});
  openSheet(el('h2',{text:'Показники з фото'}),el('p',{class:'muted',style:'margin:0',text:perLabel(per)+' · '+files.length+' '+plural(files.length,'фото','фото','фото')+'. Перевірте розпізнане перед збереженням.'}),prog,list,el('div',{class:'wp-foot'},sum,saveBtn),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));
  const setP=(t,p)=>{prog.firstChild.textContent=t;prog.querySelector('i').style.width=Math.round(p*100)+'%';};
  const maxB=(caps.images.maxBytes||5e6)*0.9;
  for(const it of items){try{const img=await loadImg(it.f);it.thumb=shrink(img,360,0.7);it.full=shrinkFit(img);let q=.85,mx=1600;it.blob=await wImgBlob(img,mx,q);while(it.blob&&it.blob.size>maxB&&mx>700){mx=Math.round(mx*.8);it.blob=await wImgBlob(img,mx,q);}}catch(e){it.err='Не вдалося відкрити фото';}setP('Готую фото… '+(it.i+1)+'/'+items.length,(it.i+1)/items.length*.15);}
  const cat=S.wMet.filter(m=>m.serial||m.tenant).map(m=>{const p=wPrevVal(per,m.id);return m.id+' | '+wMeterLabel(m)+(p!=null?' | попередній: '+p:'');}).join('\n');
  const per1=Math.max(1,Math.min(caps.images.maxCount||5,6));const ok=items.filter(x=>x.blob);
  for(let k=0;k<ok.length;k+=per1){const chunk=ok.slice(k,k+per1);setP('Розпізнаю лічильники… '+Math.min(k+per1,ok.length)+'/'+ok.length,.15+.85*(k/ok.length));
    const prompt='Ти читаєш фото лічильників води (м³). Фото пронумеровані від 0 до '+(chunk.length-1)+' у тому порядку, як передані.\n'+
      'Для КОЖНОГО фото визнач:\n- serial: заводський номер лічильника, як надруковано на корпусі/табличці (або null, якщо не видно);\n- value: показник у м³ числом. Чорні/білі цифри — цілі кубометри, червоні — дробова частина (після коми). Ігноруй ведучі нулі. Якщо не читається — null;\n- meter_id: id лічильника з каталогу нижче, що відповідає номеру (враховуй, що OCR може плутати 0/O, 1/I, 8/B, номер може бути видно частково), або null;\n- confidence: "high" або "low";\n- note: коротке пояснення українською, якщо є сумнів (інакше "").\n'+
      'Порада: показник зазвичай трохи більший за «попередній» у каталозі.\n\nКАТАЛОГ (id | об’єкт · орендар · № | попередній):\n'+cat+'\n\nВідповідь — ТІЛЬКИ JSON-масив: [{"i":0,"serial":"...","value":12.345,"meter_id":"m001","confidence":"high","note":""}, ...]';
    try{const r=await sample.json(prompt,{images:chunk.map(x=>x.blob),modelTier:'default'});const arr=Array.isArray(r)?r:(r&&r.items)||[];
      chunk.forEach((it,j)=>{const a=arr.find(x=>+x.i===j)||arr[j]||{};it.ser=a.serial||null;it.val=a.value==null||isNaN(+a.value)?null:Math.round(+a.value*1000)/1000;it.conf=a.confidence||'low';it.note=a.note||'';
        let m=a.meter_id&&S.wMet.find(x=>x.id===a.meter_id);const bySer=it.ser&&wMatchSerial(it.ser);if(bySer&&(!m||(m.serial&&wNormSer(m.serial)!==wNormSer(bySer.serial)&&wNormSer(bySer.serial).endsWith(wNormSer(it.ser)))))m=bySer;
        it.mid=m?m.id:null;it.on=!!(it.mid&&it.val!=null);});}
    catch(e){const c=e&&e.code;chunk.forEach(it=>{it.err=c==='rate_limited'?'Ліміт запитів — спробуйте пізніше':c==='not_granted'?'Немає дозволу на розпізнавання':'Не вдалося розпізнати';});if(c==='not_granted')break;}}
  setP('Готово — перевірте результати',1);prog.classList.add('done');
  const used=()=>{const c={};items.forEach(x=>{if(x.on&&x.mid)c[x.mid]=(c[x.mid]||0)+1;});return c;};
  const opts=[el('option',{value:'',text:'— оберіть лічильник —'}),...S.wObj.map(o=>{const g=el('optgroup',{label:o.name});S.wMet.filter(m=>m.obj===o.id&&(m.serial||m.kind==='main')).sort((a,b)=>(a.order||0)-(b.order||0)).forEach(m=>g.append(el('option',{value:m.id,text:(m.tenant||'Загальнобудинковий')+(m.serial?' · '+m.serial:'')})));return g;})];
  const draw=()=>{const u=used();list.replaceChildren(...items.map(it=>{const m=it.mid&&S.wMet.find(x=>x.id===it.mid);const prev=m?wPrevVal(per,m.id):null;const d=prev!=null&&it.val!=null?Math.round((it.val-prev)*1000)/1000:null;
    const warn=it.err||(!it.mid?'Не знайдено лічильник — оберіть вручну':it.val==null?'Не прочитано показник — впишіть':d!=null&&d<0?'Менше за попередній ('+fm3(prev)+')':d!=null&&prev!=null&&d>Math.max(50,prev*0.5)?'Дуже велика витрата — перевірте':u[it.mid]>1?'Цей лічильник вибрано кілька разів':it.conf==='low'?(it.note||'Розпізнано з сумнівом'):'');
    const sel=el('select',{'aria-label':'Лічильник'},opts.map(o=>o.cloneNode(true)));sel.value=it.mid||'';sel.addEventListener('change',()=>{it.mid=sel.value||null;it.on=!!(it.mid&&it.val!=null);draw();});
    const vin=el('input',{type:'text',inputmode:'decimal',value:it.val==null?'':String(it.val).replace('.',','),placeholder:'м³'});vin.addEventListener('change',()=>{const v=parseFloat(vin.value.replace(',','.'));it.val=isNaN(v)?null:Math.round(v*1000)/1000;it.on=!!(it.mid&&it.val!=null);draw();});
    const cb=el('input',{type:'checkbox','aria-label':'Зберегти цей показник'});cb.checked=it.on;cb.disabled=!(it.mid&&it.val!=null);cb.addEventListener('change',()=>{it.on=cb.checked;draw();});
    return el('div',{class:'wp-it'+(warn?' warn':'')+(it.on?'':' off')},
      el('button',{type:'button',class:'wp-ph',onclick:()=>{if(it.full)openSheet(el('img',{src:it.full,alt:'',style:'width:100%;border-radius:12px'}),el('button',{class:'btn ghost',type:'button',onclick:()=>wPhotoRun.reopen&&wPhotoRun.reopen()},'Назад'));}},it.thumb?el('img',{src:it.thumb,alt:''}):el('span',{text:'⚠'})),
      el('div',{class:'wp-main'},sel,el('div',{class:'wp-vals'},el('label',{},el('small',{text:'Показник'}),vin),el('span',{class:'wp-d'},el('small',{text:'Попередній'}),el('b',{text:prev==null?'—':fm3(prev)})),el('span',{class:'wp-d'},el('small',{text:'Спожито'}),el('b',{class:d!=null&&d<0?'neg':'',text:d==null?'—':fm3(d)}))),
        it.ser?el('small',{class:'muted',text:'Номер на фото: '+it.ser}):null,warn?el('small',{class:'wp-w',text:'⚠ '+warn}):null),
      el('label',{class:'wp-cb'},cb));}));
    const n=items.filter(x=>x.on).length;sum.textContent=n+' з '+items.length+' буде збережено';saveBtn.disabled=!n;saveBtn.textContent='Зберегти '+n+' '+plural(n,'показник','показники','показників');};
  const shEl=document.querySelector('#sheetRoot .sheet');if(shEl)shEl.classList.add('wide');const sheetNodes=[...shEl.children];wPhotoRun.reopen=()=>{openSheet(...sheetNodes);const x=document.querySelector('#sheetRoot .sheet');if(x)x.classList.add('wide');};
  draw();
  saveBtn.onclick=async()=>{const sel=items.filter(x=>x.on&&x.mid&&x.val!=null);if(!sel.length)return;const dup=used();if(Object.values(dup).some(v=>v>1)){toast('Один лічильник вибрано кілька разів — виправте');return;}
    saveBtn.disabled=true;saveBtn.textContent='Зберігаю…';const reads={};
    try{for(const it of sel){let ph=null;if(it.full){const ref=await S.db.collection('photos').add({img:it.full,kind:'water',per,meter:it.mid,by:S.myId,at:Date.now()});ph={id:ref.id,thumb:it.thumb};}
        const cur=wRead(per,it.mid)||{};const prev=wPrevVal(per,it.mid);reads[it.mid]={e:it.val,ph,src:'photo',at:Date.now(),...(cur.s==null&&prev!=null?{s:prev}:{})};}
      await S.db.doc('wPeriods/'+per).update({reads,updatedAt:Date.now(),updatedBy:S.myId});
      S.wPerD[per].reads=S.wPerD[per].reads||{};for(const k in reads)S.wPerD[per].reads[k]={...(S.wPerD[per].reads[k]||{}),...reads[k]};
      if(typeof devLog==='function')devLog('Вода: внесено з фото '+sel.length+' показників');closeSheet();toast('Збережено '+sel.length+' '+plural(sel.length,'показник','показники','показників'));render();}
    catch(e){console.error(e);if(typeof logErr==='function')logErr('wPhoto save: '+(e&&e.message||e));toast('Не вдалося зберегти — спробуйте ще раз');saveBtn.disabled=false;draw();}};}
