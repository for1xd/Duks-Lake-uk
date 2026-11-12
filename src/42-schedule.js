// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: schedule

/* ---------- schedule ---------- */
function roleName(r){return ROLE_NAME[r]||'';}
/* Відповідальний за об’єкт: на тиждень + за потреби різні по днях. Вибір — керівник Facility, старший менеджер, головний інженер */
const RESP_ROLES=['director','senior','engineer'];
function respPool(){return sortedStaff().filter(s=>[s.role,s.extraRole].some(r=>RESP_ROLES.includes(r)));}
function respOn(w,i){const rd=(w&&w.respDays)||{};return (rd[i]||rd[String(i)])||(w&&w.responsibleId)||null;}
function respCard(ws,edit,tIdx){const w=S.week||{};const rd=w.respDays||{};const hasDays=[0,1,2,3,4,5,6].some(i=>rd[i]||rd[String(i)]);
  const main=w.responsibleId&&staffById(w.responsibleId);const today=tIdx>=0&&respOn(w,tIdx)?staffById(respOn(w,tIdx)):null;
  if(!main&&!hasDays&&!edit)return null;const who=today||main;
  const days=hasDays?el('div',{class:'rs-days'},[0,1,2,3,4,5,6].map(i=>{const s=staffById(respOn(w,i));return el('span',{class:'rs-d'+(i===tIdx?' now':'')},el('b',{text:DS[i]}),el('span',{text:s?s.name.split(' ')[0]:'—'}));})):null;
  const body=[who?avatar(who):el('span',{class:'av rs-none','aria-hidden':'true',text:'?'}),el('div',{style:'flex:1;min-width:0'},el('div',{class:'muted small',style:'font-weight:700',text:today&&hasDays?'Відповідальний за об’єкт сьогодні':'Відповідальний за об’єкт'}),el('b',{text:who?who.name:'Не призначено'})),
    el('span',{class:'pill am',text:w.responsibleHours||'8:00–20:00'}),edit?el('span',{class:'rs-ed','aria-hidden':'true'},svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>')):null];
  if(!edit)return el('div',{class:'card rs-card'},el('div',{class:'row',style:'gap:12px;flex-wrap:nowrap'},...body),days);
  return el('button',{type:'button',class:'card rs-card rs-btn','aria-label':'Змінити відповідального за об’єкт',onclick:()=>respEdit(ws)},el('div',{class:'row',style:'gap:12px;flex-wrap:nowrap'},...body),days);}
function respEdit(ws){const w=S.week||{};const pool=respPool();let main=w.responsibleId||null;const rd={};[0,1,2,3,4,5,6].forEach(i=>{rd[i]=(w.respDays||{})[i]||(w.respDays||{})[String(i)]||'';});
  const extra=[main,...Object.values(rd)].filter(Boolean).map(staffById).filter(s=>s&&!pool.includes(s));const all=[...pool,...extra];
  const chips=el('div',{class:'pick',role:'radiogroup','aria-label':'Відповідальний на тиждень'});
  const drawChips=()=>chips.replaceChildren(...all.map(s=>el('button',{type:'button',class:'pk',role:'radio','aria-checked':String(main===s.id),'aria-pressed':String(main===s.id),onclick:()=>{main=main===s.id?null:s.id;drawChips();drawDays();}},avatar(s),el('span',{text:s.name}))));
  const hrs=el('input',{id:'rsH',type:'text',inputmode:'text',placeholder:'напр. 8:00–20:00',value:w.responsibleHours||'8:00–20:00'});
  const byDay=el('input',{type:'checkbox',class:'ck',id:'rsByDay',checked:Object.values(rd).some(Boolean)?true:null});
  const daysBox=el('div',{class:'stack',style:'gap:8px'});
  const drawDays=()=>{daysBox.hidden=!byDay.checked;const mainS=main&&staffById(main);daysBox.replaceChildren(...[0,1,2,3,4,5,6].map(i=>{const id='rsD'+i;const sel=el('select',{id},el('option',{value:'',text:mainS?'як на тиждень':'— не призначено —'}),all.map(s=>el('option',{value:s.id,text:s.name})));sel.value=rd[i]||'';sel.addEventListener('change',()=>{rd[i]=sel.value;});
    return el('label',{class:'rs-row',for:id},el('span',{class:'rs-dl',text:DS[i]+' · '+dm(addDays(ws,i))}),sel);}));fancySel(daysBox);};
  byDay.addEventListener('change',drawDays);drawChips();drawDays();
  openSheet(el('h2',{text:'Відповідальний за об’єкт'}),el('p',{class:'muted',style:'margin:0',text:'Тиждень '+dm(ws)+' – '+dm(addDays(ws,6))+'. Можна обрати одного на весь тиждень або різних по днях.'}),
    el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'На весь тиждень'}),pool.length?chips:el('p',{class:'muted',style:'margin:0',text:'Немає працівників з ролями директор, старший менеджер чи головний інженер — додайте їх у «Колективі».'})),
    el('label',{for:'rsH'},'Години чергування',hrs),
    el('label',{class:'ck-row',for:'rsByDay'},byDay,el('span',{text:'Різні відповідальні по днях'})),daysBox,
    el('div',{class:'btn-pair'},el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'),el('button',{class:'btn',type:'button',onclick:()=>{const h=hrs.value.trim();const hh=h?(normShift(h)||h):'8:00–20:00';
      const days={};[0,1,2,3,4,5,6].forEach(i=>{days[i]=byDay.checked&&rd[i]?rd[i]:null;});closeSheet();
      write(()=>S.db.doc('weeks/'+ws).update({responsibleId:main,responsibleHours:hh,respDays:days}),'Відповідального за об’єкт збережено');}},'Зберегти')));}
