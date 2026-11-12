// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: core-state-helpers

/* home-indicator / gesture-bar room: the app runs inside a frame where env(safe-area) is often 0 */
(function(){const ua=navigator.userAgent||'';const ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);const android=/Android/.test(ua);
  const tall=Math.max(screen.width,screen.height)/Math.min(screen.width,screen.height)>1.9;
  const v=ios?(tall?22:10):(android?14:0);document.documentElement.style.setProperty('--sab-min',v+'px');document.documentElement.classList.toggle('is-ios',ios);document.documentElement.classList.toggle('is-android',android);})();
/* (function(){ — початок обгортки застосунку */
const ROLES=[
  {id:'cleaner',name:'Клінер'},
  {id:'gardener',name:'Садівник'},
  {id:'master',name:'Майстер'},
  {id:'manager',name:'Менеджер'},
  {id:'senior',name:'Старший менеджер'},
  {id:'engineer',name:'Головний інженер'},
  {id:'director',name:'Директор'},
  {id:'ceo',name:'CEO Asgard'},
  {id:'dev',name:'Dev'}
];
const ROLE_NAME=Object.fromEntries(ROLES.map(r=>[r.id,r.name]));
const PLANNERS=['manager','director','dev'];   // can edit schedule and assign tasks
const ADMINS=['director','dev'];                          // can manage team and roles
const DAYS=['понеділок','вівторок','середа','четвер','п’ятниця','субота','неділя'];
const DS=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
const AV_COLORS=['#1F6F78','#C98A2B','#3E7CB1','#8A5A9E','#2E8B5E','#C2563E','#5B6B2E','#2F4B8A'];
const TABS=[
  {id:'profile',name:'Мій профіль',icon:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'},
  {id:'today',name:'Сьогодні',icon:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>'},
  {id:'shift',name:'Моя зміна',short:'Зміна',icon:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>'},
  {id:'schedule',name:'Графік',icon:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>'},
  {id:'tasks',name:'Задачі',icon:'<path d="m4 12 4 4 12-12"/><path d="M4 20h16"/>'},
  {id:'map',name:'Карта',icon:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'},
  {id:'chat',name:'Чат',icon:'<path d="M4 5h16v11H9l-5 4z"/>'},
  {id:'team',name:'Колектив',icon:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.4 3.5 5.2"/>'},
  {id:'uk',name:'Facility відділ',icon:'<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-5h6v5"/><path d="M9 11h.01M15 11h.01"/>'},
  {id:'sos',name:'Екстрені ситуації',icon:'<path d="M12 3 2.5 20h19z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".9" fill="currentColor"/>'},
  {id:'pm',name:'Планове ТО',icon:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="m9 15 2 2 4-4"/>'},
  {id:'meet',name:'Нарада з інвестором',short:'Нарада',icon:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/><path d="m7 12 3-3 2 2 4-4"/>'},
  {id:'fun',name:'Розваги',icon:'<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="17.5" cy="13.8" r="1" fill="currentColor"/>'},
  {id:'support',name:'Підтримка',icon:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>'}
];
const IS_TOUCH=window.matchMedia('(pointer:coarse)').matches;
const BAR=['today','schedule','tasks','map','chat'];
const NAV_GROUPS=[['Робота',['today','shift','schedule','tasks','map']],['Facility',['uk','meet','sos','pm']],['Спілкування',['chat','team','fun']],['Допомога',['support']]];
function updBar(){const arr=earns(myStaff())?['today','shift','schedule','tasks','chat']:['today','schedule','tasks','chat'];if(isDev())arr.splice(arr.length-1,0,'map');if(arr.length>5)arr.splice(arr.indexOf('schedule'),1);BAR.splice(0,BAR.length,...arr);}
function isUK(){return hasAny(['manager','senior','engineer','director','ceo','dev']);}
function tabVisible(id){if(id==='map')return isDev();if(id==='shift')return !!myStaff();if(id==='pm')return pmCan();if(id==='uk')return isUK()||inspIsWalker();if(id==='sos')return isUK();if(id==='meet')return canMeet();return true;}
function tabName(t){return t.id==='shift'?(earns(myStaff())?'Моя зміна':'Зміни колективу'):t.name;}
function isCur(id){return S.tab===id||(S.tab==='person'&&id==='team')||(S.tab==='ticket'&&id==='support');}
const WIDE=window.matchMedia('(min-width:900px)');
const WIDE2=window.matchMedia('(min-width:1200px)');
WIDE2.addEventListener&&WIDE2.addEventListener('change',()=>render());
WIDE.addEventListener&&WIDE.addEventListener('change',()=>render());
const MENU_ICON='<path d="M4 7h16M4 12h16M4 17h16"/>';

const S={asRole:(()=>{try{return sessionStorage.getItem('dl.as')||null;}catch(e){return null;}})(),pkT:[],wal:{},pkTab:null,pkRaise:null,pkBusy:false,mtPer:null,mtTab:'sum',sos:[],sosCat:'',sosF:'open',log:[],inv:{},invCat:'all',invOwn:'',invKind:'',invQ:'',resTab:'cons',pk:{},pkMode:'ten',pkQ:'',pkHl:'',pkBld:'',pk3d:false,pkZoom:1,pkSel:null,ws:{},wsPer:null,wsQ:'',dz:{},dzSnap:{},dzPer:null,dzCat:'all',dzBld:'',dzQ:'',dzOnly:true,wObj:[],wMet:[],wPerD:{},wPer:null,wObjSel:null,wQ:'',rooms:{},readsR:{},room:null,games:[],shifts:[],db:null,user:null,myId:null,me:null,isOwner:false,staff:[],tasks:[],chat:[],reads:{},pres:{},hist:[],tickets:[],tkFilter:'open',readSent:0,chatStick:true,pendingPic:null,requests:[],profiles:{},week:null,weekExists:false,
  weekStart:mondayOf(new Date()),day:todayIdx(),tab:'today',schedView:'day',taskFilter:'mine',loaded:{staff:false,tasks:false}};
let unWeek=null;

function el(tag,attrs,...kids){const e=document.createElement(tag);
  if(attrs)for(const k in attrs){const v=attrs[k];if(v==null||v===false)continue;
    if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':v);}
  for(const c of kids.flat()){if(c==null||c===false)continue;e.append(c.nodeType?c:document.createTextNode(String(c)));}
  return e;}
function svg(inner){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');s.setAttribute('aria-hidden','true');s.innerHTML=inner;return s;}
function toast(msg){const r=document.getElementById('toastRoot');r.replaceChildren(el('div',{class:'toast',role:'status',text:msg}));clearTimeout(toast.t);toast.t=setTimeout(()=>r.replaceChildren(),msg.length>60?5200:2600);}

function pad(n){return String(n).padStart(2,'0');}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function parseYmd(s){const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c);}
function mondayOf(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());const k=(x.getDay()+6)%7;x.setDate(x.getDate()-k);return ymd(x);}
function todayIdx(){return (new Date().getDay()+6)%7;}
function addDays(s,n){const d=parseYmd(s);d.setDate(d.getDate()+n);return ymd(d);}
function dm(s){const d=parseYmd(s);return pad(d.getDate())+'.'+pad(d.getMonth()+1);}
function isThisWeek(){return S.weekStart===mondayOf(new Date());}

function shiftParts(v){if(!v)return[];if(v==='Д')return['Д'];return v.split('|').filter(Boolean);}
function isWorking(v){return !!v&&v!=='Д';}
function shiftPills(v,cls){const parts=shiftParts(v);if(!parts.length)return[el('span',{class:'off',text:'вихідний'})];
  return parts.map(p=>p==='Д'?el('span',{class:'pill mg',title:'Зміна менеджера',text:'8:30–17:30'}):el('span',{class:'pill '+(parseInt(p,10)<12?'am':'pm'),text:p}));}
function trimT(t){return t.replace(/:00(?=$|–)/g,'');}
function miniShift(p){if(p==='Д')return el('span',{class:'ms mg'},el('span',{text:'8:30'}),el('span',{text:'17:30'}));
  const [a,b]=p.split('–');return el('span',{class:'ms '+(parseInt(a,10)<12?'am':'pm')},el('span',{text:trimT(a||'')}),el('span',{text:trimT(b||'')}));}
function normShift(txt){txt=(txt||'').trim();if(!txt)return'';if(/^[дД]$/.test(txt))return'Д';
  return txt.split(/[,;+\n]+/).map(s=>s.trim().replace(/\s*[-—–]\s*/g,'–').replace(/\./g,':')).filter(Boolean).map(s=>s.replace(/^(\d{1,2})–/,'$1:00–').replace(/–(\d{1,2})$/,'–$1:00')).join('|');}

function sortedStaff(){return [...S.staff].sort((a,b)=>(a.order??999)-(b.order??999)||a.name.localeCompare(b.name,'uk'));}
function schedStaff(){return sortedStaff().filter(s=>s.inSchedule!==false);}
function staffById(id){return S.staff.find(s=>s.id===id);}
function dlLogo(cls,label){const t=document.createElement('template');t.innerHTML=dlLogoHTML({cls,label});return t.content.firstChild;}
function myStaff(){return S.myId?S.staff.find(s=>s.userId===S.myId):null;}
function myRole(){const m=myStaff();return m?m.role:null;}
function myRolesReal(){const m=myStaff();return m?[m.role,m.extraRole].filter(Boolean):null;}
function realDev(){const r=myRolesReal();return r?r.includes('dev'):S.isOwner;}
function myRoles(){if(S.asRole&&realDev())return [S.asRole];return myRolesReal();}
function setAsRole(r){S.asRole=r||null;try{r?sessionStorage.setItem('dl.as',r):sessionStorage.removeItem('dl.as');}catch(e){}if(r&&!tabVisible(S.tab))S.tab='today';S.fg=null;S.ukSec=null;render();toast(r?'Перегляд як «'+ROLE_NAME[r]+'»':'Повернулися до своєї ролі');}
function asBar(){let b=document.getElementById('asBar');if(!S.asRole||!realDev()){if(b)b.remove();return;}if(!b){b=el('div',{id:'asBar',role:'status'});document.body.append(b);}
  const ap=typeof inspAsPerson==='function'?inspAsPerson():null;b.replaceChildren(el('span',{text:'👁 Перегляд як: '+ROLE_NAME[S.asRole]+(ap?' ('+ap.name+')':'')}),el('button',{type:'button',onclick:()=>setAsRole(null)},'Вийти'));}
function hasAny(list){const r=myRoles();return r?r.some(x=>list.includes(x)):S.isOwner;}
function canPlan(){return hasAny(PLANNERS);}
const TASKERS=['manager','senior','engineer','director','dev'];
function canTask(){return hasAny(TASKERS);}
function canAdmin(){return hasAny(ADMINS);}
function avatar(s,cls){if(s.photo)return el('img',{class:'av ph'+(cls?' '+cls:''),src:s.photo,alt:''});const i=S.staff.findIndex(x=>x.id===s.id);return el('span',{class:'av'+(cls?' '+cls:''),'aria-hidden':'true',style:'background:'+(s.color||AV_COLORS[(i<0?0:i)%AV_COLORS.length]),text:(s.name||'?').trim().charAt(0).toUpperCase()});}
function beat(off){const m=myStaff();if(!m||!S.db)return;S.db.doc('presence/'+m.id).set({at:Date.now(),off:!!off}).catch(()=>{});}
function isOnline(sid){const me=myStaff();if(me&&me.id===sid&&document.visibilityState==='visible')return true;const p=S.pres[sid];return !!(p&&!p.off&&Date.now()-p.at<150000);}
function seenText(sid){if(isOnline(sid))return 'у мережі';const p=S.pres[sid];if(!p||!p.at)return 'ще не заходив(-ла)';
  const d=new Date(p.at);const mins=Math.round((Date.now()-p.at)/60000);
  if(mins<1)return 'щойно був(-ла) в мережі';if(mins<60)return 'в мережі '+mins+' хв тому';
  const t=pad(d.getHours())+':'+pad(d.getMinutes());const day=ymd(d);
  if(day===ymd(new Date()))return 'в мережі сьогодні о '+t;if(day===ymd(new Date(Date.now()-864e5)))return 'в мережі вчора о '+t;
  return 'в мережі '+pad(d.getDate())+'.'+pad(d.getMonth()+1)+' о '+t;}
function avatarP(s,cls){const w=el('span',{class:'avwrap'},avatar(s,cls));if(s.userId)w.append(el('span',{class:'dot'+(isOnline(s.id)?' on':''),'aria-hidden':'true'}));return w;}
function roleTags(s){return el('span',{class:'row',style:'gap:4px'},roleTag(s.role),s.extraRole&&s.extraRole!==s.role?roleTag(s.extraRole):null);}
function roleTag(r){return el('span',{class:'role '+(r||''),text:ROLE_NAME[r]||'Без ролі'});}
function dayValue(sid,i){const d=S.week&&S.week.days&&S.week.days[sid];return d?d[i]||'':'';}
