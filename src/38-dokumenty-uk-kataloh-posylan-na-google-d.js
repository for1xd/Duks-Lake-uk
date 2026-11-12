// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: «Документи УК»: каталог посилань на Google Диск. Файли живуть тільки на Диску; тут — назви та посилання.

/* DOCS:BEGIN — «Документи УК»: каталог посилань на Google Диск. Файли живуть тільки на Диску; тут — назви та посилання.
   Колекція docs: _cfg {rootUrl,v} · f_<id> {kind:'folder',name,icon,color,url,order,v} · d_<id> {kind:'doc',folderId,name,url,type,note,order,by,at,v}.
   Права: ролі DK_EDIT_ROLES або staff.perms.docsEdit===true (false — заборонити). Решта UK — тільки перегляд. */
const DK_EDIT_ROLES=['manager','director','dev'];
const DK_COLORS=['#1F6F78','#5B6CD9','#0E7C66','#B0742A','#C2416B','#2E8B5E','#7A5AC8','#334155'];
const DK_ICONS={
  act:['Акт із підписом','<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 17c1.2-2 2-2 2.6-.6.5 1.2 1.2 1.2 2.4-.4.6-.8 1.2-.6 2 .6"/>'],
  plan:['Ціль / графік','<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'],
  list:['Список','<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01" stroke-width="3"/>'],
  book:['Книга','<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/>'],
  folder:['Папка з документами','<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 12h8M8 15.5h5"/>'],
  building:['Будівля','<path d="M3 21h18"/><path d="M5 21V4h10v17"/><path d="M15 9h4v12"/><path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1"/>'],
  draw:['Креслення','<path d="M3 3h18v18H3z"/><path d="M3 9h6V3M15 21v-6h6"/><path d="m9 9 6 6"/>'],
  people:['Люди','<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2"/>'],
  doc:['Документ','<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h8"/>']};
const DK_SEED=[['Акти','act'],['План розвитку УК','plan'],['Послуги','list'],['Правила','book'],['Регламенти','folder'],['Тех. паспорти будівель Duck’s Lake','building'],['Технічна документація DL','draw'],['Штатний розпис УК','people']];
const DK_TYPES={gdoc:['Google Docs','#2F6FE4','<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 12h8M9 15.5h8M9 19h5"/>'],gsheet:['Google Sheets','#1E8E4E','<path d="M5 3h14v18H5z"/><path d="M5 9h14M5 15h14M11 9v12"/>'],
  gslide:['Google Slides','#E3A008','<path d="M3 5h18v13H3z"/><path d="M8 21h8M12 18v3"/><path d="M7 9h10v5H7z"/>'],folder:['Папка','#6B7A80','<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'],
  pdf:['PDF','#D23C42','<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M8.5 17v-4h1.3a1.2 1.2 0 0 1 0 2.4H8.5M13 17v-4h1a2 2 0 0 1 0 4zM18 13h-2v4M16 15h1.6"/>'],
  img:['Зображення','#8A5CD0','<path d="M3 4h18v16H3z"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'],xlsx:['Excel','#1E8E4E','<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 12l5 6M14 12l-5 6"/>'],
  docx:['Word','#2F6FE4','<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M8.5 12l1.2 6 1.8-4.5 1.8 4.5 1.2-6"/>'],file:['Файл','#6B7A80','<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/>']};
