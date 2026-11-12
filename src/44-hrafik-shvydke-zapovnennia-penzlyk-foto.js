// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Графік: швидке заповнення (пензлик, фото, копія тижня)

/* ---------- Графік: швидке заповнення (пензлик, фото, копія тижня) ---------- */
const SC_BRUSH=[['','Вихідний'],['Д','Менеджер'],['8:00–13:00','8–13'],['17:00–20:00','17–20'],['8:00–13:00|17:00–20:00','8–13 + 17–20'],['13:30–20:00','13:30–20'],['15:00–20:00','15–20'],['8:00–12:00|16:00–20:00','8–12 + 16–20'],['8:00–11:00|15:00–17:00','8–11 + 15–17']];
function scBrushes(){const extra=(S.scCustom||[]).filter(v=>!SC_BRUSH.some(b=>b[0]===v)).map(v=>[v,v.replace(/:00/g,'').replace('|',' + ')]);return SC_BRUSH.concat(extra);}
function scToolbar(){const on=S.brush!=null;const cur=on?scBrushes().find(b=>b[0]===S.brush):null;
  return el('div',{class:'card sc-tools'+(on?' on':'')},
    el('div',{class:'row between',style:'gap:8px'},
      el('button',{type:'button',class:'btn sm'+(on?'':' ghost'),'aria-pressed':String(on),onclick:()=>{if(on){S.brush=null;scFlush();}else{S.brush='8:00–13:00';S.schedView='week';}render();}},svg('<path d="M18 2l4 4-11 11H7v-4z"/><path d="M7 17c-2 0-4 1-4 4 2 0 4-1 4-4z"/>'),on?' Готово':' Пензлик'),
      el('div',{class:'row',style:'gap:6px'},
        el('button',{type:'button',class:'btn ghost sm',onclick:scPhoto},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' З фото'),
        el('button',{type:'button',class:'btn ghost sm',onclick:()=>confirmSheet('Замінити графік цього тижня копією попереднього?','Скопіювати',copyPrevWeek)},'Як минулого тижня'))),
    on?el('div',{class:'sc-brushes'},scBrushes().map(([v,l])=>el('button',{type:'button',class:'sc-br'+(S.brush===v?' on':''),'aria-pressed':String(S.brush===v),onclick:()=>{S.brush=v;render();}},l)),
      el('button',{type:'button',class:'sc-br add',onclick:()=>{const t=prompt('Свій час, напр. 9:00–18:00 або 8–13, 17–20');if(t==null)return;const v=normShift(t);if(!v){toast('Не вдалося розібрати час');return;}S.scCustom=[...(S.scCustom||[]),v];S.brush=v;render();}},'+ Свій')):null,
    on?el('p',{class:'muted small',style:'margin:0',text:'Обрано: '+(cur?cur[1]:S.brush)+' — торкайтеся клітинок, щоб заповнити. Торкання імені заповнить увесь тиждень працівника.'}):null);}
/* Застосувати пензлик: локально одразу, запис у базу — пакетом */
function scPaint(st,idx){const ws=S.weekStart;S.week.days=S.week.days||{};const days=(S.week.days[st.id]?[...S.week.days[st.id]]:['','','','','','','']);
  (Array.isArray(idx)?idx:[idx]).forEach(i=>days[i]=S.brush);S.week.days[st.id]=days;S.scQ=S.scQ||{};S.scQ[st.id]=days;S.scQWs=ws;render();clearTimeout(S.scQT);S.scQT=setTimeout(scFlush,700);}
function scFlush(){clearTimeout(S.scQT);const q=S.scQ;const ws=S.scQWs;S.scQ=null;if(!q||!ws||!Object.keys(q).length)return;write(()=>S.db.doc('weeks/'+ws).update({days:q}));}
/* Розпізнати графік із фото таблиці */
async function scPhoto(){const sample=await claude.use('sample').catch(()=>null);const caps=sample?await sample.limits().catch(()=>null):null;
  if(!sample||!caps||!caps.images){toast('Розпізнавання фото тут недоступне');return;}
  const inp=el('input',{type:'file',accept:(caps.images.mediaTypes||['image/jpeg','image/png']).join(',')+',image/*'});
  inp.addEventListener('change',()=>{if(inp.files[0])scPhotoRun(inp.files[0],sample,caps);});inp.click();}
