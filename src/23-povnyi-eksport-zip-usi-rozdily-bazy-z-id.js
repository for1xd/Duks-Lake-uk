// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Повний експорт (ZIP): усі розділи бази з ID і зв'язками, оригінали файлів, зведення для звірки

/* ---------- Повний експорт (ZIP): усі розділи бази з ID і зв'язками, оригінали файлів, зведення для звірки ---------- */
const EXP_COLS=[['staff','Працівники: користувачі, ролі'],['tasks','Задачі'],['photos','Фото до задач, змін і чату'],['chat','Повідомлення чатів'],['rooms','Чати: групи та налаштування'],['reads','Чати: позначки прочитання'],['tickets','Звернення в підтримку з відповідями'],['requests','Запити'],['shifts','Відмітки змін'],['weeks','Графіки по тижнях'],['wlog','Облік роботи за день'],['wl_rem','Облік роботи: надіслані нагадування'],['incidents','Екстрені ситуації'],['maint','Планове ТО'],['inspections','Обходи будівель'],['inspection_photos','Обходи: фото'],['inspection_exports','Обходи: сформовані звіти'],['buildings_assignments','Обходи: призначення будівель'],['cl_objects','Клінінг: об’єкти'],['cl_locs','Клінінг: локації'],['cl_cleaners','Клінінг: прибиральники'],['cl_exc','Клінінг: винятки графіка'],['cl_revisions','Клінінг: ревізії'],['cl_rev_photos','Клінінг: фото ревізій'],['docs','Документи УК'],['dz','Дебіторка'],['dzSnap','Дебіторка: знімки'],['waste','Сміття'],['parking','Паркінг'],['inv','Інвентар'],['consItems','Розхідники: позиції'],['consOps','Розхідники: операції'],['consHist','Розхідники: історія'],['wObjects','Вода: об’єкти'],['wMeters','Вода: лічильники'],['wPeriods','Вода: періоди'],['map_zones','Карта: зони'],['map_zones_hist','Карта: історія змін зон'],['log','Журнал дій (історія змін)'],['settings','Налаштування'],['resolve','Службове'],['presence','Службове: хто в мережі'],['games','Ігри'],['poker','Ігри: покер'],['wallets','Ігри: гаманці']];
let _zipP=null;function loadZip(){if(window.JSZip)return Promise.resolve(window.JSZip);if(!_zipP){const ld=src=>new Promise((res,rej)=>{const sc=document.createElement('script');sc.src=src;sc.onload=()=>window.JSZip?res(window.JSZip):rej(new Error('zip'));sc.onerror=()=>{sc.remove();rej(new Error(src));};document.head.append(sc);});
  _zipP=ld('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js').catch(()=>ld('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js')).catch(e=>{_zipP=null;throw e;});}return _zipP;}
