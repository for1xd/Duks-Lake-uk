// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: patch notes

/* ---------- patch notes ---------- */
/* Що нового — лише великі зміни, кожна для тих, кому вона доступна.
   who: без поля — усім; 'uk' — Facility (менеджери, ст. менеджер, інженер, директор, Dev); 'meet' — директор, менеджер, Dev;
   'dev' — лише Dev; 'plan' — хто планує графік і ставить задачі; 'earn' — хто відмічає зміни */
const NOTES=[
 {v:'5.1',date:'7 листопада',title:'Обхід будівель',items:[
  {e:'📸',t:'Щоденний фотозвіт',d:'Facility → Обхід будівель: фото насосної, ВРП і пожежного поста по кожній закріпленій будівлі. Працює й без зв’язку — звіт відправиться сам.',who:'uk'},
  {e:'✅',t:'Перевірка й Word-звіти',d:'Матриця покриття, погодження або повернення звіту, задача із зауваження. Тижневий і місячний звіт — у Word.',who:'uk'}]},
 {v:'5.0',date:'3 листопада',title:'Покер: розділ 2 батл пасу',items:[
  {e:'❄',t:'Розділ 2 «Крижаний ставок»',d:'Ще 30 рівнів (31–60) з новими сорочками, сукнами, рамками й титулами. Сезон продовжено до 31 грудня, а після 60 рівня падають бонусні скрині.'},
  {e:'⚖',t:'Чесніший прогрес',d:'Рівні дорожчають з кожним десятком, XP за роздачі має денний ліміт, а гра лише з ботами дає половину. Уже відкриті рівні й нагороди лишаються вашими.'},
  {e:'🎯',t:'Нові завдання',d:'Щодня легке, середнє й складне завдання плюс бонус за всі три. Щотижня 3 випробування, однакові для всіх.'}]},
 {v:'4.9',date:'30 жовтня',title:'Планове технічне обслуговування',items:[
  {e:'🛠',t:'Планове ТО',d:'Новий розділ у Facility: двері, ліфти, кондиціонування, енергетика, вода, вентиляція, пожежна безпека, СКД, техніка УК та інше. Дата, місце, відповідальний, організація й результат кожного ТО.',who:'uk'},
  {e:'🔔',t:'Нагадування',d:'Призначте дату наступного ТО — застосунок нагадає за 10, 5, 3 дні та в день обслуговування, у застосунку й на пошту.',who:'uk'},
  {e:'📄',t:'Звіт по ТО',d:'PDF для керівництва за місяць, квартал, рік або свій період. ТО також додано у звіт «Нарада з інвестором».',who:'uk'},
  {e:'👤',t:'ТО у профілі',d:'Кожен бачить у профілі та «Моїх задачах», які ТО за ним заплановані і коли.'}]},
 {v:'4.8',date:'30 жовтня',title:'Покер для всіх',items:[
  {e:'♠',t:'Duck’s Poker відкрито',d:'Розваги → Покер: техаський холдем з колегами або ботами, щоденний бонус 1000 🪙, батл пас і скіни. Гра лише на ігрову валюту.'}]},
 {v:'4.7',date:'30 жовтня',title:'Вода: показники з фото й Excel для бухгалтерії',items:[
  {e:'📷',t:'Внести з фото',d:'Оберіть фото лічильників після обходу — застосунок сам прочитає номери й показники, ви лише перевіряєте й зберігаєте.',who:'uk'},
  {e:'🧾',t:'Excel для бухгалтерії',d:'Таблиця у вашому звичному форматі: аркуш на кожен будинок, формули, підсумок і рахунок Водоканалу.',who:'uk'}]},
 {v:'4.6',date:'28 жовтня',title:'Нові блоки екстрених ситуацій',items:[
  {e:'🧯',t:'Ще 4 блоки',d:'Вентиляція, пожежна безпека, контроль доступу (СКД) та інші ситуації.',who:'uk'}]},
 {v:'4.5',date:'28 жовтня',title:'Вибір оформлення',items:[
  {e:'🎨',t:'Оберіть свій вигляд',d:'При першому вході застосунок запропонує стиль і святкову тему. Змінити можна в профілі → Оформлення.'},
  {e:'🔊',t:'Звуки в покері',d:'Роздача карт, ставки, виграш і ваш хід — тепер чути. Вимикається кнопкою біля рахунку.'}]},
 {v:'4.4',date:'28 жовтня',title:'Покер: боти й батл пас',items:[
  {e:'🤖',t:'Боти за столом',d:'Немає кого покликати — додайте ботів. Вони не бачать ваших карт і помиляються, тож їх можна обіграти.'},
  {e:'🏆',t:'Батл пас',d:'30 рівнів: монети, скрині, сорочки карт, сукно, рамки й титули. Щоденні завдання дають XP.'}]},
 {v:'4.3',date:'28 жовтня',title:'Новий спокійний дизайн',items:[
  {e:'✨',t:'Стиль «Мінімал»',d:'Чистий вигляд без зайвих градієнтів і тіней, системний шрифт, рівні картки. Попередній стиль — у профілі → Оформлення.'}]},
 {v:'4.2',date:'28 жовтня',title:'Покер і перегляд як роль',items:[
  {e:'♠',t:'Покер онлайн',d:'Техаський холдем з колегами на качкоїни, щоденний бонус 1000 🪙.'},
  {e:'👁',t:'Перегляд як роль',d:'Dev-панель: подивіться застосунок очима клінера, менеджера чи директора.',who:'dev'},
  {e:'🧩',t:'Скласти звіт самостійно',d:'Вибирайте, які обліки й блоки потраплять у PDF для наради, додавайте назву й коментар.',who:'meet'}]},
 {v:'4.1',date:'28 жовтня',title:'Нарада з інвестором',items:[
  {e:'📊',t:'Дашборд за місяць',d:'Дашборд обліку й екстрених ситуацій за місяць із розписом усіх подій.',who:'meet'},
  {e:'📄',t:'Звіт у PDF',d:'Одна кнопка — і готовий звіт у стилі Duck’s Lake для наради.',who:'meet'}]},
 {v:'4.0',date:'28 жовтня',title:'Екстрені ситуації',items:[
  {e:'🚨',t:'Аварії й поломки в одному місці',d:'Ліфти, кондиціонування, вікна, двері, дахи, електрика, енергетика, вода — фіксуйте з фото й ведіть до вирішення.',who:'uk'},
  {e:'👥',t:'«Колектив» замість «Команда»',d:'Розділ і назви по всьому застосунку тепер звучать так.'}]},
 {v:'3.9',date:'28 жовтня',title:'Дві зміни на день',items:[
  {e:'⏱',t:'Відмітка на кожну зміну',d:'Якщо у вас дві зміни — відмічайтеся на кожну, години сумуються автоматично.',who:'earn'},
  {e:'✅',t:'Завершення задачі за всіх',d:'Dev може закрити задачу за всіх виконавців і одразу поставити оцінку.',who:'dev'},
  {e:'🛠',t:'Dev-панель',d:'Журнал дій, помилки, стан бази й експорт у Facility відділі.',who:'dev'}]},
 {v:'3.5',date:'27 жовтня',title:'Facility відділ і облік',items:[
  {e:'🏢',t:'Facility відділ',d:'Облік, архітектура, документи УК, клінінг і резиденти в одному місці.',who:'uk'},
  {e:'📈',t:'Облік з дашбордами',d:'Вода, сміття, дебіторка, паркінг 2D/3D та інвентар. Кнопка «Оновити» підтягує дані з Excel.',who:'uk'}]},
 {v:'3.0',date:'27 жовтня',title:'Новий вигляд',items:[
  {e:'📅',t:'Новий графік',d:'Тиждень і день читаються з першого погляду — на ПК і на телефоні.'},
  {e:'👤',t:'Нові профілі',d:'Кнопка «Написати» відкриває особистий чат з колегою.'},
  {e:'🗂',t:'Задачі по днях',d:'Задачі згруповані за днями з назвою дня тижня, прострочені — зверху.'},
  {e:'🎩',t:'Строгий стиль',d:'Спокійніше оформлення; святкову тему можна змінити в профілі.'}]},
 {v:'1.9',date:'27 жовтня',title:'Чати',items:[
  {e:'💬',t:'Особисті та групові чати',d:'Основний чат, групи й особисті повідомлення, видно хто в мережі.'},
  {e:'📎',t:'Файли в чаті',d:'Фото, відео й документи прямо в повідомленні.'}]},
 {v:'1.6',date:'27 жовтня',title:'Розваги',items:[
  {e:'🎮',t:'Ігри з рейтингом',d:'«Політ каченяти» і «Каченя-серфер» — рекорди й хробачки в спільному рейтингу.'}]},
 {v:'1.4',date:'26 жовтня',title:'Зміни з фото',items:[
  {e:'📸',t:'Початок і кінець зміни з фото',d:'Відмітка з об’єкта — години рахуються самі.',who:'earn'},
  {e:'🧭',t:'Нове меню',d:'Профіль зверху, розділи згруповані.'}]}
];
function noteFor(it){const w=it.who;if(!w)return true;if(w==='uk')return isUK();if(w==='meet')return canMeet();if(w==='dev')return isDev();if(w==='plan')return canPlan();if(w==='earn')return earns(myStaff())||isDev();return false;}
function myNotes(){return NOTES.map(r=>{const items=r.items.filter(noteFor);return {...r,items,title:items.length&&items.length<r.items.length&&!noteFor(r.items[0])?items[0].t:r.title};}).filter(r=>r.items.length);}
function notesTop(){return myNotes()[0]||NOTES[NOTES.length-1];}
function notesSeen(){try{return localStorage.getItem('dl.notes')||'';}catch(e){return '';}}
function notesNew(){const t=notesTop();const s=notesSeen();if(!s)return true;return parseFloat(t.v)>parseFloat(s);}
function notesChip(cls){const n=notesNew();const t=notesTop();return el('button',{type:'button',class:'notes-chip '+cls+(n?' new':''),onclick:()=>{closeMenu();openNotes();}},
  el('span',{class:'nc-ic',text:'✨'}),el('span',{class:'nc-t'},el('b',{text:'Що нового'}),el('small',{text:t.title+' · '+t.date})),n?el('span',{class:'nc-dot','aria-label':'нове'}):svg('<path d="m9 6 6 6-6 6"/>'));}
