// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: profile

/* ---------- profile ---------- */

function storageCard(){const box=el('div',{class:'card stack stor'},el('div',{class:'row between'},el('h2',{text:'Сховище файлів'}),el('span',{class:'muted small',text:'відео й документи з чату'})),el('p',{class:'muted',style:'margin:0',text:'Рахуємо…'}));
  assetUsage(true).then(u=>{if(!u){box.lastChild.textContent='Недоступно для вашого доступу.';return;}const max=Math.min(u.maxBytes||Infinity,ATT_LIM.total*1048576);const k=Math.min(1,u.bytes/max);
    const old=S.chat.filter(c=>c.att&&!c.att.gone&&Date.now()-c.at>30*864e5);
    box.replaceChildren(el('div',{class:'row between'},el('h2',{text:'Сховище файлів'}),el('b',{text:fmtSize(u.bytes)+' з '+fmtSize(max)})),
      el('div',{class:'stor-bar'+(k>.85?' hot':'')},el('i',{style:'width:'+Math.max(2,Math.round(k*100))+'%'})),
      el('span',{class:'muted small',text:u.files+' файлів · фото не рахуються (вони в базі, стиснуті до ~190 КБ)'}),
      el('span',{class:'muted small',text:'Ліміти: відео до '+ATT_LIM.video+' МБ, документ до '+ATT_LIM.file+' МБ.'}),
      el('button',{class:'btn ghost',type:'button',disabled:old.length?null:true,onclick:()=>confirmSheet('Видалити '+old.length+' файлів і відео з чату, старших за 30 днів? Повідомлення залишаться, але без вкладень.','Очистити',()=>write(async()=>{for(const c of old){await S.assets.delete(c.att.id).catch(()=>{});await S.db.doc('chat/'+c.id).update({att:{...c.att,gone:true}});}_usage.t=0;render();},'Старі файли видалено'))},old.length?'Очистити файли старші за 30 днів ('+old.length+')':'Старих файлів немає'));});
  return box;}
function viewProfile(){
  const m=myStaff();
  if(!m)return [claimCard()];
  const done=S.tasks.filter(t=>asg(t).includes(m.id)&&partDone(t,m.id)).length;const open=S.tasks.filter(t=>myOpen(t,m)).length;const a=avgRating(m.id);
  const file=el('input',{type:'file',accept:'image/*','aria-label':'Змінити фото'});
  file.addEventListener('change',async()=>{const f=file.files[0];file.value='';if(!f)return;
    try{const img=await loadImg(f);const ph=squareThumb(img,320);await S.db.doc('staff/'+m.id).update({photo:ph});toast('Фото оновлено');}catch(e){toast('Не вдалося зберегти фото.');}});
  const out=[el('div',{class:'card prof'},avatar(m,'big'),el('h2',{style:'font-size:22px',text:m.name}),roleTags(m),
    el('div',{class:'row',style:'justify-content:center'},el('span',{class:'btn ghost sm filebtn'},m.photo?'Змінити фото':'Додати фото',file),
      m.photo?el('button',{class:'btn ghost sm',type:'button',onclick:()=>write(()=>S.db.doc('staff/'+m.id).update({photo:null}),'Фото прибрано')},'Прибрати фото'):null)),
    el('div',{class:'stats'},
      el('div',{class:'stat'},el('b',{text:done}),el('span',{text:'виконано задач'})),
      el('div',{class:'stat'},el('b',{text:open}),el('span',{text:'відкритих задач'})),
      el('div',{class:'stat'},el('b',{text:a?a.avg.toFixed(1):'—'}),el('span',{text:'середня оцінка'})),
      earns(m)?el('div',{class:'stat ducks-stat'},el('b',{},duck(),String(sumDucks(m.id))),el('span',{text:'каченят зароблено'})):null)];
  {const pc=pmPersonCard(m.id,'Моє планове ТО');if(pc)out.push(pc);}
  out.push(lookPicker());
  if(canAdmin()&&S.assets)out.push(storageCard());
  const pe=el('input',{id:'myEmail',type:'email',value:m.email||'',placeholder:'name@gmail.com',maxlength:'120',autocomplete:'email'});
  const pp=el('input',{id:'myPhone',type:'tel',value:m.phone||'',placeholder:'+380 67 123 45 67',maxlength:'20',autocomplete:'tel'});
  const pt=el('input',{id:'myTg',value:m.telegram?'@'+m.telegram:'',placeholder:'@username',maxlength:'40',autocomplete:'off'});
  out.push(el('div',{class:'card stack split'},el('h2',{text:'Мої контакти'}),
    el('label',{for:'myPhone'},'Номер телефону',pp),
    el('label',{for:'myTg'},el('span',{class:'row',style:'gap:6px'},tgIcon(),'Telegram'),pt),
    el('label',{for:'myEmail'},'Пошта для сповіщень про нові задачі',pe),
    el('button',{class:'btn',type:'button',style:'align-self:flex-start',onclick:()=>{
      const v=pe.value.trim();if(v&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){toast('Перевірте адресу пошти');return;}
      const ph=normPhone(pp.value);if(pp.value.trim()&&!ph){toast('Перевірте номер телефону');return;}
      const tg=normTg(pt.value);if(pt.value.trim()&&!tg){toast('Telegram: від 5 символів, латиниця, цифри або _');return;}
      write(()=>S.db.doc('staff/'+m.id).update({email:v||null,phone:ph||null,telegram:tg||null}),'Контакти збережено');}},'Зберегти контакти')));
  if(S.week&&isThisWeek()){
    out.push(el('div',{class:'card stack'},el('div',{class:'row between'},el('h2',{text:'Мої зміни'}),el('span',{class:'muted small',text:dm(S.weekStart)+' – '+dm(addDays(S.weekStart,6))})),weekStrip(m.id)));
  }
  const myT=S.tasks.filter(t=>myOpen(t,m)).sort(byDue);const doneT=S.tasks.filter(t=>asg(t).includes(m.id)&&isDone(t)).sort((a,b)=>(b.doneAt||0)-(a.doneAt||0)).slice(0,5);
  out.push(el('div',{class:'card stack'},el('div',{class:'row between'},el('h2',{text:'Мої задачі'}),el('button',{class:'btn ghost sm',type:'button',onclick:()=>go('tasks')},'Усі задачі ›')),
    myT.length?el('div',{class:'stack',style:'gap:6px'},myT.map(taskRow)):el('p',{class:'muted',style:'margin:0',text:'Відкритих задач немає'}),
    doneT.length?el('span',{class:'t-lbl',style:'margin-top:6px',text:'Нещодавно виконані'}):null,
    doneT.length?el('div',{class:'stack',style:'gap:6px'},doneT.map(taskRow)):null));
  return out;
}
function squareThumb(img,size){const s=Math.min(img.naturalWidth,img.naturalHeight);const c=document.createElement('canvas');c.width=c.height=size;
  c.getContext('2d').drawImage(img,(img.naturalWidth-s)/2,(img.naturalHeight-s)/2,s,s,0,0,size,size);return c.toDataURL('image/jpeg',0.8);}
