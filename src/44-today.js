// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: today

/* ---------- today ---------- */
function viewToday(){
  const out=[];const m=myStaff();
  if(!m)out.push(claimCard());
  const tIdx=todayIdx();const thisWeek=S.weekStart===mondayOf(new Date());
  if(m){
    const v=thisWeek&&S.week?dayValue(m.id,tIdx):'';
    const hero=heroCard(m,v,thisWeek&&!!S.week,tIdx);
    out.push(hero);
    if(earns(m)){const sl=staleShift(m);if(sl)out.push(staleCard(sl));out.push(shiftMini(m));}
    const mine=S.tasks.filter(t=>myOpen(t,m)).sort(byDue);
    out.push(el('div',{class:'row between'},el('h2',{text:'Мої задачі'}),el('span',{class:'muted small',text:mine.length?mine.length+' відкритих':''})));
    out.push(mine.length?taskGroups(mine,'today'):el('div',{class:'card empty'},el('p',{class:'muted',text:'Відкритих задач немає.'})));
  }
  {const ic=inspTodayCard();if(ic)out.push(ic);}
  {const cc=clTodayCard();if(cc)out.push(cc);}
  {const pc=pmTodayCard();if(pc)out.push(pc);}
  if(thisWeek&&S.week){
    const on=sortedStaff().filter(s=>dayValue(s.id,tIdx));
    out.push(el('div',{class:'row between split'},el('h2',{text:'Сьогодні на зміні'}),el('span',{class:'muted small',text:on.filter(s=>isWorking(dayValue(s.id,tIdx))).length+' на змінах'})));
    out.push(on.length?el('div',{class:'stack list'},on.map(s=>personRow(s,tIdx,false))):el('div',{class:'card empty'},el('p',{class:'muted',text:'Сьогодні нікого не заплановано.'})));
  }
  return out;
}
function claimCard(){
  const free=sortedStaff().filter(s=>!s.userId);
  if(!S.myId)return el('div',{class:'card stack'},el('h2',{text:'Увійдіть, щоб бачити свої зміни'}),el('p',{class:'muted',text:'Відкрийте застосунок, увійшовши у свій обліковий запис Claude.'}));
  if(S.isOwner){
    const sel=el('select',{id:'claimSel'},el('option',{value:'',text:'Оберіть своє ім’я'}),free.map(s=>el('option',{value:s.id,text:s.name+' · '+(ROLE_NAME[s.role]||'')})));
    return el('div',{class:'card stack'},el('h2',{text:'Хто ви в колективі?'}),
      el('p',{class:'muted',text:'Ви власник, тому прив’язуєтесь одразу. Решта працівників надсилатимуть запит, а ви його підтверджуватимете.'}),
      el('label',{for:'claimSel'},'Ваше ім’я',sel),
      el('button',{class:'btn',type:'button',onclick:()=>{const id=sel.value;if(!id){toast('Оберіть ім’я зі списку');return;}
        write(()=>S.db.doc('staff/'+id).update({userId:S.myId}),'Готово, це ви');}},'Це я'));
  }
  const req=S.requests.find(r=>r.id===S.myId);
  if(req){const s=staffById(req.staffId);
    return el('div',{class:'card stack'},el('h2',{text:'Запит надіслано'}),
      el('p',{class:'muted',text:'Ви зареєструвались як «'+(s?s.name:'—')+'». Керівник має підтвердити, що це ви. Після цього тут з’являться ваші зміни та задачі.'}),
      el('button',{class:'btn ghost',type:'button',onclick:()=>write(()=>S.db.doc('requests/'+S.myId).delete(),'Запит скасовано')},'Скасувати запит'));}
  const sel=el('select',{id:'claimSel'},el('option',{value:'',text:'Оберіть своє ім’я'}),free.map(s=>el('option',{value:s.id,text:s.name+' · '+(ROLE_NAME[s.role]||'')})),el('option',{value:'new',text:'Мене немає у списку'}));
  const nm=el('input',{id:'claimName',placeholder:'Ім’я та перша літера прізвища',maxlength:'60'});
  const nmWrap=el('label',{for:'claimName',hidden:true},'Як вас записати',nm);
  sel.addEventListener('change',()=>{nmWrap.hidden=sel.value!=='new';});
  return el('div',{class:'card stack'},
    el('h2',{text:'Реєстрація'}),
    el('p',{class:'muted',text:'Оберіть своє ім’я і надішліть запит. Керівник підтвердить, що це саме ви, і тоді відкриються ваші зміни та задачі.'}),
    el('label',{for:'claimSel'},'Ваше ім’я',sel),nmWrap,
    el('button',{class:'btn',type:'button',onclick:()=>{const id=sel.value;if(!id){toast('Оберіть ім’я зі списку');return;}
      const name=nm.value.trim();if(id==='new'&&!name){toast('Напишіть, як вас записати');nm.focus();return;}
      write(()=>S.db.doc('requests/'+S.myId).set({staffId:id==='new'?null:id,newName:id==='new'?name:null,at:Date.now()}),'Запит надіслано керівнику');}},'Надіслати запит'));
}
function weekStrip(sid){const tIdx=isThisWeek()?todayIdx():-1;
  return el('div',{class:'wstrip'},DS.map((d,i)=>{const v=dayValue(sid,i);const parts=shiftParts(v);
    return el('div',{class:'wday'+(i===tIdx?' now':'')+(i>=5?' we':'')+(parts.length?'':' off')},
      el('span',{class:'wd-n',text:d}),el('span',{class:'wd-d',text:dm(addDays(S.weekStart,i)).slice(0,2)}),
      el('div',{class:'wd-s'},parts.length?parts.map(miniShift):[el('span',{class:'wd-off',text:'вихідний'})]));}));}
function taskRow(t){const done=isDone(t);
  return el('button',{type:'button',class:'trow'+(done?' done':''),onclick:()=>go('tasks')},
    el('span',{class:'tr-dot'+(t.reworkActive?' rw':'')}),el('span',{class:'tr-t',text:t.title}),t.reworkActive?el('span',{class:'rwchip',text:'Доопрацювати'}):null,dueTag(t));}
function personRow(s,i,editable){
  const v=dayValue(s.id,i);
  const inner=[avatarP(s),el('span',{class:'nm'},el('b',{text:s.name}),roleTags(s)),el('span',{class:'sh tiles'},v?shiftParts(v).map(miniShift):[el('span',{class:'wd-off',text:'вихідний'})])];
  return editable?el('button',{class:'person',type:'button','aria-label':'Змінити зміну: '+s.name+', '+DAYS[i],onclick:()=>editShift(s,i)},inner):el('button',{class:'person',type:'button','aria-label':'Профіль: '+s.name,onclick:()=>openPerson(s.id)},inner);
}