async function scPhotoRun(file,sample,caps){const ws=S.weekStart;const staff=schedStaff();const all=sortedStaff();
  const box=el('div',{class:'stack'},el('div',{class:'wp-prog'},el('b',{text:'Розпізнаю таблицю…'}),el('div',{class:'w-prog'},el('i',{style:'width:35%'}))));
  openSheet(el('h2',{text:'Графік із фото'}),el('p',{class:'muted',style:'margin:0',text:'Тиждень '+dm(ws)+' – '+dm(addDays(ws,6))+'. Перевірте розпізнане перед збереженням.'}),box,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));
  let blob;try{const img=await loadImg(file);const maxB=(caps.images.maxBytes||5e6)*0.9;let mx=2000;blob=await wImgBlob(img,mx,.9);while(blob&&blob.size>maxB&&mx>800){mx=Math.round(mx*.8);blob=await wImgBlob(img,mx,.85);}}catch(e){box.replaceChildren(el('p',{class:'muted',text:'Не вдалося відкрити фото'}));return;}
  const list=all.map(s=>s.id+' | '+s.name+(s.role?' | '+(ROLE_NAME[s.role]||s.role):'')).join('\n');
  const prompt='На фото — тижневий графік змін працівників (таблиця: рядки — працівники, колонки — дні з понеділка по неділю). Дати в шапці ігноруй — колонки бери по порядку: понеділок=0 … неділя=6.\n'+
    'Значення клітинки: "Д" — менеджер повний день; "-" або порожньо — вихідний; час на кшталт "8:00-13:00"; дві зміни в клітинці (два рядки) — через "|", напр. "8:00-13:00|17:00-20:00".\n'+
    'Зістав імена з таблиці з працівниками (прізвище може бути скорочене до літери: «К. Богдан» = «Богдан К.»):\n'+list+'\n'+
    'Також, якщо є рядок «Відповідальний за об’єкт» — визнач, хто це, і години.\n'+
    'Відповідь — ТІЛЬКИ JSON: {"rows":[{"staff_id":"…","name_on_photo":"…","days":["Д","","8:00-13:00|17:00-20:00","","","",""]}],"responsible":{"staff_id":"…або null","hours":"8:00-20:00"}}';
  let r;try{r=await sample.json(prompt,{images:[blob],modelTier:'default'});}catch(e){box.replaceChildren(el('p',{class:'muted',text:'Не вдалося розпізнати: '+(e&&e.message||'помилка')}));return;}
  const rows=((r&&r.rows)||[]).map(x=>({sid:all.some(s=>s.id===x.staff_id)?x.staff_id:'',name:x.name_on_photo||'',days:Array.from({length:7},(_,i)=>normShift(String(((x.days||[])[i])||'').replace(/^[-–—]$/,'')))}));
  if(!rows.length){box.replaceChildren(el('p',{class:'muted',text:'Таблицю не розпізнано. Спробуйте чіткіше фото.'}));return;}
  const resp=r.responsible&&all.some(s=>s.id===r.responsible.staff_id)?{id:r.responsible.staff_id,h:normShift(r.responsible.hours||'')||'8:00–20:00'}:null;
  const draw=()=>{const g=el('div',{class:'scp-grid'});g.append(el('span',{class:'scp-h'},'Працівник'),...DS.map(d=>el('span',{class:'scp-h',text:d})));
    rows.forEach((x,ri)=>{const sel=el('select',{class:'scp-sel','aria-label':'Працівник для «'+x.name+'»',onchange:e=>{x.sid=e.target.value;draw();}},el('option',{value:'',text:'— пропустити —'}),all.map(s=>el('option',{value:s.id,selected:x.sid===s.id?true:null,text:s.name})));
      g.append(el('span',{class:'scp-n'},el('small',{class:'muted',text:x.name}),sel));
      x.days.forEach((v,i)=>{const cur=x.sid?dayValue(x.sid,i):'';const ch=x.sid&&S.week&&cur!==v;
        const inp=el('input',{class:'scp-c'+(ch?' ch':''),value:v.replace(/\|/g,', '),'aria-label':(x.name||'')+', '+DAYS[i],onchange:e=>{x.days[i]=normShift(e.target.value);draw();}});g.append(inp);});});
    const n=rows.filter(x=>x.sid).length;const dup=rows.filter(x=>x.sid).map(x=>x.sid).filter((v,i,a)=>a.indexOf(v)!==i);
    box.replaceChildren(el('div',{class:'scp-wrap'},g),resp?el('p',{class:'small',style:'margin:0'},'Відповідальний: ',el('b',{text:(staffById(resp.id)||{}).name||''}),' · '+resp.h):null,
      dup.length?el('p',{class:'small',style:'margin:0;color:var(--warn)',text:'Один працівник обраний двічі — виправте.'}):null,
      el('p',{class:'muted small',style:'margin:0',text:'Підсвічені клітинки відрізняються від поточного графіка. Клітинки можна виправити вручну.'}),
      el('button',{class:'btn',type:'button',disabled:n&&!dup.length?null:true,onclick:async()=>{const days={};rows.filter(x=>x.sid).forEach(x=>days[x.sid]=x.days);closeSheet();
        const extra=resp?{responsibleId:resp.id,responsibleHours:resp.h}:{};
        if(S.weekExists)await write(()=>S.db.doc('weeks/'+ws).update({days,...extra}),'Графік оновлено з фото');else await write(()=>S.db.doc('weeks/'+ws).set({start:ws,days,...extra}),'Графік створено з фото');}},'Зберегти графік ('+n+' прац.)'));};
  draw();}