function expSheet(){let dm=true;
  const go=el('button',{class:'btn',type:'button',onclick:async()=>{go.disabled=true;const ok=await fullExport(dm,t=>{go.textContent=t;});go.disabled=false;go.textContent='Сформувати ZIP';if(ok)closeSheet();}},'Сформувати ZIP');
  openSheet(el('h2',{text:'Повний експорт даних'}),
    el('p',{class:'muted',style:'margin:0',text:'Усі розділи бази з ID та зв’язками, історія змін, чати, звернення, користувачі з ролями й правами, оригінали фото і файлів, кількість записів по розділах і перелік файлів для звірки. Паролів, токенів і ключів доступу застосунок не зберігає, тож у копію вони не потрапляють.'}),
    el('label',{class:'row',style:'gap:10px;align-items:center'},el('input',{type:'checkbox',checked:true,style:'width:22px;height:22px',onchange:e=>{dm=e.target.checked;}}),el('span',{text:'Включити особисті листування (чати на двох)'})),
    el('p',{class:'muted small',style:'margin:0',text:'Архів формується на вашому пристрої й нікуди не надсилається. Передайте його самі закритим посиланням.'}),
    el('div',{class:'btn-pair'},el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'),go));}
async function fullExport(withDm,prog){prog=prog||(()=>{});let Z;try{Z=await loadZip();}catch(e){toast('Не вдалося завантажити модуль архіву. Перевірте зв’язок і спробуйте ще раз.');return false;}
  const dl=await claude.use('downloads').catch(()=>null);if(!dl){toast('Завантаження файлів тут недоступне');return false;}
  const at=new Date();const zip=new Z();const sum=[],files=[],miss=[];
  const ext=(m,n)=>{const e=n&&/\.([a-z0-9]{1,5})$/i.exec(n);return e?e[1]:({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','application/pdf':'pdf'})[m]||'bin';};
  const add=(path,b,col,id,field)=>{zip.file(path,b);files.push({path,collection:col,docId:id,field,bytes:b.size,type:b.type||''});return path;};
  const d2b=u=>{const c=u.indexOf(',');const m=(/^data:([^;,]+)/.exec(u)||[])[1]||'application/octet-stream';const bin=atob(u.slice(c+1));const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:m});};
  const blob=async id=>{try{const r=await fetch('/_blob/'+id);return r.ok?await r.blob():null;}catch(e){return null;}};
  const asset=async(col,x,id,field,name)=>{const b=await blob(id);if(b)return add('files/'+col+'/'+x.id+'_'+field+'.'+ext(b.type,name),b,col,x.id,field);miss.push({collection:col,docId:x.id,field,assetId:id});return null;};
  try{let n=0;for(const [col,label] of EXP_COLS){n++;prog('Розділ '+n+' з '+EXP_COLS.length+'…');let docs;
      try{const q=await S.db.collection(col).get();docs=q.docs.map(d=>({id:d.id,...d.data()}));}catch(e){sum.push({collection:col,label,count:null,error:String((e&&e.message)||e)});continue;}
      if(!withDm){if(col==='chat')docs=docs.filter(x=>!String(x.room||'').startsWith('dm_'));if(col==='rooms')docs=docs.filter(x=>!x.id.startsWith('dm_'));
        if(col==='reads')docs.forEach(x=>{if(x.rooms)x.rooms=Object.fromEntries(Object.entries(x.rooms).filter(([k])=>!k.startsWith('dm_')));});}
      if(!withDm&&col==='photos'){const dmIds=new Set();(S.chat||[]).forEach(c=>{if(String(c.room||'').startsWith('dm_')&&c.photoId)dmIds.add(c.photoId);});docs=docs.filter(x=>!dmIds.has(x.id));}
      for(const x of docs){
        for(const k of Object.keys(x)){const v=x[k];if(typeof v==='string'&&v.startsWith('data:')&&v.length>4096&&k!=='thumb'){const b=d2b(v);x[k]={file:add('files/'+col+'/'+x.id+'_'+k+'.'+ext(b.type),b,col,x.id,k)};}}
        if(typeof x.assetId==='string'&&x.assetId)x.assetFile=await asset(col,x,x.assetId,'asset');
        if(x.att&&x.att.id&&!x.att.gone)x.att.file=await asset(col,x,x.att.id,'att',x.att.name);
        if(x.mapImg&&x.mapImg.id)x.mapImg.file=await asset(col,x,x.mapImg.id,'mapImg');}
      zip.file('data/'+col+'.json',JSON.stringify(docs,null,1));sum.push({collection:col,label,count:docs.length});}
    prog('Пакую архів…');
    zip.file('roles.json',JSON.stringify({roles:ROLES,whatEachRoleCan:PERM_TXT.map(([r,can,cant])=>({role:r,name:ROLE_NAME[r],can,cannot:cant||null})),
      groups:{PLANNERS:{roles:PLANNERS,meaning:'змінюють графік і ставлять задачі'},ADMINS:{roles:ADMINS,meaning:'керують колективом і ролями'},TASKERS:{roles:TASKERS,meaning:'ставлять задачі'},EARNERS:{roles:EARNERS,meaning:'працівники зі змінами й годинами'},
        CL_EDIT_ROLES:{roles:CL_EDIT_ROLES,meaning:'редагують клінінг'},CL_REV_ROLES:{roles:CL_REV_ROLES,meaning:'погоджують ревізії клінінгу'},DK_EDIT_ROLES:{roles:DK_EDIT_ROLES,meaning:'редагують документи'},CONS_ISSUE_ROLES:{roles:CONS_ISSUE_ROLES,meaning:'видають розхідники'},WL_ROLES:{roles:WL_ROLES,meaning:'обирають «хто призначив» в обліку роботи'}},
      notes:'Роль «test» має права менеджера. Облік роботи ведуть: '+WL_IDS.join(', ')+'.'},null,1));
    const tot=sum.reduce((a,x)=>a+(x.count||0),0);
    zip.file('manifest.json',JSON.stringify({app:'Duck’s Lake',exportedAt:at.toISOString(),exportedBy:(myStaff()||{}).name||'',privateMessagesIncluded:withDm,totalRecords:tot,sections:sum,files,missingFiles:miss},null,1));
    const csv=r=>r.map(v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"').join(';');
    zip.file('summary.csv','﻿'+[csv(['Розділ','Опис','Записів']),...sum.map(x=>csv([x.collection,x.label,x.count==null?'помилка: '+x.error:x.count])),csv(['РАЗОМ','',tot])].join('\r\n'));
    zip.file('files.csv','﻿'+[csv(['Файл','Розділ','ID запису','Поле','Байт','Тип']),...files.map(f=>csv([f.path,f.collection,f.docId,f.field,f.bytes,f.type])),...miss.map(f=>csv(['НЕ ЗНАЙДЕНО: '+f.assetId,f.collection,f.docId,f.field,'','']))].join('\r\n'));
    zip.file('README.txt','Повний експорт Duck’s Lake\r\nСтаном на: '+dmy(at)+' '+hm(at.getTime())+' (UTC '+at.toISOString()+')\r\nЗаписів: '+tot+' у '+sum.length+' розділах; файлів: '+files.length+(miss.length?'; не знайдено файлів: '+miss.length:'')+'\r\nОсобисті листування: '+(withDm?'включено':'не включено')+'\r\n\r\ndata/<розділ>.json — записи розділу; поле id — ID запису. Зв’язки: staffId/sid/by/authorId → staff.id або userId; taskId → tasks.id; photoId → photos.id; room → rooms.id («main» — основний чат); revId → cl_revisions.id; inspectionId → inspections.id.\r\nfiles/ — оригінали фото і вкладень; у записі замість вмісту стоїть {"file": шлях}.\r\nsummary.csv — кількість записів по розділах; files.csv — перелік файлів для звірки; roles.json — ролі та права; manifest.json — усе разом у машинному вигляді.\r\nПаролів, токенів і ключів доступу застосунок не зберігає.\r\n');
    const out=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
    await dl.save({filename:'ducks-lake-full-export-'+ymd(at)+'-'+pad(at.getHours())+pad(at.getMinutes())+'.zip',data:out});
    devLog('Повний експорт: '+tot+' записів, '+files.length+' файлів');toast('Експорт готовий: '+tot+' записів, '+files.length+' файлів');return true;}
  catch(e){if(e&&e.code==='declined')return false;logErr('Повний експорт: '+((e&&e.message)||e));toast('Не вдалося сформувати експорт. Спробуйте ще раз.');return false;}}
async function devExport(){const data={exportedAt:new Date().toISOString(),staff:S.staff,tasks:S.tasks,chat:S.chat,shifts:S.shifts,dz:S.dz,waste:S.ws,inv:S.inv,parking:S.pk,maint:S.pm,incidents:S.sos,wObjects:S.wObj,wMeters:S.wMet,wPeriods:S.wPerD,log:S.log};
  const dl=await claude.use('downloads').catch(()=>null);if(!dl){toast('Завантаження файлів тут недоступне');return;}
  try{await dl.save({filename:'ducks-lake-backup-'+ymd(new Date())+'.json',data:new Blob([JSON.stringify(data,null,1)],{type:'application/json'})});devLog('Експорт бази');}catch(e){if(e&&e.code!=='declined')toast('Не вдалося зберегти файл');}}
function devPurge(){const old=(S.log||[]).filter(x=>Date.now()-x.at>30*864e5);if(!old.length){toast('Старих записів немає');return;}
  confirmSheet('Видалити '+old.length+' записів журналу, старших за 30 днів?','Видалити',()=>write(async()=>{for(const x of old)await S.db.doc('log/'+x.id).delete();},'Журнал очищено'));}