function openNotes(){const L=myNotes();const seen=notesSeen();try{localStorage.setItem('dl.notes',NOTES[0].v);}catch(e){}
  const top=L[0];const rest=L.slice(1);
  const item=(it,big,title)=>el('li',{class:'nw-i'+(big?' big':'')},el('span',{class:'nw-e',text:it.e}),el('span',{class:'nw-tx'},it.t===title?null:el('b',{text:it.t}),el('small',{text:it.d})));
  const fresh=r=>!!seen&&parseFloat(r.v)>parseFloat(seen);
  openSheet(el('div',{class:'notes-head'},el('span',{class:'nh-ic',text:'✨'}),el('div',{},el('h2',{style:'margin:0',text:'Що нового'}),el('span',{class:'muted small',text:'Головні оновлення Duck’s Lake для вас'}))),
    top?el('section',{class:'nw-hero'},el('div',{class:'nw-hh'},el('span',{class:'nw-tag',text:!seen||fresh(top)?'Нове':'Останнє'}),el('span',{class:'nw-date',text:top.date})),
      el('h3',{text:top.title}),el('ul',{class:'nw-l'},top.items.map(it=>item(it,true,top.title)))):null,
    rest.length?el('div',{class:'nw-past'},el('span',{class:'nw-lbl',text:'Раніше'}),rest.map(r=>el('details',{class:'nw-r'+(fresh(r)?' fresh':'')},
      el('summary',{},el('span',{class:'nw-rt'},el('b',{text:r.title}),el('small',{text:r.date+' · '+r.items.length+' '+plural(r.items.length,'новинка','новинки','новинок')})),fresh(r)?el('span',{class:'nw-dot'}):null,svg('<path d="m9 6 6 6-6 6"/>')),
      el('ul',{class:'nw-l'},r.items.map(it=>item(it,false,r.title))))) ):null,
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));
  renderTabs();}