function dkType(url,name){const u=String(url||''),n=String(name||'').toLowerCase();
  if(/\/document\//.test(u))return 'gdoc';if(/\/spreadsheets\//.test(u))return 'gsheet';if(/\/presentation\//.test(u))return 'gslide';if(/\/folders\//.test(u))return 'folder';
  const ext=(/\.([a-z0-9]{2,5})(?:$|[?#\s)])/.exec(n)||/\.([a-z0-9]{2,5})(?:$|[?#])/.exec(u.toLowerCase())||[])[1];
  if(ext==='pdf')return 'pdf';if(['jpg','jpeg','png','webp','heic','gif'].includes(ext))return 'img';if(['xlsx','xls','csv'].includes(ext))return 'xlsx';if(['docx','doc'].includes(ext))return 'docx';return 'file';}
function dkCanEdit(){const m=myStaff();if(m&&m.perms&&m.perms.docsEdit===false)return false;if(m&&m.perms&&m.perms.docsEdit===true)return true;return hasAny(DK_EDIT_ROLES);}
function dkAll(){return S.dk||{};}
function dkCfg(){return dkAll()._cfg||{};}
function dkFolders(){return Object.values(dkAll()).filter(x=>x.kind==='folder').sort((a,b)=>(a.order||0)-(b.order||0)||String(a.name).localeCompare(b.name,'uk'));}
function dkDocs(fid){return Object.values(dkAll()).filter(x=>x.kind==='doc'&&x.folderId===fid).sort((a,b)=>(a.order||0)-(b.order||0)||(a.at||0)-(b.at||0));}
function dkUrlOk(u){return /^https:\/\/[^\s/]+\.[^\s]+/.test(String(u||'').trim());}
function dkIsDrive(u){try{const h=new URL(u).hostname;return h==='drive.google.com'||h==='docs.google.com';}catch(e){return false;}}
function dkNorm(u){return String(u||'').trim().replace(/[?#].*$/,'').replace(/\/(edit|view|preview)?$/,'').toLowerCase();}
function dkId(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function dkLink(url,cls,kids,label){return el('a',{href:url,target:'_blank',rel:'noopener noreferrer',class:cls,'aria-label':label||null},kids);}
const DK_EXT='<path d="M7 17 17 7M9 7h8v8"/>';
/* перше наповнення: один раз, якщо колекція порожня (lease на _cfg, щоб двоє не створили дублі) */
async function dkSeed(){if(dkSeed.busy||!S.db||!canW())return;dkSeed.busy=true;try{const ref=S.db.doc('docs/_cfg');let sn=await ref.get();if(sn.exists)return;
  if(typeof ref.acquire==='function'){try{const l=await ref.acquire({ttlMs:8000});if(l&&l.acquired===false)return;}catch(e){}}
  const q=await S.db.collection('docs').get();if(q.docs.length)return;const now=Date.now(),by=S.myId||'';
  await ref.set({rootUrl:'',v:1,createdAt:now,updatedAt:now,updatedBy:by});
  for(let i=0;i<DK_SEED.length;i++){const [name,icon]=DK_SEED[i];await S.db.doc('docs/f_seed'+(i+1)).set({kind:'folder',name,icon,color:DK_COLORS[i%DK_COLORS.length],url:'',order:(i+1)*10,v:1,createdAt:now,updatedAt:now,updatedBy:by});}
  devLog('Документи УК: створено початкові папки ('+DK_SEED.length+')');}catch(e){console.warn('dk seed',e);}finally{dkSeed.busy=false;}}
/* запис із перевіркою версії: якщо документ змінив хтось інший — не затираємо */
async function dkPut(id,patch,expV,msg){try{const ref=S.db.doc('docs/'+id);const sn=await ref.get();const cur=sn.exists?(sn.data()||{}):null;
    if(expV!==undefined&&expV!==null&&cur&&(cur.v||0)!==expV){toast('Цей запис щойно змінив хтось інший. Відкрийте його ще раз і повторіть.');return false;}
    if(expV!==undefined&&expV!==null&&!cur){toast('Цей запис уже видалено.');return false;}
    const now=Date.now();const body=Object.assign({},patch,{v:((cur&&cur.v)||0)+1,updatedAt:now,updatedBy:S.myId||''});
    if(cur)await ref.update(body);else await ref.set(Object.assign({createdAt:now},body));if(msg)devLog(msg);return true;}
  catch(e){logErr('Документи УК: '+((e&&(e.code||e.message))||e),msg||'');toast(e&&(e.code==='invalid_argument'||e.code==='not_granted')?'У вас доступ лише для перегляду.':'Не вдалося зберегти. Спробуйте ще раз.');return false;}}
async function dkDel(x,msg){try{const sn=await S.db.doc('docs/'+x.id).get();if(sn.exists&&((sn.data()||{}).v||0)!==(x.v||0)){toast('Цей запис щойно змінив хтось інший. Перевірте й повторіть.');return false;}
  await S.db.doc('docs/'+x.id).delete();devLog(msg);return true;}catch(e){logErr('Документи УК: видалення',msg);toast('Не вдалося видалити. Спробуйте ще раз.');return false;}}
function dkMark(text,q){if(!q)return text;const i=text.toLowerCase().indexOf(q);if(i<0)return text;return [text.slice(0,i),el('mark',{text:text.slice(i,i+q.length)}),text.slice(i+q.length)];}
/* ---------- вигляд ---------- */
function dkView(){const g=FG.find(x=>x.id==='docs');const ed=dkCanEdit();const edit=ed&&S.dkEdit;const q=(S.dkQ||'').trim().toLowerCase();
  if(!S.dkLoaded)return [fgHead(g),el('div',{class:'dk-grid'},[1,2,3,4].map(()=>el('div',{class:'card dk-f dk-sk','aria-hidden':'true'})))];
  const folders=dkFolders();const root=dkCfg().rootUrl||'';S.dkOpen=S.dkOpen||{};
  const sea=el('input',{type:'search',class:'dk-q',id:'dkQ',placeholder:'Пошук папки або документа','aria-label':'Пошук по документах УК',value:S.dkQ||'',autocomplete:'off'});
  sea.addEventListener('input',()=>{S.dkQ=sea.value;const p=sea.selectionStart;render();const n=document.getElementById('dkQ');if(n){n.focus();try{n.setSelectionRange(p,p);}catch(e){}}});
  const bar=el('div',{class:'dk-bar'},el('div',{class:'dk-qw',onclick:()=>sea.focus()},svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),sea),
    el('div',{class:'dk-acts'},
      root?dkLink(root,'btn ghost dk-root',[svg(DK_EXT),' Відкрити в Google Диску'],'Відкрити папку «УК Документи» в Google Диску'):(edit||ed?el('button',{type:'button',class:'btn ghost dk-root',onclick:()=>dkRootSheet()},'Додати посилання на «УК Документи»'):el('span',{class:'btn ghost dk-root',role:'button','aria-disabled':'true',title:'Посилання ще не додано'},svg(DK_EXT),' Відкрити в Google Диску')),
      ed?el('button',{type:'button',class:'btn dk-add',onclick:()=>dkDocSheet(null,null)},'+ Додати документ'):null,
      ed?el('button',{type:'button',class:'btn ghost'+(edit?' on':''),'aria-pressed':edit?'true':'false',onclick:()=>{S.dkEdit=!S.dkEdit;render();}},edit?'Готово':'Редагувати'):null));
  const out=[fgHead(g),bar];
  if(edit)out.push(el('div',{class:'card dk-rootc'},el('span',{class:'dk-fi',style:'--c:#1F6F78'},svg(DK_ICONS.folder[1])),el('span',{class:'dk-rt'},el('b',{text:'Коренева папка «УК Документи»'}),el('small',{class:'muted',text:root||'Посилання ще не додано'})),
    el('button',{type:'button',class:'btn ghost sm',onclick:()=>dkRootSheet()},root?'Змінити посилання':'Додати посилання')));
  const vis=folders.map(f=>{const all=dkDocs(f.id);if(!q)return {f,docs:all,hit:false};const fm=String(f.name).toLowerCase().includes(q);const dm2=all.filter(d=>String(d.name).toLowerCase().includes(q)||String(d.note||'').toLowerCase().includes(q));
    return fm||dm2.length?{f,docs:dm2.length?dm2:all,hit:dm2.length>0,fm}:null;}).filter(Boolean);
  if(!folders.length)out.push(el('div',{class:'card empty'},el('h2',{text:'Папок ще немає'}),el('p',{class:'muted',text:ed?'Натисніть «Редагувати» → «Додати папку».':'Папки з’являться, коли їх додасть менеджер.'})));
  else if(!vis.length)out.push(el('div',{class:'card empty'},el('p',{class:'muted',text:'Нічого не знайдено за «'+S.dkQ.trim()+'».'}),el('button',{type:'button',class:'btn ghost',onclick:()=>{S.dkQ='';render();}},'Очистити пошук')));
  const grid=el('div',{class:'dk-grid'},vis.map(({f,docs,hit},i)=>dkCard(f,docs,hit,q,edit,ed,i,vis.length)));
  if(edit&&!q)grid.append(el('button',{type:'button',class:'card dk-newf',onclick:()=>dkFolderSheet(null)},svg('<path d="M12 5v14M5 12h14"/>'),'Додати папку'));
  out.push(grid);
  out.push(el('p',{class:'muted small dk-note',text:'Файли зберігаються лише на Google Диску — застосунок відкриває посилання. Доступ до файлів налаштовується на Диску.'}));
  return out;}
function fgHead(g){return el('section',{class:'uk-head',style:'--c1:'+g.c1+';--c2:'+g.c2},el('span',{class:'uk-ic big'},svg(g.ic)),el('div',{},el('span',{class:'eyebrow',text:'Facility відділ'}),el('h2',{text:g.name}),el('p',{text:g.sub})));}
function dkCard(f,docs,hit,q,edit,ed,i,n){const ic=(DK_ICONS[f.icon]||DK_ICONS.doc)[1];const has=!!f.url;const open=!!q&&hit||!!S.dkOpen[f.id];const all=dkDocs(f.id);
  const headKids=[el('span',{class:'dk-fi',style:'--c:'+(f.color||DK_COLORS[0])},svg(ic)),el('span',{class:'dk-ft'},el('b',{},dkMark(f.name,q)),has?null:el('small',{class:'muted',text:'Посилання ще не додано'})),has&&!edit?el('span',{class:'dk-ext','aria-hidden':'true'},svg(DK_EXT)):null];
  const head=has&&!edit?dkLink(f.url,'dk-fh',headKids,f.name+' — відкрити в Google Диску'):el('div',{class:'dk-fh'},headKids);
  const card=el('div',{class:'card dk-f'+(has?'':' off')+(hit?' hit':'')},head);
  if(edit)card.append(el('div',{class:'dk-ed'},
    el('button',{type:'button',class:'iconbtn sm',disabled:i===0||!!q?true:null,'aria-label':'Перемістити «'+f.name+'» вище',onclick:()=>dkMove(f,-1)},svg('<path d="m6 15 6-6 6 6"/>')),
    el('button',{type:'button',class:'iconbtn sm',disabled:i===n-1||!!q?true:null,'aria-label':'Перемістити «'+f.name+'» нижче',onclick:()=>dkMove(f,1)},svg('<path d="m6 9 6 6 6-6"/>')),
    el('button',{type:'button',class:'iconbtn sm','aria-label':'Змінити папку «'+f.name+'»',onclick:()=>dkFolderSheet(f)},svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>')),
    el('button',{type:'button',class:'iconbtn sm danger','aria-label':'Видалити папку «'+f.name+'»',onclick:()=>dkDelFolder(f)},svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'))));
  if(!has&&ed&&!edit)card.append(el('button',{type:'button',class:'btn ghost sm dk-addurl',onclick:()=>dkFolderSheet(f,true)},'Додати посилання'));
  if(all.length||edit){const tg=el('button',{type:'button',class:'dk-tg','aria-expanded':open?'true':'false',onclick:()=>{S.dkOpen[f.id]=!S.dkOpen[f.id];render();}},svg(open?'<path d="m6 15 6-6 6 6"/>':'<path d="m6 9 6 6 6-6"/>'),'Документи ('+(q&&hit?docs.length+' з '+all.length:all.length)+')');
    card.append(tg);
    if(open){const L=el('ul',{class:'dk-docs'},docs.map((d,j)=>dkRow(d,q,edit,j,docs.length,f)));if(!docs.length)L.append(el('li',{class:'muted small dk-none',text:'Документів ще немає'}));card.append(L);
      if(ed)card.append(el('button',{type:'button',class:'btn ghost sm dk-addin',onclick:()=>dkDocSheet(null,f.id)},'+ Документ у цю папку'));}}
  return card;}
function dkRow(d,q,edit,j,n,f){const t=DK_TYPES[d.type&&DK_TYPES[d.type]?d.type:dkType(d.url,d.name)];
  const body=[el('span',{class:'dk-ti',style:'--c:'+t[1],title:t[0]},svg(t[2])),el('span',{class:'dk-dt'},el('span',{class:'dk-dn'},dkMark(d.name,q)),d.note?el('small',{class:'muted'},dkMark(d.note,q)):null),edit?null:el('span',{class:'dk-ext','aria-hidden':'true'},svg(DK_EXT))];
  const hit=q&&(String(d.name).toLowerCase().includes(q)||String(d.note||'').toLowerCase().includes(q));
  return el('li',{class:'dk-d'+(hit?' hit':'')},edit?el('span',{class:'dk-dl'},body):dkLink(d.url,'dk-dl',body,d.name+' ('+t[0]+') — відкрити'),
    edit?el('span',{class:'dk-ed'},
      el('button',{type:'button',class:'iconbtn sm',disabled:j===0||!!q?true:null,'aria-label':'Вище',onclick:()=>dkMove(d,-1)},svg('<path d="m6 15 6-6 6 6"/>')),
      el('button',{type:'button',class:'iconbtn sm',disabled:j===n-1||!!q?true:null,'aria-label':'Нижче',onclick:()=>dkMove(d,1)},svg('<path d="m6 9 6 6 6-6"/>')),
      el('button',{type:'button',class:'iconbtn sm','aria-label':'Змінити «'+d.name+'»',onclick:()=>dkDocSheet(d,d.folderId)},svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>')),
      el('button',{type:'button',class:'iconbtn sm danger','aria-label':'Видалити «'+d.name+'»',onclick:()=>confirmSheet('Видалити «'+d.name+'»? Буде видалено тільки посилання в застосунку. Файл на Google Диску не зміниться.','Видалити посилання',async()=>{if(await dkDel(d,'Документи УК: видалено документ «'+d.name+'» з «'+f.name+'»')){toast('Посилання видалено');}})},svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'))):null);}
async function dkMove(x,dir){const list=x.kind==='folder'?dkFolders():dkDocs(x.folderId);const i=list.findIndex(y=>y.id===x.id);const y=list[i+dir];if(!y)return;
  /* переписуємо порядок усього списку кроком 10 — так не буває однакових значень */
  const arr=list.slice();arr[i]=y;arr[i+dir]=x;const ch=arr.map((z,k)=>[z,(k+1)*10]).filter(([z,o])=>(z.order||0)!==o);
  for(const [z,o] of ch){S.dk[z.id]=Object.assign({},z,{order:o});}render();
  for(const [z,o] of ch){try{await S.db.doc('docs/'+z.id).update({order:o,updatedAt:Date.now(),updatedBy:S.myId||''});}catch(e){toast('Не вдалося змінити порядок');break;}}
  devLog('Документи УК: змінено порядок '+(x.kind==='folder'?'папок':'документів')+' («'+x.name+'» '+(dir<0?'вище':'нижче')+')');}
function dkDelFolder(f){const n=dkDocs(f.id).length;
  confirmSheet('Видалити папку «'+f.name+'»'+(n?' і '+n+' '+plural(n,'посилання','посилання','посилань')+' на документи в ній':'')+'? Буде видалено тільки посилання в застосунку. Файли на Google Диску не зміняться.','Видалити посилання',async()=>{
    if(!await dkDel(f,'Документи УК: видалено папку «'+f.name+'»'+(n?' (і '+n+' док.)':'')))return;for(const d of dkDocs(f.id)){try{await S.db.doc('docs/'+d.id).delete();}catch(e){}}toast('Папку прибрано з каталогу');});}
/* ---------- вікна ---------- */
function dkField(id,label,inp,hint){return el('div',{class:'dk-fld'},el('label',{for:id,text:label}),inp,el('small',{class:'dk-err',id:id+'E',role:'alert'}),hint?el('small',{class:'muted',text:hint}):null);}
function dkSetErr(id,t){const e=document.getElementById(id+'E');const i=document.getElementById(id);if(e)e.textContent=t||'';if(i){i.classList.toggle('bad',!!t);i.setAttribute('aria-invalid',t?'true':'false');}}
function dkPasteBtn(inp){return el('button',{type:'button',class:'btn ghost sm',onclick:async()=>{try{const t=await navigator.clipboard.readText();if(t){inp.value=t.trim();inp.dispatchEvent(new Event('input'));}else toast('Буфер обміну порожній');}catch(e){toast('Браузер не дав прочитати буфер — вставте посилання вручну (утримуйте поле → «Вставити»).');}}},'Вставити');}
function dkDocSheet(d,fid){const folders=dkFolders();if(!folders.length){toast('Спершу додайте папку');return;}
  const name=el('input',{id:'dkN',type:'text',maxlength:'200',value:d?d.name:'',autocomplete:'off'});
  const url=el('input',{id:'dkU',type:'url',inputmode:'url',placeholder:'https://drive.google.com/…',value:d?d.url:'',autocomplete:'off'});
  const sel=el('select',{id:'dkF'},folders.map(f=>el('option',{value:f.id,text:f.name})));sel.value=(d&&d.folderId)||fid||folders[0].id;
  const note=el('input',{id:'dkNt',type:'text',maxlength:'200',placeholder:'Напр.: чинний до 31.12.2026',value:d&&d.note||'',autocomplete:'off'});
  const tp=el('small',{class:'muted dk-tp'});const warn=el('div',{class:'dk-warn',role:'alert',hidden:true});let ack='';
  const upd=()=>{const t=DK_TYPES[dkType(url.value,name.value)];tp.textContent=url.value.trim()?'Тип: '+t[0]:'';ack='';warn.hidden=true;save.textContent='Зберегти';};
  name.addEventListener('input',()=>{dkSetErr('dkN','');upd();});url.addEventListener('input',()=>{dkSetErr('dkU','');upd();});sel.addEventListener('change',upd);
  name.addEventListener('blur',()=>{if(!name.value.trim())dkSetErr('dkN','Вкажіть назву документа');});
  url.addEventListener('blur',()=>{const v=url.value.trim();if(v&&!dkUrlOk(v))dkSetErr('dkU','Посилання має починатися з https://');});
  const save=el('button',{type:'button',class:'btn',onclick:async()=>{const n=name.value.trim(),u=url.value.trim(),f=sel.value,nt=note.value.trim();let bad=false;
    if(!n){dkSetErr('dkN','Вкажіть назву документа');bad=true;}if(!u){dkSetErr('dkU','Вставте посилання на документ');bad=true;}else if(!dkUrlOk(u)){dkSetErr('dkU','Посилання має починатися з https://');bad=true;}
    if(bad){(document.querySelector('#sheetRoot .bad')||name).focus();return;}
    const w=[];if(!dkIsDrive(u))w.push('Це не посилання на Google Диск.');const dup=dkDocs(f).find(x=>x.id!==(d&&d.id)&&dkNorm(x.url)===dkNorm(u));if(dup)w.push('У цій папці вже є документ із таким посиланням: «'+dup.name+'».');
    const key=w.join('|');if(w.length&&ack!==key){ack=key;warn.replaceChildren(...w.map(t=>el('p',{text:t})),el('p',{text:'Зберегти все одно?'}));warn.hidden=false;save.textContent='Зберегти все одно';return;}
    save.disabled=true;const fo=folders.find(x=>x.id===f);const body={kind:'doc',folderId:f,name:n,url:u,type:dkType(u,n),note:nt};
    let ok;if(d){ok=await dkPut(d.id,body,d.v||0,'Документи УК: змінено документ «'+n+'»'+(d.folderId!==f?' (перенесено в «'+(fo?fo.name:'')+'»)':'')+(d.url!==u?' — нове посилання':''));}
    else{const last=dkDocs(f);body.order=((last.length?last[last.length-1].order||0:0)+10);body.by=S.myId||'';body.bySid=(myStaff()||{}).id||'';body.at=Date.now();ok=await dkPut(dkId('d_'),body,null,'Документи УК: додано документ «'+n+'» у «'+(fo?fo.name:'')+'»');}
    save.disabled=false;if(ok){closeSheet();S.dkOpen=S.dkOpen||{};S.dkOpen[f]=true;toast(d?'Збережено':'Документ додано');render();}}},'Зберегти');
  openSheet(el('h2',{text:d?'Змінити документ':'Додати документ'}),
    dkField('dkN','Назва документа *',name),
    el('div',{class:'dk-fld'},el('label',{for:'dkU',text:'Посилання *'}),el('div',{class:'dk-urlw'},url,dkPasteBtn(url)),el('small',{class:'dk-err',id:'dkUE',role:'alert'}),tp),
    dkField('dkF','Папка',sel),dkField('dkNt','Примітка',note,'Необов’язково'),warn,
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),save));
  upd();fancySel(document.getElementById('sheetRoot'));setTimeout(()=>{(d?name:name).focus();},60);}
function dkFolderSheet(f,urlOnly){let icon=f?f.icon||'doc':'folder',color=f?f.color||DK_COLORS[0]:DK_COLORS[dkFolders().length%DK_COLORS.length];
  const name=el('input',{id:'dkFN',type:'text',maxlength:'120',value:f?f.name:'',autocomplete:'off'});
  const url=el('input',{id:'dkFU',type:'url',inputmode:'url',placeholder:'https://drive.google.com/drive/folders/…',value:f?f.url||'':'',autocomplete:'off'});
  name.addEventListener('input',()=>dkSetErr('dkFN',''));url.addEventListener('input',()=>dkSetErr('dkFU',''));
  const icons=el('div',{class:'dk-icons',role:'radiogroup','aria-label':'Іконка'});const cols=el('div',{class:'dk-cols',role:'radiogroup','aria-label':'Колір'});
  const draw=()=>{icons.replaceChildren(...Object.entries(DK_ICONS).map(([k,[t,p]])=>el('button',{type:'button',role:'radio','aria-checked':k===icon?'true':'false','aria-label':t,title:t,class:'dk-ib'+(k===icon?' on':''),style:'--c:'+color,onclick:()=>{icon=k;draw();}},svg(p))));
    cols.replaceChildren(...DK_COLORS.map(c=>el('button',{type:'button',role:'radio','aria-checked':c===color?'true':'false','aria-label':'Колір '+c,class:'dk-cb'+(c===color?' on':''),style:'--c:'+c,onclick:()=>{color=c;draw();}})));};draw();
  const save=el('button',{type:'button',class:'btn',onclick:async()=>{const n=name.value.trim(),u=url.value.trim();let bad=false;if(!n){dkSetErr('dkFN','Вкажіть назву папки');bad=true;}if(u&&!dkUrlOk(u)){dkSetErr('dkFU','Посилання має починатися з https://');bad=true;}if(bad)return;
    if(u&&!dkIsDrive(u)&&save.dataset.ack!=='1'){save.dataset.ack='1';dkSetErr('dkFU','Це не посилання на Google Диск. Натисніть «Зберегти все одно», якщо все правильно.');save.textContent='Зберегти все одно';return;}
    save.disabled=true;let ok;const body={kind:'folder',name:n,icon,color,url:u};
    if(f)ok=await dkPut(f.id,body,f.v||0,'Документи УК: змінено папку «'+n+'»'+(f.name!==n?' (була «'+f.name+'»)':'')+((f.url||'')!==u?(u?' — нове посилання':' — посилання прибрано'):''));
    else{const L=dkFolders();body.order=(L.length?L[L.length-1].order||0:0)+10;ok=await dkPut(dkId('f_'),body,null,'Документи УК: додано папку «'+n+'»');}
    save.disabled=false;if(ok){closeSheet();toast(f?'Збережено':'Папку додано');render();}}},'Зберегти');
  openSheet(el('h2',{text:f?(urlOnly?'Посилання на «'+f.name+'»':'Змінити папку'):'Нова папка'}),
    urlOnly?null:dkField('dkFN','Назва папки *',name),
    el('div',{class:'dk-fld'},el('label',{for:'dkFU',text:'Посилання на папку в Google Диску'}),el('div',{class:'dk-urlw'},url,dkPasteBtn(url)),el('small',{class:'dk-err',id:'dkFUE',role:'alert'}),el('small',{class:'muted',text:'Відкрийте папку на Диску → «Поділитися» → «Копіювати посилання».'})),
    urlOnly?null:el('div',{class:'dk-fld'},el('span',{class:'dk-lbl',text:'Іконка'}),icons),urlOnly?null:el('div',{class:'dk-fld'},el('span',{class:'dk-lbl',text:'Колір'}),cols),
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),save));
  setTimeout(()=>(urlOnly?url:name).focus(),60);}
function dkRootSheet(){const c=dkCfg();const url=el('input',{id:'dkRU',type:'url',inputmode:'url',placeholder:'https://drive.google.com/drive/folders/…',value:c.rootUrl||'',autocomplete:'off'});url.addEventListener('input',()=>dkSetErr('dkRU',''));
  const save=el('button',{type:'button',class:'btn',onclick:async()=>{const u=url.value.trim();if(u&&!dkUrlOk(u)){dkSetErr('dkRU','Посилання має починатися з https://');return;}
    if(u&&!dkIsDrive(u)&&save.dataset.ack!=='1'){save.dataset.ack='1';dkSetErr('dkRU','Це не посилання на Google Диск. Натисніть «Зберегти все одно», якщо все правильно.');save.textContent='Зберегти все одно';return;}
    save.disabled=true;const ok=await dkPut('_cfg',{rootUrl:u},c.v!=null?c.v:null,'Документи УК: '+(u?'змінено':'прибрано')+' посилання на кореневу папку «УК Документи»');save.disabled=false;if(ok){closeSheet();toast('Збережено');render();}}},'Зберегти');
  openSheet(el('h2',{text:'Коренева папка «УК Документи»'}),el('div',{class:'dk-fld'},el('label',{for:'dkRU',text:'Посилання на папку в Google Диску'}),el('div',{class:'dk-urlw'},url,dkPasteBtn(url)),el('small',{class:'dk-err',id:'dkRUE',role:'alert'})),
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),save));setTimeout(()=>url.focus(),60);}
/* DOCS:END */
