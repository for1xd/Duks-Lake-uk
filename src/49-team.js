// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: team

/* ---------- team ---------- */
function viewTeam(){
  const out=[];const admin=canAdmin();
  if(admin&&S.requests.length){
    out.push(el('div',{class:'row between'},el('h2',{text:'Запити на вхід'}),el('span',{class:'badge',text:S.requests.length})));
    out.push(el('div',{class:'stack list'},S.requests.map(r=>{
      const s=r.staffId&&staffById(r.staffId);const p=S.profiles[r.id]||{};
      const roleSel=el('select',{id:'rq-'+r.id,'aria-label':'Роль'},ROLES.map(x=>el('option',{value:x.id,text:x.name,selected:x.id==='cleaner'})));
      return el('div',{class:'card stack'},
        el('div',{class:'row'},p.avatarUrl?el('img',{src:p.avatarUrl,alt:'',style:'width:40px;height:40px;border-radius:50%'}):null,
          el('div',{style:'flex:1;min-width:0'},el('b',{text:p.name||'Обліковий запис Claude'}),
            el('div',{class:'muted small',text:s?'Каже, що він: '+s.name:(r.newName?'Новий працівник: '+r.newName:'Ім’я вже зайняте або видалене')}))),
        !s&&r.newName?el('label',{for:'rq-'+r.id},'Роль',roleSel):null,
        el('div',{class:'row'},
          (s&&!s.userId)||(!s&&r.newName)?el('button',{class:'btn sm',type:'button',onclick:()=>approve(r,roleSel.value)},'Підтвердити'):null,
          el('button',{class:'btn danger sm',type:'button',onclick:()=>write(()=>S.db.doc('requests/'+r.id).delete(),'Запит відхилено')},'Відхилити')));
    })));
  }
  const GROUPS=[['all','Усі',null],['lead','Керівництво',['dev','director','engineer','senior']],['mgr','Менеджери',['manager']],['crew','Бригада',['master','gardener','cleaner']]];
  const rank=x=>{const i=ROLES.findIndex(r=>r.id===x.role);return -i;};
  const ppl=sortedStaff().sort((a,b)=>rank(a)-rank(b)||a.name.localeCompare(b.name,'uk'));
  const g=GROUPS.find(x=>x[0]===(S.teamF||'all'))||GROUPS[0];
  const shown=ppl.filter(x=>!g[2]||g[2].includes(x.role)||g[2].includes(x.extraRole));
  const q=el('input',{id:'teamQ',type:'search',placeholder:'Пошук за ім’ям',value:S.teamQ||'',autocomplete:'off','aria-label':'Пошук'});
  const grid=el('div',{class:'pgrid'},shown.map(x=>pcard(x)));
  const filt=()=>{const v=(q.value||'').trim().toLowerCase();S.teamQ=q.value;grid.querySelectorAll('.pcard').forEach(c=>{c.hidden=!!v&&!c.dataset.n.includes(v);});};
  q.addEventListener('input',filt);
  out.push(el('div',{class:'teambar'},
    el('div',{class:'tsearch'},svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),q),
    el('div',{class:'seg full tseg',role:'group','aria-label':'Фільтр'},GROUPS.map(([id,n,roles])=>el('button',{type:'button','aria-pressed':String((S.teamF||'all')===id),onclick:()=>{S.teamF=id;render();}},n,el('small',{text:String(roles?ppl.filter(x=>roles.includes(x.role)||roles.includes(x.extraRole)).length:ppl.length)})))),
    admin?el('button',{class:'btn',type:'button',onclick:()=>editPerson(null)},'+ Працівник'):null));
  out.push(grid);setTimeout(filt,0);
  out.push(permCard());
  return out;
}
function pcard(x){const isMe=S.myId&&x.userId===S.myId;const on=isOnline(x.id);
  const c=el('div',{class:'pcard','data-n':x.name.toLowerCase()},
    el('button',{type:'button',class:'pc-main','aria-label':'Профіль: '+x.name,onclick:()=>openPerson(x.id)},
      avatarP(x,'pc-av'),el('span',{class:'pc-t'},el('b',{text:x.name+(isMe?' (ви)':'')}),el('span',{class:'small '+(on?'online':'muted'),text:x.userId?seenText(x.id):'ще не підтверджений'})),
      earns(x)?el('span',{class:'ducks-pill sm'},duck(),String(sumDucks(x.id))):null),
    el('div',{class:'pc-foot'},roleTags(x),el('span',{class:'pc-acts'},
      x.telegram?el('a',{class:'pc-ic tg',href:'https://t.me/'+x.telegram,target:'_blank',rel:'noopener','aria-label':'Telegram '+x.name,title:'@'+x.telegram},tgIcon()):null,
      x.phone?el('button',{type:'button',class:'pc-ic','aria-label':'Скопіювати номер '+x.name,title:fmtPhone(x.phone),onclick:()=>copyText(x.phone)},svg('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>')):null,
      canAdmin()?el('button',{type:'button',class:'pc-ic','aria-label':'Редагувати '+x.name,onclick:()=>editPerson(x)},svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>')):null)));
  return c;}
function permCard(){
  const R=[
    ['dev',['Усе в застосунку','Підтверджує вхід нових людей','Призначає ролі']],
    ['director',['Підтверджує вхід і призначає ролі','Змінює графік','Ставить задачі та оцінює']],
    ['senior',['Ставить задачі та оцінює','Дивиться графік'],'Не змінює графік і колектив'],
    ['manager',['Змінює графік','Ставить задачі та оцінює']],
    ['engineer',['Ставить задачі та оцінює','Дивиться графік'],'Не змінює графік і колектив'],
    ['master',['Дивиться графік','Закриває свої задачі з фото'],'Нічого не змінює в графіку'],
    ['gardener',['Дивиться графік','Закриває свої задачі з фото'],'Нічого не змінює в графіку'],
    ['cleaner',['Дивиться графік','Закриває свої задачі з фото'],'Нічого не змінює в графіку']
  ];
  const ok='<path d="m5 12 5 5 9-10"/>';const no='<path d="M6 6l12 12M18 6 6 18"/>';
  return el('div',{class:'stack'},el('h2',{text:'Хто що може'}),
    el('div',{class:'roles'},R.map(([r,can,cant])=>el('div',{class:'rolecard'},roleTag(r),
      el('ul',{},can.map(t=>el('li',{},svg(ok),el('span',{text:t}))),cant?el('li',{class:'no'},svg(no),el('span',{text:cant})):null)))),
    el('p',{class:'muted small',style:'margin:0',text:'Чат і свій профіль доступні всім.'}));
}
const EARNERS=['cleaner','gardener','master'];
function earns(s){if(S.asRole&&s&&realDev()&&s===myStaff())return EARNERS.includes(S.asRole);return !!s&&(EARNERS.includes(s.role)||EARNERS.includes(s.extraRole));}
function sumDucks(sid){if(!earns(staffById(sid)))return 0;return S.tasks.filter(t=>asg(t).includes(sid)&&t.rating).reduce((a,t)=>a+t.rating,0);}
function normPhone(v){v=(v||'').trim();if(!v)return'';const plus=v.startsWith('+');const d=v.replace(/\D/g,'');if(d.length<9||d.length>15)return'';return (plus?'+':'')+d;}
function fmtPhone(p){const m=p.match(/^\+?380(\d{2})(\d{3})(\d{2})(\d{2})$/);return m?'+380 '+m[1]+' '+m[2]+' '+m[3]+' '+m[4]:p;}
function normTg(v){v=(v||'').trim().replace(/^https?:\/\/(t\.me|telegram\.me)\//i,'').replace(/^@/,'');return /^[A-Za-z0-9_]{5,32}$/.test(v)?v:'';}
function tgIcon(){return svg('<path d="M21.5 4.5 2.8 11.7c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.5c.2.7 1.1.9 1.6.4l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6l3.1-15.2c.2-.9-.7-1.6-1.5-1.2z"/><path d="m7.5 15 10-7.5"/>');}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Скопійовано');}catch(e){toast('Виділіть номер і скопіюйте вручну');}}
function contactsBlock(s){
  const c=el('div',{class:'stack',style:'gap:10px'});
  if(s.phone)c.append(el('div',{class:'contact'},svg('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>'),
    el('span',{class:'cval',text:fmtPhone(s.phone)}),
    el('a',{class:'btn sm',href:'tel:'+s.phone,target:'_blank',rel:'noopener',onclick:()=>{try{navigator.clipboard.writeText(s.phone).catch(()=>{});}catch(e){}setTimeout(()=>toast('Якщо дзвінок не почався: номер уже скопійовано, вставте його в «Телефон»'),400);}},'Подзвонити')));
  if(s.telegram)c.append(el('div',{class:'contact'},tgIcon(),el('span',{class:'cval',text:'@'+s.telegram}),
    el('a',{class:'btn sm tg',href:'https://t.me/'+s.telegram,target:'_blank',rel:'noopener'},'Відкрити')));
  if(s.email)c.append(el('div',{class:'contact'},svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),el('span',{class:'cval',text:s.email})));
  if(!c.children.length)c.append(el('p',{class:'muted',style:'margin:0',text:'Контакти ще не додані.'}));
  return c;
}
function openPerson(sid){const me=myStaff();if(me&&me.id===sid){go('profile');return;}
  S.hist.push(snap());S.viewSid=sid;S.tab='person';SC().scrollTop=0;render();animIn(1);}
function copyTxt(v,msg){try{navigator.clipboard.writeText(v).then(()=>toast(msg||'Скопійовано'),()=>toast(v));}catch(e){toast(v);}}
function pfDM(s){const m=myStaff();if(!m){toast('Спершу підтвердіть своє ім’я на вкладці «Сьогодні»');return;}go('chat');openRoom(dmId(m.id,s.id));}
function viewPerson(){
  const s=staffById(S.viewSid);
  if(!s)return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Працівника не знайдено.'}))];
  const me=myStaff();const isMe=!!(me&&me.id===s.id);
  const done=S.tasks.filter(t=>asg(t).includes(s.id)&&partDone(t,s.id)).length;const openT=S.tasks.filter(t=>myOpen(t,s)).sort(byDue);const a=avgRating(s.id);
  const I={msg:'<path d="M4 5h16v11H9l-5 4z"/>',call:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'};
  const act=(ic,lbl,fn,cls,href)=>{const o={class:'pf-act'+(cls?' '+cls:''),type:'button'};if(href){o.href=href;o.target='_blank';o.rel='noopener';delete o.type;}else o.onclick=fn;return el(href?'a':'button',o,el('span',{class:'pf-ai'},typeof ic==='string'?svg(ic):ic),el('span',{class:'pf-al',text:lbl}));};
  const acts=[];
  if(!isMe&&s.userId!==undefined)acts.push(act(I.msg,'Написати',()=>pfDM(s),'pri'));
  if(s.phone)acts.push(act(I.call,'Дзвінок',()=>{copyTxt(s.phone,'Номер скопійовано');},null,'tel:'+s.phone));
  if(s.telegram)acts.push(act(tgIcon(),'Telegram',null,'tg','https://t.me/'+s.telegram));
  if(s.email)acts.push(act(I.mail,'Пошта',null,null,'mailto:'+s.email));
  if(canAdmin())acts.push(act(I.edit,'Редагувати',()=>editPerson(s)));
  const online=s.userId&&isOnline(s.id);
  const hero=el('div',{class:'card pf-hero'},el('div',{class:'pf-cover'}),
    el('div',{class:'pf-av'},avatarP(s,'big')),el('h2',{class:'pf-name',text:s.name}),roleTags(s),
    el('span',{class:'pf-seen '+(online?'online':'muted'),text:s.userId?seenText(s.id):'ще не підтверджений'}),
    acts.length?el('div',{class:'pf-acts',style:'--n:'+acts.length},acts):null);
  const st=[[String(done),'виконано'],[String(openT.length),'відкритих']];if(earns(s)){st.push([a?a.avg.toFixed(1):'—','оцінка']);st.push([String(sumDucks(s.id)),'каченят',true]);}
  const stats=el('div',{class:'card pf-stats'},st.map(([v,l,d])=>el('div',{class:'pf-st'},el('b',{},d?duck():null,v),el('span',{text:l}))));
  const row=(ic,lbl,val,fn,btn)=>el('div',{class:'pf-row'},el('span',{class:'pf-ri'},typeof ic==='string'?svg(ic):ic),el('button',{type:'button',class:'pf-rt',onclick:()=>copyTxt(val.replace(/^@/,''),lbl+' скопійовано'),title:'Натисніть, щоб скопіювати'},el('b',{text:val}),el('small',{text:lbl})),btn||null);
  const rows=[];
  if(s.phone)rows.push(row(I.call,'Телефон',fmtPhone(s.phone),null,el('a',{class:'btn sm',href:'tel:'+s.phone,target:'_blank',rel:'noopener'},'Подзвонити')));
  if(s.telegram)rows.push(row(tgIcon(),'Telegram','@'+s.telegram,null,el('a',{class:'btn sm tg',href:'https://t.me/'+s.telegram,target:'_blank',rel:'noopener'},'Відкрити')));
  if(s.email)rows.push(row(I.mail,'Пошта',s.email,null,el('a',{class:'btn ghost sm',href:'mailto:'+s.email,target:'_blank',rel:'noopener'},'Написати')));
  const contacts=el('div',{class:'card pf-card'},el('div',{class:'pf-ch'},el('b',{text:'Контакти'}),rows.length?el('span',{class:'muted small',text:'натисніть, щоб скопіювати'}):null),
    rows.length?el('div',{class:'pf-list'},rows):el('p',{class:'muted',style:'margin:0',text:'Контакти ще не додані.'}),
    !isMe?el('button',{class:'btn pf-dm',type:'button',onclick:()=>pfDM(s)},svg(I.msg),' Надіслати повідомлення'):null);
  const left=[hero,stats,contacts];const right=[];
  if(S.week&&isThisWeek()&&s.inSchedule!==false)right.push(el('div',{class:'card pf-card'},el('div',{class:'pf-ch'},el('b',{text:'Зміни цього тижня'}),el('span',{class:'muted small',text:dm(S.weekStart)+' – '+dm(addDays(S.weekStart,6))})),weekStrip(s.id)));
  if(pmCan()||isMe){const pc=pmPersonCard(s.id,'Планове ТО');if(pc)right.push(pc);}
  right.push(el('div',{class:'card pf-card'},el('div',{class:'pf-ch'},el('b',{text:'Відкриті задачі'}),el('span',{class:'pf-cnt',text:String(openT.length)})),
    openT.length?el('div',{class:'stack',style:'gap:6px'},openT.map(taskRow)):el('p',{class:'muted',style:'margin:0',text:'Відкритих задач немає.'})));
  return [el('div',{class:'pf-grid'},el('div',{class:'pf-col'},left),el('div',{class:'pf-col'},right))];
}