function navBtn(t,short){const b=badgeFor(t.id);return el('button',{type:'button',class:'nb','aria-current':isCur(t.id)?'page':null,onclick:()=>go(t.id)},
    svg(t.icon),el('span',{class:'row tl',style:'gap:4px'},el('span',{class:'lbl',text:short&&t.short?t.short:tabName(t)}),t.id==='map'?el('span',{class:'devtag',text:'DEV'}):null,b?el('span',{class:'badge',text:b,title:t.id==='uk'?ukAlerts().map(a=>a.g.name+': '+a.t).join('\n'):null}):null));}
function meCard(cls,onclick){const m=myStaff();if(!S.me)return null;
  const img=m?avatar(m):el('img',{src:S.me.avatarUrl,alt:''});
  return el('button',{type:'button',class:cls,'aria-current':S.tab==='profile'?'page':null,'aria-label':'Мій профіль',onclick},img,
    el('span',{class:'t'},el('b',{text:m?m.name:(S.me.name||'Гість')}),el('small',{text:m?(ROLE_NAME[m.role]||'Без ролі')+(m.extraRole&&m.extraRole!==m.role?' · '+ROLE_NAME[m.extraRole]:''):(S.isOwner?'Власник':'Не прив’язано')})),
    svg('<path d="m9 6 6 6-6 6"/>'));}
