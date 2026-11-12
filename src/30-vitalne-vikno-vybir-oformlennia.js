// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Вітальне вікно: вибір оформлення

/* ---------- Вітальне вікно: вибір оформлення ---------- */
function welcomeMaybe(){const m=myStaff();if(!S.me||!m||welcomeMaybe.done)return;if(m.welcomed||S.asRole)return;try{if(localStorage.getItem('dl.welcome'))return;}catch(e){}welcomeMaybe.done=true;setTimeout(openWelcome,700);}
function openWelcome(){welcomeDone();const m=myStaff();let st=uiStyle(),th=duckTheme();
  const prev=(v)=>el('span',{class:'wl-pv wl-'+v},el('i'),el('i'),el('i'));
  const styles=[['strict','Строгий','діловий, спокійні кольори — рекомендуємо'],['ios','Мінімал','чистий, як в iPhone'],['live','Живий','яскравий, з каченятами']];
  const themes=[['classic','Без свят','звичайний вигляд'],['auto','Авто','святкові прикраси у свята'],['halloween','Хелловін','гарбузи й кажани завжди']];
  const apply=()=>{try{localStorage.setItem('dl.ui2',st);localStorage.setItem('dl.duck',th);}catch(e){}applyDuckTheme();};
  const grp=(list,get,set,kind)=>{const box=el('div',{class:'wl-opts'});const draw=()=>box.replaceChildren(...list.map(([v,l,d])=>el('button',{type:'button',class:'wl-o','aria-pressed':String(get()===v),onclick:()=>{set(v);apply();draw();}},kind==='st'?prev(v):el('span',{class:'wl-ti',text:{classic:'🦆',auto:'🗓',halloween:'🎃'}[v]}),el('b',{text:l}),el('small',{text:d}))));draw();return box;};
  openSheet(el('div',{class:'wl-head'},el('span',{class:'wl-logo'},svg('<path d="M5 5l14 14M19 9v10H9"/>')),el('h2',{text:'Вітаємо'+(m?', '+m.name.split(' ')[0]:'')+'!'}),el('p',{class:'muted',text:'Оберіть, як виглядатиме застосунок саме для вас.'})),
    el('span',{class:'t-lbl',text:'Стиль'}),grp(styles,()=>st,v=>st=v,'st'),
    el('span',{class:'t-lbl',text:'Святкова тема'}),grp(themes,()=>th,v=>th=v,'th'),
    el('p',{class:'wl-note'},svg('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>'),'Змінити будь-коли: Мій профіль → Оформлення.'),
    el('button',{class:'btn',type:'button',style:'width:100%',onclick:()=>{apply();welcomeDone();closeSheet();render();}},'Готово'));}
function welcomeDone(){try{localStorage.setItem('dl.welcome','1');}catch(e){}const m=myStaff();if(m&&!m.welcomed&&S.db)S.db.doc('staff/'+m.id).update({welcomed:true}).catch(()=>{});}

function chatFade(){const on=document.body.classList.contains('chatmode')&&S.tab==='chat';const wrap=document.querySelector('#scroller .wrap');let f=document.getElementById('chatFade');
  if(!on||!wrap){if(f)f.remove();return;}if(!f||f.parentElement!==wrap){if(f)f.remove();f=el('div',{id:'chatFade','aria-hidden':'true'});wrap.prepend(f);}
  const sc=document.getElementById('scroller');const h=document.querySelector('header.top');const pb=document.querySelector('.pinbar');if(!sc||!h)return;
  const r=sc.getBoundingClientRect(),wr=wrap.getBoundingClientRect();let b=h.getBoundingClientRect().bottom;if(pb){const pr=pb.getBoundingClientRect();if(pr.top<b+40)b=Math.max(b,pr.bottom);}
  const H=Math.round(b-r.top+30);f.style.height=H+'px';f.style.marginBottom=(-H)+'px';f.style.marginLeft=(r.left-wr.left)+'px';const as=document.querySelector('aside.chataside');const ar=as&&getComputedStyle(as).display!=='none'?as.getBoundingClientRect():null;f.style.width=(ar&&ar.width?Math.max(0,ar.left-r.left-6):sc.clientWidth)+'px';f.style.backgroundPosition=(-r.left)+'px 0';}
addEventListener('resize',()=>requestAnimationFrame(chatFade));