async function copyPrevWeek(){
  const ws=S.weekStart;const prev=await S.db.doc('weeks/'+addDays(ws,-7)).get().catch(()=>null);
  const base=prev&&prev.exists?prev.data():{days:{}};
  write(()=>S.db.doc('weeks/'+ws).set({start:ws,days:base.days||{},responsibleId:base.responsibleId||null,responsibleHours:base.responsibleHours||null}),prev&&prev.exists?'Графік скопійовано':'Попереднього графіка немає, створено порожній');
}
function editShift(s,i){if(S.brush!=null){scPaint(s,i);return;}
  const cur=dayValue(s.id,i);
  const inp=el('input',{id:'shiftInput',value:cur==='Д'?'':shiftParts(cur).join(', '),placeholder:'8:00–13:00, 17:00–20:00',autocomplete:'off'});
  const save=v=>{const days=(S.week.days&&S.week.days[s.id])?[...S.week.days[s.id]]:['','','','','','',''];days[i]=normShift(v);
    closeSheet();write(()=>S.db.doc('weeks/'+S.weekStart).update({days:{[s.id]:days}}),'Збережено');};
  const presets=['Д','8:00–13:00','17:00–20:00','8:00–13:00, 17:00–20:00','8:00–12:00, 16:00–20:00','13:30–20:00'];
  openSheet(el('h2',{text:s.name}),el('p',{class:'muted',style:'margin:0',text:DAYS[i]+', '+dm(addDays(S.weekStart,i))}),
    el('div',{class:'quick'},presets.map(p=>el('button',{type:'button',onclick:()=>save(p)},p==='Д'?'Менеджер 8:30–17:30':p)),el('button',{type:'button',onclick:()=>save('')},'Вихідний')),
    el('label',{for:'shiftInput'},'Свій час (кілька змін через кому)',inp),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>save(inp.value)},'Зберегти'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
}