function renderTabs(){updBar();
  const wide=WIDE.matches;const box=document.getElementById('tabs');const T=id=>TABS.find(t=>t.id===id);
  if(wide){
    const kids=[el('div',{class:'side-head'},svg('<path d="M5 5l14 14M19 3v16M3 19h16"/>'),el('span',{text:'DUCK’S LAKE'}),el('span',{class:'beta',text:'beta'})),
      meCard('side-me',()=>go('profile')),notesChip('nc-side')];
    for(const [lbl,ids] of NAV_GROUPS){const v=ids.filter(tabVisible);if(!v.length)continue;kids.push(el('div',{class:'side-lbl',text:lbl}),...v.map(id=>navBtn(T(id))));}
    const dark=isDarkNow();
    kids.push(el('div',{class:'side-foot'},el('button',{type:'button',class:'side-theme',onclick:toggleTheme},svg(dark?I_SUN:I_MOON),el('span',{text:dark?'Світла тема':'Темна тема'}))));
    box.style.gridTemplateColumns='';box.replaceChildren(...kids.filter(Boolean));
  }else{
    box.style.gridTemplateColumns='repeat('+BAR.length+',minmax(0,1fr))';
    box.replaceChildren(...BAR.map(id=>navBtn(T(id),true)));}
  const mb=document.getElementById('menuBtn');const tot=TABS.filter(t=>!BAR.includes(t.id)&&tabVisible(t.id)).reduce((a,t)=>a+badgeFor(t.id),0);
  mb.replaceChildren(...[svg(MENU_ICON),tot?el('span',{class:'badge',text:tot}):(notesNew()?el('span',{class:'nc-dot mb'}):null)].filter(Boolean));mb.onclick=openMenu;
  requestAnimationFrame(placeInd);setTimeout(placeInd,420);
}
function openMenu(){
  const bg=el('div',{class:'menu-bg',onclick:closeMenu});const T=id=>TABS.find(t=>t.id===id);
  const kids=[meCard('menu-me',()=>go('profile')),notesChip('nc-menu')];
  for(const [lbl,ids] of NAV_GROUPS){const v=ids.filter(tabVisible);if(!v.length)continue;
    kids.push(el('div',{class:'menu-lbl',text:lbl}),...v.map(id=>{const t=T(id);const b=badgeFor(id);return el('button',{type:'button',role:'menuitem','aria-current':isCur(id)?'page':null,onclick:()=>go(id)},svg(t.icon),el('span',{class:'grow',text:tabName(t)}),id==='map'?el('span',{class:'devtag',text:'DEV'}):null,b?el('span',{class:'badge',text:b}):null);}));}
  if(isDev())kids.push(el('div',{class:'menu-lbl',text:'Тест'}),v2Btn());
  const m=el('div',{class:'menu',role:'menu'},kids.filter(Boolean));
  document.getElementById('menuRoot').replaceChildren(bg,m);document.getElementById('menuBtn').setAttribute('aria-expanded','true');
  document.addEventListener('keydown',menuEsc);m.querySelector('button').focus();
}
function menuEsc(e){if(e.key==='Escape')closeMenu();}
function closeMenu(){document.getElementById('menuRoot').replaceChildren();const mb=document.getElementById('menuBtn');if(mb)mb.setAttribute('aria-expanded','false');document.removeEventListener('keydown',menuEsc);}
const I_SUN='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const I_MOON='<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>';
const I_SUP='<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>';
function isDarkNow(){const t=document.documentElement.getAttribute('data-theme');if(t)return t==='dark';return window.matchMedia('(prefers-color-scheme: dark)').matches;}
function applyTheme(){let t=null;try{t=localStorage.getItem('dl.theme');}catch(e){}if(t)document.documentElement.setAttribute('data-theme',t);applyV2();}
function v2On(){try{return localStorage.getItem('dl.v2')==='1';}catch(e){return false;}}
function applyV2(){document.documentElement.classList.toggle('v2',v2On());}
function toggleV2(){const on=!v2On();try{localStorage.setItem('dl.v2',on?'1':'0');}catch(e){}applyV2();closeMenu();render();requestAnimationFrame(placeInd);toast(on?'Новий дизайн увімкнено — бачите лише ви':'Повернуто поточний дизайн');}
function v2Btn(){return el('button',{type:'button',role:'menuitem',onclick:toggleV2},svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>'),el('span',{class:'grow',text:v2On()?'Повернути поточний дизайн':'Новий дизайн (тест)'}));}
function toggleTheme(){const nt=isDarkNow()?'light':'dark';document.documentElement.setAttribute('data-theme',nt);try{localStorage.setItem('dl.theme',nt);}catch(e){}renderHeaderBtns();if(WIDE.matches)renderTabs();requestAnimationFrame(placeInd);}
function renderHeaderBtns(){const tb=document.getElementById('themeBtn');const dark=isDarkNow();tb.replaceChildren(svg(dark?I_SUN:I_MOON));tb.setAttribute('aria-label',dark?'Світла тема':'Темна тема');tb.title=dark?'Світла тема':'Темна тема';tb.onclick=toggleTheme;
  const sb=document.getElementById('supBtn');const n=S.db?tkBadge():0;sb.replaceChildren(...[svg(I_SUP),n?el('span',{class:'badge',text:String(n)}):null].filter(Boolean));sb.title=isDev()?'Запити підтримки':'Підтримка';sb.onclick=()=>go('support');sb.classList.toggle('on',S.tab==='support'||S.tab==='ticket');}
function renderMe(){renderHeaderBtns();
  const chip=document.getElementById('meChip');const m=myStaff();
  if(!S.me){chip.hidden=true;return;}
  chip.hidden=false;
  chip.onclick=()=>go('profile');
  chip.setAttribute('aria-label','Мій профіль');
  chip.replaceChildren(el('img',{src:(m&&m.photo)||S.me.avatarUrl,alt:'',style:'object-fit:cover'}),el('span',{class:'t'},el('b',{text:m?m.name:(S.me.name||'Гість')}),el('small',{text:m?(ROLE_NAME[m.role]||'Без ролі')+(m.extraRole&&m.extraRole!==m.role?' · '+ROLE_NAME[m.extraRole]:''):(S.isOwner?'Власник':'Не прив’язано')})));
}
