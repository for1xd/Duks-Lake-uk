// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: chat

/* ---------- chat ---------- */
const MAIN='main';
function curRoom(){return S.room||MAIN;}
function roomOf(c){return c.room||MAIN;}
function dmId(a,b){return 'dm_'+[a,b].sort().join('__');}
function dmOther(rid){const m=myStaff();if(!rid.startsWith('dm_'))return null;const ids=rid.slice(3).split('__');return staffById(ids.find(x=>!m||x!==m.id)||ids[0]);}
function roomMembers(rid){if(rid===MAIN)return S.staff.map(x=>x.id);if(rid.startsWith('dm_'))return rid.slice(3).split('__');const r=S.rooms[rid]||{};return r.members&&r.members.length?r.members:S.staff.map(x=>x.id);}
function canSeeRoom(rid){const m=myStaff();if(rid===MAIN)return true;if(!m)return false;if(rid.startsWith('dm_'))return roomMembers(rid).includes(m.id);if(!S.rooms[rid])return false;return roomMembers(rid).includes(m.id)||isDev();}
function roomMeta(rid){if(rid===MAIN){const r=S.rooms.main||{};return {name:r.name||'DUCK’S LAKE Основний',emoji:r.emoji||'🦆',desc:r.desc||'Спільний чат усієї колективу'};}
  if(rid.startsWith('dm_')){const o=dmOther(rid);return {name:o?o.name:'Приватний чат',person:o,desc:o?seenText(o.id):'',dm:true};}
  const r=S.rooms[rid]||{};return {name:r.name||'Група',emoji:r.emoji||'💬',desc:r.desc||(roomMembers(rid).length+' учасників')};}
function roomMsgs(rid){return S.chat.filter(c=>roomOf(c)===rid);}
function readAt(sid,rid){return rid===MAIN?(S.reads[sid]||0):((S.readsR[sid]||{})[rid]||0);}
function myReadAt(rid){const m=myStaff();const r=m?readAt(m.id,rid):0;return rid===MAIN?Math.max(r,seenAt()):r;}
function unreadIn(rid){const t=myReadAt(rid);return roomMsgs(rid).filter(c=>c.at>t&&c.by!==S.myId).length;}
function myRooms(){const m=myStaff();const set=new Set([MAIN]);Object.keys(S.rooms).forEach(k=>{if(k!==MAIN&&canSeeRoom(k))set.add(k);});
  if(m)S.chat.forEach(c=>{const r=roomOf(c);if(r.startsWith('dm_')&&canSeeRoom(r))set.add(r);});
  const last=r=>{const ms=roomMsgs(r);return ms.length?ms[ms.length-1].at:((S.rooms[r]||{}).at||0);};
  return [...set].sort((a,b)=>a===MAIN?-1:b===MAIN?1:last(b)-last(a));}
function seenAt(){try{return +localStorage.getItem('dl.chatSeen')||0;}catch(e){return 0;}}
function unreadChat(){let n=0;for(const r of myRooms()){if(S.tab==='chat'&&(S.room===r||(!S.room&&WIDE2.matches&&r===MAIN)))continue;n+=unreadIn(r);}return n;}
function markChatSeen(){const rid=curRoom();if(S.tab==='chat'&&!S.room&&!WIDE2.matches)return;const ms=roomMsgs(rid);const last=ms.length?ms[ms.length-1].at:0;
  if(rid===MAIN&&last>seenAt()){try{localStorage.setItem('dl.chatSeen',String(last));}catch(e){}}
  const m=myStaff();if(!m||!last||document.visibilityState!=='visible'||last<=readAt(m.id,rid))return;const key=rid+':'+last;if(S.readSent===key)return;S.readSent=key;
  const rooms={...(S.readsR[m.id]||{})};let at=S.reads[m.id]||0;if(rid===MAIN)at=last;else rooms[rid]=last;
  S.db.doc('reads/'+m.id).set({at,rooms}).catch(()=>{S.readSent=0;});}
function hm(ts){const d=new Date(ts);return pad(d.getHours())+':'+pad(d.getMinutes());}
function dayLabel(ts){const d=new Date(ts);const t=ymd(d);const today=ymd(new Date());const y=ymd(new Date(Date.now()-864e5));
  return t===today?'Сьогодні':t===y?'Вчора':pad(d.getDate())+'.'+pad(d.getMonth()+1);}
const TICK1='<path d="m4 12.5 4.5 4.5L19 6.5"/>';
const TICK2='<path d="m1.5 12.5 4.5 4.5L16.5 6.5"/><path d="m11 16 1 1L22.5 6.5"/>';
function readersOf(c){const rid=roomOf(c);const mem=new Set(roomMembers(rid));return sortedStaff().filter(x=>x.id!==c.staffId&&mem.has(x.id)&&readAt(x.id,rid)>=c.at);}
function escRe(x){return x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function mentionRe(){const names=S.staff.map(x=>x.name).filter(Boolean).sort((a,b)=>b.length-a.length);return names.length?new RegExp('@('+names.map(escRe).join('|')+')','g'):null;}
function mentionNodes(text){const re=mentionRe();if(!re)return[text];const out=[];let last=0,mm;const me=myStaff();
  while((mm=re.exec(text))){if(mm.index>last)out.push(text.slice(last,mm.index));const isMe=me&&mm[1]===me.name;out.push(el('span',{class:'mention'+(isMe?' me':''),text:'@'+mm[1]}));last=mm.index+mm[0].length;}
  if(last<text.length)out.push(text.slice(last));return out;}
function mentionsIn(text){const re=mentionRe();if(!re)return[];const ids=new Set();let mm;while((mm=re.exec(text))){const x=S.staff.find(y=>y.name===mm[1]);if(x)ids.add(x.id);}return [...ids];}
async function notifyMention(text,ids){
  const me=myStaff();const to=[...new Set(ids.filter(id=>!me||id!==me.id).map(id=>staffById(id)).filter(x=>x&&x.email).map(x=>x.email.trim()))];
  if(!to.length)return;const mcp=await claude.use('mcp').catch(()=>null);if(!mcp){toast('Згадку збережено, але лист не надіслано: у вашому акаунті Gmail тут недоступний');return;}
  const from=me?me.name:'Колега';
  try{await mcp.callTool('Gmail','send_message',{to,subject:from+' згадав вас у чаті DUCK’S LAKE',body:from+' написав у чаті:\n\n'+text+'\n\nВідкрити чат: '+APP_URL,
    htmlBody:'<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F2A33"><p style="color:#1F6F78;font-weight:bold;letter-spacing:1px;margin:0 0 8px">DUCK’S LAKE</p><p style="margin:0 0 8px"><b>'+escH(from)+'</b> згадав вас у чаті:</p><p style="white-space:pre-wrap;background:#E8EFEE;padding:10px 12px;border-radius:10px;margin:0 0 12px">'+escH(text)+'</p><p><a href="'+APP_URL+'" style="background:#1F6F78;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Відкрити чат</a></p></div>'});}
  catch(e){console.warn('gmail mention',e);if(e&&(e.code==='server_not_connected'||e.code==='needs_reauth'))toast('Згадку збережено, але лист не надіслано: підключіть Gmail у Claude');}
}
function isDMr(rid){return !!rid&&String(rid).startsWith('dm_');}
function canPin(rid){if(isDMr(rid)){const m=myStaff();return !!m&&roomMembers(rid).includes(m.id);}return hasAny(['dev','manager','director']);}
function canClear(rid){if(isDMr(rid)){const m=myStaff();return !!m&&roomMembers(rid).includes(m.id);}return isDev();}
function roomSubText(rid){const mt=roomMeta(rid);if(mt.dm)return mt.desc||'';const mem=roomMembers(rid);const on=mem.filter(id=>{const x=staffById(id);return x&&x.userId&&isOnline(id);}).length;
  return mem.length+' '+plural(mem.length,'учасник','учасники','учасників')+(on?', '+on+' в мережі':'');}
function clearRoom(rid){const mt=roomMeta(rid);const ms=roomMsgs(rid);if(!ms.length){toast('Чат уже порожній');return;}
  confirmSheet('Очистити «'+mt.name+'»? Буде видалено '+ms.length+' '+plural(ms.length,'повідомлення','повідомлення','повідомлень')+' з фото та файлами — для всіх учасників. Повернути не можна.','Очистити',()=>write(async()=>{
    for(const c of ms){await S.db.doc('chat/'+c.id).delete();if(c.photoId)await S.db.doc('photos/'+c.photoId).delete().catch(()=>{});if(c.att&&S.assets)await S.assets.delete(c.att.id).catch(()=>{});}},'Чат очищено'));}
function roomInfo(rid){const mt=roomMeta(rid);const mem=roomMembers(rid).map(staffById).filter(Boolean).sort((a,b)=>(isOnline(b.id)?1:0)-(isOnline(a.id)?1:0));const pins=roomMsgs(rid).filter(c=>c.pinned).length;
  openSheet(el('div',{class:'ri-head'},roomAv(rid,'ri-av'),el('h2',{style:'margin:0',text:mt.name}),el('span',{class:'muted small',text:roomSubText(rid)})),
    !mt.dm&&mt.desc?el('p',{class:'muted',style:'margin:0;text-align:center',text:mt.desc}):null,
    el('div',{class:'ri-acts'},
      pins?el('button',{type:'button',class:'ri-a',onclick:()=>{closeSheet();const p=roomMsgs(rid).filter(c=>c.pinned).sort((a,b)=>(b.pinnedAt||0)-(a.pinnedAt||0))[0];if(p)setTimeout(()=>jumpTo(p.id),300);}},svg('<path d="M12 17v5"/><path d="M9 10.8V4h6v6.8l3 3.2v2H6v-2z"/>'),el('span',{text:'Закріплені · '+pins})):null,
      isDev()&&!mt.dm?el('button',{type:'button',class:'ri-a',onclick:()=>{closeSheet();setTimeout(()=>roomEditSheet(rid),250);}},svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>'),el('span',{text:'Налаштування'})):null,
      canClear(rid)?el('button',{type:'button',class:'ri-a danger',onclick:()=>{closeSheet();setTimeout(()=>clearRoom(rid),250);}},svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),el('span',{text:'Очистити чат'})):null),
    mt.dm?null:el('div',{class:'ri-list'},el('span',{class:'t-lbl',text:'Учасники · '+mem.length}),mem.map(x=>el('div',{class:'pa-row'},avatarP(x),el('span',{class:'pa-t'},el('b',{text:x.name}),el('span',{class:'small '+(isOnline(x.id)?'online':'muted'),text:seenText(x.id)}))))),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));}
function tgHead(){const on=S.tab==='chat'&&!!S.room&&!WIDE2.matches&&!WIDE.matches;document.body.classList.toggle('tgroom',on);const hdr=document.querySelector('header.top');if(!hdr)return;
  let b=document.getElementById('tgAv');if(!b){b=el('button',{id:'tgAv',type:'button',class:'tg-av','aria-label':'Інформація про чат'});b.addEventListener('click',()=>{if(S.room)roomInfo(S.room);});hdr.append(b);}
  b.hidden=!on;if(on){b.replaceChildren(roomAv(S.room,'tg-avi'));const sub=document.getElementById('pageSub');if(sub)sub.textContent=roomSubText(S.room);
    const br=hdr.querySelector('.brand');if(br&&!br.dataset.tg){br.dataset.tg='1';br.addEventListener('click',()=>{if(document.body.classList.contains('tgroom')&&S.room)roomInfo(S.room);});}}}
function roomAv(rid,cls){const mt=roomMeta(rid);if(mt.person)return avatarP(mt.person,cls);return el('span',{class:'rav'+(cls?' '+cls:''),text:mt.emoji});}
function roomListNodes(){const m=myStaff();
  const items=myRooms().map(rid=>{const mt=roomMeta(rid);const ms=roomMsgs(rid);const lm=ms[ms.length-1];const un=unreadIn(rid);const w=lm&&staffById(lm.staffId);
    const prev=lm?(lm.by===S.myId?'Ви: ':(rid.startsWith('dm_')||!w?'':w.name.split(' ')[0]+': '))+(lm.text||(lm.att?(lm.att.kind==='video'?'🎬 Відео':'📎 '+lm.att.name):'📷 Фото')):'Ще немає повідомлень';
    const on=curRoom()===rid&&(S.room||WIDE2.matches);
    return el('button',{type:'button',class:'rl-i'+(on?' on':'')+(un?' un':''),onclick:()=>openRoom(rid)},roomAv(rid),
      el('span',{class:'rl-t'},el('span',{class:'rl-n'},el('b',{text:mt.name}),rid===MAIN?el('span',{class:'rl-pin',text:'📌'}):null,el('small',{text:lm?dayLabelShort(lm.at):''})),
        el('span',{class:'rl-p'},el('span',{text:prev}),un?el('span',{class:'badge',text:String(un)}):null)));});
  const acts=el('div',{class:'rl-acts'},m?el('button',{type:'button',class:'btn sm',onclick:newDmSheet},svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),' Написати особисто'):null,
    isDev()?el('button',{type:'button',class:'btn ghost sm',onclick:()=>roomEditSheet(null)},'+ Група'):null);
  return [acts,el('div',{class:'card rl'},items)];}
function dayLabelShort(ts){const d=new Date(ts);return ymd(d)===ymd(new Date())?hm(ts):dayLabel(ts);}
function openRoom(rid){if(S.room===rid&&S.tab==='chat')return;const wide=WIDE2.matches&&S.tab==='chat';S.hist.push(snap());S.room=rid;S.chatStick=true;S.knownMsgs=null;S.pinIdx=0;
  if(wide){render();const e=SC();e.scrollTop=e.scrollHeight;const c=document.querySelector('.chatcol');if(c){c.classList.remove('room-in');void c.offsetWidth;c.classList.add('room-in');}return;}
  SC().scrollTop=0;render();animIn(1);}
function newDmSheet(){const m=myStaff();const ppl=sortedStaff().filter(x=>!m||x.id!==m.id);
  openSheet(el('h2',{text:'Написати особисто'}),el('p',{class:'muted',style:'margin:0',text:'Повідомлення побачите лише ви двоє.'}),
    el('div',{class:'stack',style:'gap:6px'},ppl.map(x=>el('button',{type:'button',class:'person',onclick:()=>{closeSheet();openRoom(dmId(m.id,x.id));}},avatarP(x),el('span',{class:'nm'},el('b',{text:x.name}),el('span',{class:'muted small',text:seenText(x.id)}))))),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function roomEditSheet(rid){const isNew=!rid;const main=rid===MAIN;const r=rid?(S.rooms[rid]||{}):{};const mt=rid?roomMeta(rid):{name:'',emoji:'💬',desc:''};
  const em=el('input',{id:'rmE',maxlength:'4',value:mt.emoji||'💬',style:'text-align:center;font-size:24px!important'});const nm=el('input',{id:'rmN',maxlength:'40',value:rid?mt.name:'',placeholder:'Напр.: Садівники'});
  const ds=el('input',{id:'rmD',maxlength:'80',value:r.desc||(main?mt.desc:''),placeholder:'Короткий опис (необов’язково)'});
  const picked=new Set(r.members||[]);if(isNew&&myStaff())picked.add(myStaff().id);
  openSheet(el('h2',{text:isNew?'Нова група':'Налаштування чату'}),
    el('div',{class:'row',style:'gap:10px;flex-wrap:nowrap;align-items:flex-end'},el('label',{for:'rmE',style:'width:76px'},'Іконка',em),el('label',{for:'rmN',style:'flex:1'},'Назва',nm)),
    el('label',{for:'rmD'},'Опис',ds),
    !main?el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Учасники'}),assignPicker(picked)):el('p',{class:'muted small',style:'margin:0',text:'Основний чат бачать усі працівники.'}),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const n=nm.value.trim();if(!n){toast('Вкажіть назву');return;}
        const data={name:n,emoji:em.value.trim()||'💬',desc:ds.value.trim()||null,updatedAt:Date.now()};if(!main)data.members=[...picked];if(!main&&picked.size<2){toast('Оберіть хоча б 2 учасників');return;}
        closeSheet();if(isNew)write(async()=>{const ref=await S.db.collection('rooms').add({...data,at:Date.now(),by:S.myId});openRoom(ref.id);},'Групу створено');else write(()=>S.db.doc('rooms/'+rid).set({...r,...data}),'Збережено');}},isNew?'Створити':'Зберегти'),
      !isNew&&!main?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити групу «'+mt.name+'»? Повідомлення в ній зникнуть зі списку.','Видалити',()=>write(async()=>{await S.db.doc('rooms/'+rid).delete();S.room=null;render();},'Групу видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function pinBar(rid){const pins=roomMsgs(rid).filter(c=>c.pinned).sort((a,b)=>(b.pinnedAt||0)-(a.pinnedAt||0));if(!pins.length)return null;
  const i=(S.pinIdx||0)%pins.length;const c=pins[i];const w=staffById(c.staffId);
  return el('div',{class:'pinbar'},el('button',{type:'button',class:'pb-main',onclick:()=>{jumpTo(c.id);S.pinIdx=i+1;const pb=document.querySelector('.pinbar');if(pb&&pins.length>1)pb.replaceWith(pinBar(rid));}},
      el('span',{class:'pb-bars'},pins.slice(0,4).map((_,k)=>el('i',{class:k===i%4?'on':''}))),
      el('span',{class:'pb-t'},el('b',{text:'Закріплене'+(pins.length>1?' '+(i+1)+'/'+pins.length:'')}),el('span',{text:(w?w.name.split(' ')[0]+': ':'')+(c.text||'📷 Фото')}))),
    canPin(rid)?el('button',{type:'button',class:'pb-x','aria-label':'Відкріпити',onclick:()=>write(()=>S.db.doc('chat/'+c.id).update({pinned:null,pinnedAt:null}),'Відкріплено')},svg('<path d="M6 6l12 12M18 6 6 18"/>')):null);}
function convHead(rid){const mt=roomMeta(rid);
  return el('div',{class:'chathead'},el('button',{type:'button',class:'ch-info',onclick:()=>roomInfo(rid)},roomAv(rid,'ch-av'),el('div',{style:'min-width:0;flex:1;text-align:left'},el('b',{text:mt.name}),el('span',{class:'muted small',text:roomSubText(rid)}))),
    canClear(rid)?el('button',{type:'button',class:'iconbtn sm','aria-label':'Очистити чат',title:'Очистити чат',onclick:()=>clearRoom(rid)},svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>')):null,
    isDev()&&!rid.startsWith('dm_')?el('button',{type:'button',class:'iconbtn sm','aria-label':'Налаштування чату',onclick:()=>roomEditSheet(rid)},svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>')):null);}
function viewChat(){const wide2=WIDE2.matches;
  if(!wide2&&!S.room)return roomListNodes();
  const rid=curRoom();if(!canSeeRoom(rid)){S.room=null;return roomListNodes();}
  const inner=viewChatInner();const pb=pinBar(rid);
  if(!WIDE.matches)return [pb,...inner].filter(Boolean);
  const col=el('div',{class:'chatcol'},convHead(rid),pb,...inner);
  if(!wide2)return [el('div',{class:'chatgrid'},col)];
  return [el('div',{class:'chatgrid'},col,el('aside',{class:'chataside'},el('div',{class:'glasspanel rl-side'},el('div',{class:'gp-head'},el('b',{text:'Чати'})),...roomListNodes(),onlineMini())))];}
function onlineMini(){const onl=S.staff.filter(x=>x.userId&&isOnline(x.id));return el('div',{class:'onl-mini'},el('span',{class:'t-lbl',text:'У мережі · '+onl.length}),el('div',{class:'avstack'},onl.slice(0,8).map(x=>plink(x,[avatar(x)]))));}
function onlineCount(){return S.staff.filter(x=>x.userId&&isOnline(x.id)).length;}
function peopleAside(){const all=S.staff.filter(x=>x.userId);const onl=all.filter(x=>isOnline(x.id));const off=all.filter(x=>!isOnline(x.id)).sort((a,b)=>(((S.pres[b.id]||{}).at||0)-((S.pres[a.id]||{}).at||0)));
  const row=x=>plink(x,[avatarP(x),el('span',{class:'pa-t'},el('b',{text:x.name}),el('span',{class:'small '+(isOnline(x.id)?'online':'muted'),text:seenText(x.id)}))],'pa-row');
  return el('aside',{class:'chataside'},el('div',{class:'glasspanel'},
    el('div',{class:'gp-head'},el('div',{class:'ch-ic'},svg('<path d="M4 5h16v11H9l-5 4z"/>')),el('div',{style:'min-width:0;flex:1'},el('b',{text:'Чат колективу'}),el('span',{class:'muted small',text:all.length+' учасників'})),
      el('span',{class:'onl-chip'},el('span',{class:'od'}),String(onl.length))),
    onl.length?el('div',{class:'avstack'},onl.slice(0,6).map(x=>avatar(x))):null,
    el('span',{class:'t-lbl',text:'У мережі · '+onl.length}),
    onl.length?el('div',{class:'stack',style:'gap:2px'},onl.map(row)):el('span',{class:'muted small',text:'Зараз нікого, крім вас'}),
    off.length?el('span',{class:'t-lbl',text:'Не в мережі · '+off.length}):null,
    off.length?el('div',{class:'stack off-list',style:'gap:2px'},off.map(row)):null,
    el('div',{class:'gp-tips'},['@ згадати',IS_TOUCH?'утримати — меню':'2× клік — меню',IS_TOUCH?'2× тап ❤️':'правий клік — меню','свайп → відповідь'].map(t=>el('span',{class:'tipchip',text:t})))));}
function viewChatInner(){
  const out=[];const m=myStaff();
  if(!m)out.push(el('div',{class:'card'},el('p',{class:'muted',style:'margin:0',text:'Щоб писати в чат, спершу підтвердіть своє ім’я на вкладці «Сьогодні».'})));
  const rid=curRoom();const MS=roomMsgs(rid);if(!MS.length){const mt=roomMeta(rid);out.push(el('div',{class:'card empty'},mt.person?avatarP(mt.person,'big'):el('span',{class:'rav big',text:mt.emoji}),el('h2',{text:mt.name}),el('p',{class:'muted',text:mt.dm?'Це приватний чат. Напишіть перше повідомлення.':'Напишіть перше повідомлення.'})));return out;}
  const list=el('div',{class:'chat'});let lastDay='';
  for(const c of MS){
    const dl=dayLabel(c.at);if(dl!==lastDay){list.append(el('div',{class:'daysep',text:dl}));lastDay=dl;}
    const who=staffById(c.staffId);const mine=!!(m&&c.staffId===m.id);
    const seen=mine&&readersOf(c).length>0;
    const meta=el('span',{class:'tm'},c.edited?el('span',{class:'edited',text:'змінено'}):null,el('span',{text:hm(c.at)}),
      mine?el('span',{class:'ticks'+(seen?' seen':''),'aria-label':seen?'Переглянуто':'Надіслано'},svg(seen?TICK2:TICK1)):null);
    const q=c.replyTo;const qw=q&&staffById(q.staffId);
    const rr=reactRow(c);const att=c.att||null;const isVid=!!(att&&att.kind==='video'&&!att.gone);const hasPic=!!c.thumb||isVid;const picOnly=hasPic&&!c.text;
    const inl=!!c.text&&!rr;
    let txt=null;if(c.text){txt=el('span',{class:'txt'},mentionNodes(c.text));if(inl)txt.append(el('span',{class:'tsp','aria-hidden':'true',style:'width:'+(40+(mine?22:0)+(c.edited?54:0))+'px'}));}
    const kids=[!mine?(who?plink(who,[el('span',{text:who.name})],'who'):el('span',{class:'who',text:'Колишній працівник'})):null,
      q?el('button',{type:'button',class:'quote','aria-label':'Перейти до повідомлення',onclick:e=>{e.stopPropagation();jumpTo(q.id);}},el('b',{text:qw?qw.name:'—'}),el('span',{text:q.text})):null,
      c.thumb?el('button',{type:'button',class:'pic','aria-label':'Відкрити фото',onclick:e=>{e.stopPropagation();viewPhoto(c.photoId);}},el('img',{src:c.thumb,alt:'Фото',loading:'lazy'})):null,
      att&&att.gone?el('div',{class:'filecard gone'},el('span',{class:'fc-ic',style:'background:#8A9BA0'},el('b',{text:extOf(att.name)})),el('span',{class:'fc-t'},el('b',{text:att.name||'Файл'}),el('span',{text:'Файл видалено, щоб звільнити місце'}))):null,
      isVid&&!att.gone?el('div',{class:'pic vidbox',onclick:e=>e.stopPropagation(),ondblclick:e=>e.stopPropagation()},el('video',{src:'/_blob/'+att.id,controls:true,playsinline:true,preload:'metadata'})):null,
      att&&att.kind==='file'&&!att.gone?fileCard(att):null,
      txt,rr?el('div',{class:'bfoot'},rr,meta):meta];
    const pinged=!mine&&m&&(c.mentions||[]).includes(m.id);
    const bubble=el('div',{class:'bubble'+(pinged?' pinged':'')+(hasPic?' has-pic':'')+(picOnly&&!rr?' pic-only':'')+(inl?' inl':''),role:'button',tabindex:'0','aria-label':(mine?'Ваше повідомлення':'Повідомлення')+'. '+(IS_TOUCH?'Утримуйте для дій':'Подвійний клік або правий клік для дій'),onkeydown:e=>{if(e.key==='Enter'||e.key==='ContextMenu'){e.preventDefault();msgPop(c,mine,bubble);}}},kids);
    bindMsgActions(bubble,c,mine);
    const isNew=S.knownMsgs&&!S.knownMsgs.has(c.id);
    const row=el('div',{class:'msg'+(mine?' mine':'')+(isNew?' new':''),id:'m-'+c.id},!mine?(who?plink(who,[avatarP(who)]):el('span',{class:'av',style:'background:#53686F',text:'?'})):null,bubble,el('span',{class:'swipe-ic','aria-hidden':'true'},svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v4"/>')));
    if(m)addSwipe(row,bubble,c);list.append(row);
  }
  S.knownMsgs=new Set(S.chat.map(x=>x.id));
  out.push(list);return out;
}
function addSwipe(row,bubble,c){let sx=0,sy=0,dx=0,axis=null;const ic=row.querySelector('.swipe-ic');const MAX=64,TH=42;
  const reset=()=>{bubble.style.transition='transform .38s cubic-bezier(.25,1,.5,1)';bubble.style.transform='';if(ic){ic.style.transition='opacity .25s, transform .38s cubic-bezier(.25,1,.5,1)';ic.style.opacity='';ic.style.transform='';}row.classList.remove('swiping');axis=null;dx=0;};
  row.addEventListener('touchstart',e=>{const p=e.touches[0];if(p.clientX<=44){axis='edge';return;}sx=p.clientX;sy=p.clientY;dx=0;axis=null;bubble.style.transition='none';if(ic)ic.style.transition='none';},{passive:true});
  row.addEventListener('touchmove',e=>{if(axis==='edge')return;const p=e.touches[0];const x=p.clientX-sx,y=p.clientY-sy;
    if(axis===null){if(Math.abs(x)<8&&Math.abs(y)<8)return;axis=Math.abs(x)>Math.abs(y)*1.2&&x>0?'x':'y';}
    if(axis!=='x')return;
    dx=MAX*(1-Math.exp(-Math.max(0,x)/MAX));
    bubble.style.transform='translateX('+dx.toFixed(1)+'px)';
    if(ic){const k=Math.min(1,dx/TH);ic.style.opacity=String(k);ic.style.transform='translateY(-50%) scale('+(0.6+0.4*k)+')';}
    const ready=dx>TH;if(ready&&!row.classList.contains('swiping')){row.classList.add('swiping');if(navigator.vibrate)try{navigator.vibrate(8);}catch(e){}}else if(!ready)row.classList.remove('swiping');},{passive:true});
  row.addEventListener('touchend',()=>{const go=axis==='x'&&dx>TH;reset();if(go)setReply(c);});
  row.addEventListener('touchcancel',reset);}

const IC={reply:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v4"/>',copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',del:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',pic:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'};
function bindMsgActions(b,c,mine){
  b.addEventListener('contextmenu',e=>{e.preventDefault();msgPop(c,mine,b);});
  if(!IS_TOUCH){b.addEventListener('dblclick',e=>{e.preventDefault();try{getSelection().removeAllRanges();}catch(_){}msgPop(c,mine,b);});return;}
  let t=null,sx=0,sy=0;const clear=()=>{clearTimeout(t);t=null;b.classList.remove('press');};
  b.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;b._lp=false;b.classList.add('press');
    t=setTimeout(()=>{t=null;b._lp=true;b.classList.remove('press');try{getSelection().removeAllRanges();}catch(_){}if(navigator.vibrate)try{navigator.vibrate(12);}catch(_){}msgPop(c,mine,b);},430);},{passive:true});
  b.addEventListener('touchmove',e=>{if(!t)return;const p=e.touches[0];if(Math.abs(p.clientX-sx)>9||Math.abs(p.clientY-sy)>9)clear();},{passive:true});
  b.addEventListener('touchend',e=>{clear();if(b._lp){e.preventDefault();}},{passive:false});
  b.addEventListener('touchcancel',clear);
  b.addEventListener('click',e=>{if(b._lp){b._lp=false;return;}const now=Date.now();
    if(b._t&&now-b._t<300){clearTimeout(b._tm);b._t=0;toggleReact(c,'❤️');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');return;}
    b._t=now;b._tm=setTimeout(()=>{b._t=0;msgPop(c,mine,b);},290);});
}
function copyText(t){const ok=()=>toast('Текст скопійовано');
  const fb=()=>{const ta=el('textarea',{style:'position:fixed;opacity:0;top:0'});ta.value=t;document.body.append(ta);ta.select();try{document.execCommand('copy');ok();}catch(_){toast('Не вдалося скопіювати');}ta.remove();};
  try{navigator.clipboard.writeText(t).then(ok,fb);}catch(_){fb();}}
function closeMsgPop(){const r=document.getElementById('mpopRoot');if(!r)return;r.classList.add('out');document.removeEventListener('keydown',msgPopKey);
  const sc=document.getElementById('scroller');if(sc)sc.removeEventListener('scroll',closeMsgPop);
  setTimeout(()=>r.remove(),160);r.id='';}
function msgPopKey(e){if(e.key==='Escape')closeMsgPop();}
function msgPop(c,mine,b){closeMsgPop();
  const m=myStaff();const r=b.getBoundingClientRect();const W=innerWidth,H=innerHeight;
  const it=(ic,label,fn,danger)=>el('button',{type:'button',class:'mpi'+(danger?' danger':''),role:'menuitem',onclick:()=>{closeMsgPop();fn();}},svg(ic),el('span',{text:label}));
  const rdL=readersOf(c);const rd=rdL.length;const rx=Object.entries(c.reactions||{}).filter(([,e])=>e);
  const ppl=[...new Set([...rx.map(([sid])=>sid),...rdL.map(x=>x.id)])].map(staffById).filter(x=>x&&x.id!==c.staffId);
  const rxOf=Object.fromEntries(rx);
  const head=el('button',{type:'button',class:'mph',role:'menuitem','aria-haspopup':'true',disabled:ppl.length?null:true,onclick:()=>showPeople()},
    rd?el('span',{class:'ticks seen'},svg(TICK2)):(rx.length?svg('<path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5V4a1.5 1.5 0 0 1 3 0v6m0-4.5a1.5 1.5 0 0 1 3 0V12m0-3a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L3.8 15a1.6 1.6 0 0 1 2.5-2L7 14"/>'):(mine?el('span',{class:'ticks'},svg(TICK1)):svg(IC.eye))),
    el('span',{class:'mph-l',text:rd?rd+' переглянули':(rx.length?rx.length+' реакц'+(rx.length===1?'ія':(rx.length<5?'ії':'ій')):(mine?'Ще не переглянуто':'Ще ніхто не бачив'))}),
    ppl.length?el('span',{class:'mph-avs'},ppl.slice(0,3).map(x=>avatar(x))):el('span',{class:'mph-t',text:hm(c.at)}),
    ppl.length?svg('<path d="m9 6 6 6-6 6"/>'):null);
  const peopleList=withBack=>el('div',{class:'mpl'},withBack?el('button',{type:'button',class:'mpi mpl-back',onclick:()=>{menu.replaceChildren(...menuKids);menu.classList.remove('people');}},svg('<path d="M15 5l-7 7 7 7"/>'),el('span',{text:'Назад'})):null,
    ppl.map(x=>el('button',{type:'button',class:'mpi mpl-row',onclick:()=>{closeMsgPop();openPerson(x.id);}},avatar(x),el('span',{class:'grow',text:x.name}),rxOf[x.id]?el('span',{class:'mpl-e',text:rxOf[x.id]}):el('span',{class:'ticks seen'},svg(TICK2)))));
  let side=null;
  function showPeople(){if(!ppl.length)return;
    if(IS_TOUCH||innerWidth<700){menu.classList.add('people');menu.replaceChildren(peopleList(true));return;}
    if(side){side.remove();side=null;return;}
    side=el('div',{class:'mpop-m mpop-side'},peopleList(false));root.append(side);
    const mr=menu.getBoundingClientRect(),hr=head.getBoundingClientRect(),sw=side.offsetWidth,sh=side.offsetHeight;
    let x=mine?mr.left-sw-8:mr.right+8;if(x<8)x=mr.right+8;if(x+sw>innerWidth-8)x=Math.max(8,mr.left-sw-8);
    side.style.left=x+'px';side.style.top=Math.max(12,Math.min(innerHeight-12-sh,hr.top-6))+'px';}
  const items=[m?it(IC.reply,'Відповісти',()=>setReply(c)):null,
    c.text?it(IC.copy,'Копіювати',()=>copyText(c.text)):null,
    c.thumb?it(IC.pic,'Відкрити фото',()=>viewPhoto(c.photoId)):null,
    c.att?it('<path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M5 19h14"/>',c.att.kind==='video'?'Відкрити відео':'Відкрити файл',()=>openAtt(c.att)):null,
    canPin(roomOf(c))?it('<path d="M12 17v5"/><path d="M9 10.8V4h6v6.8l3 3.2v2H6v-2z"/>',c.pinned?'Відкріпити':'Закріпити',()=>write(()=>S.db.doc('chat/'+c.id).update(c.pinned?{pinned:null,pinnedAt:null}:{pinned:true,pinnedAt:Date.now(),pinnedBy:S.myId}),c.pinned?'Відкріплено':'Закріплено')):null,
    mine&&c.text!=null?it(IC.edit,'Змінити',()=>editMsg(c)):null,
    ].filter(Boolean);
  const delItem=mine?it(IC.del,'Видалити',()=>delMsg(c),true):null;
  const myR=m&&(c.reactions||{})[m.id];
  const rbtn=(e,i)=>el('button',{type:'button',class:'rpk'+(myR===e?' on':''),style:'animation-delay:'+(i*20)+'ms','aria-label':'Реакція '+e,onclick:()=>{closeMsgPop();toggleReact(c,e);}},e);
  let bar=null;
  if(m){const more=el('button',{type:'button',class:'rpk-more','aria-label':'Більше реакцій',onclick:()=>{bar.classList.add('open');more.remove();bar.append(...REACTS_MORE.filter(e=>!REACTS.slice(0,6).includes(e)).map((e,i)=>rbtn(e,i)));place();}},svg('<path d="m6 9 6 6 6-6"/>'));
    bar=el('div',{class:'mpop-r',role:'group','aria-label':'Реакції'},REACTS.slice(0,6).map(rbtn),more);}
  const menuKids=[...items,el('div',{class:'mpsep'}),head,delItem?el('div',{class:'mpsep'}):null,delItem].filter(Boolean);
  const menu=el('div',{class:'mpop-m',role:'menu'},menuKids);
  const ghost=el('div',{class:'msg mpop-ghost'+(mine?' mine':'')});const g=b.cloneNode(true);g.classList.remove('press','pop');g.removeAttribute('tabindex');ghost.append(g);
  ghost.style.cssText='left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px';g.style.width=r.width+'px';
  const root=el('div',{id:'mpopRoot',class:'mpop-root'+(mine?' mine':'')},el('div',{class:'mpop-bg',onclick:closeMsgPop,oncontextmenu:e=>{e.preventDefault();closeMsgPop();}}),ghost,bar,menu);
  document.body.append(root);
  const G=8,T0=14+(window.visualViewport?0:0),B0=H-14;
  function place(){
    const bh=bar?bar.offsetHeight:0,bw=bar?bar.offsetWidth:0,mh=menu.offsetHeight,mw=menu.offsetWidth;
    const gh=Math.min(r.height,Math.max(80,B0-T0-bh-mh-2*G));
    // stack: bar / message / menu — always in this order, like Telegram
    let gt=r.top;const need=(bh?bh+G:0)+gh+G+mh;
    if(gt-(bh?bh+G:0)<T0)gt=T0+(bh?bh+G:0);
    if(gt+gh+G+mh>B0)gt=B0-mh-G-gh;
    if(gt-(bh?bh+G:0)<T0&&need>B0-T0)gt=T0+(bh?bh+G:0);
    const scale=gh<r.height?gh/r.height:1;
    ghost.style.transformOrigin=(mine?'right':'left')+' top';
    requestAnimationFrame(()=>{ghost.style.transform='translateY('+(gt-r.top)+'px)'+(scale<1?' scale('+scale+')':'');});
    const hx=w=>mine?Math.max(8,Math.min(W-8-w,r.right-w)):Math.max(8,Math.min(W-8-w,r.left));
    if(bar){bar.style.left=hx(bw)+'px';bar.style.top=(gt-bh-G)+'px';bar.style.transformOrigin=(mine?'right':'left')+' bottom';}
    menu.style.left=hx(mw)+'px';menu.style.top=Math.min(B0-mh,gt+gh+G)+'px';menu.style.transformOrigin=(mine?'right':'left')+' top';}
  place();
  document.addEventListener('keydown',msgPopKey);
  const sc=document.getElementById('scroller');if(sc)sc.addEventListener('scroll',closeMsgPop,{passive:true});
  const f=bar?bar.querySelector('button'):menu.querySelector('button');if(f&&!IS_TOUCH)f.focus({preventScroll:true});
}
const REACTS=['👍','❤️','🔥','😂','😮','😢','👏','✅'];
const REACTS_MORE=['👏','✅','👀','🤝','🙏','💪','🏆','🤯','🥰','👌','🫡','🤔','💯'];
function toggleReact(c,emo){const m=myStaff();if(!m){toast('Спершу підтвердіть своє ім’я');return;}
  const cur=(c.reactions||{})[m.id];write(()=>S.db.doc('chat/'+c.id).update({reactions:{[m.id]:cur===emo?null:emo}}));}
function reactRow(c){const r=c.reactions||{};const m=myStaff();const groups={};
  Object.entries(r).forEach(([sid,e])=>{if(e){(groups[e]=groups[e]||[]).push(sid);}});
  const keys=Object.keys(groups);if(!keys.length)return null;
  return el('div',{class:'reacts'},keys.map(e=>{const mineR=m&&groups[e].includes(m.id);const names=groups[e].map(id=>(staffById(id)||{}).name).filter(Boolean).join(', ');
    return chipWho(el('button',{type:'button',class:'rchip'+(mineR?' mine':''),'aria-label':e+' '+groups[e].length+': '+names,onclick:ev=>{ev.stopPropagation();toggleReact(c,e);}},el('span',{class:'re',text:e}),groups[e].length<=3?el('span',{class:'ravs'},groups[e].map(id=>staffById(id)).filter(Boolean).map(x=>avatar(x))):el('span',{text:String(groups[e].length)})),e,groups[e]);}));}
function chipWho(b,emo,ids){let t=null;const show=()=>{t=null;closeChipPop();const ppl=ids.map(staffById).filter(Boolean);if(!ppl.length)return;
    const r=b.getBoundingClientRect();const pop=el('div',{class:'chip-pop',id:'chipPop'},ppl.map(x=>el('button',{type:'button',class:'cp-row',onclick:()=>{closeChipPop();openPerson(x.id);}},avatar(x),el('span',{class:'grow',text:x.name}),el('span',{class:'cp-e',text:emo}))));
    document.body.append(pop);const w=pop.offsetWidth,h=pop.offsetHeight;let x=r.left+r.width/2-w/2;x=Math.max(8,Math.min(innerWidth-8-w,x));let y=r.top-h-8;if(y<10)y=r.bottom+8;
    pop.style.left=x+'px';pop.style.top=y+'px';
    pop.addEventListener('mouseleave',()=>{t=setTimeout(closeChipPop,250);});pop.addEventListener('mouseenter',()=>clearTimeout(t));
    setTimeout(()=>document.addEventListener('pointerdown',chipOutside,true),0);const sc=document.getElementById('scroller');if(sc)sc.addEventListener('scroll',closeChipPop,{passive:true,once:true});};
  if(!IS_TOUCH){b.addEventListener('mouseenter',()=>{clearTimeout(t);t=setTimeout(show,380);});b.addEventListener('mouseleave',()=>{clearTimeout(t);t=setTimeout(closeChipPop,260);});}
  else{let lp=false;b.addEventListener('touchstart',e=>{e.stopPropagation();lp=false;t=setTimeout(()=>{lp=true;if(navigator.vibrate)try{navigator.vibrate(10);}catch(_){}show();},420);},{passive:true});
    b.addEventListener('touchmove',()=>clearTimeout(t),{passive:true});b.addEventListener('touchend',e=>{clearTimeout(t);if(lp){e.preventDefault();e.stopPropagation();}},{passive:false});
    b.addEventListener('click',e=>{if(lp){e.stopImmediatePropagation();e.preventDefault();lp=false;}},true);}
  return b;}
function chipOutside(e){const p=document.getElementById('chipPop');if(p&&!p.contains(e.target))closeChipPop();}
function closeChipPop(){const p=document.getElementById('chipPop');if(p)p.remove();document.removeEventListener('pointerdown',chipOutside,true);}
function setReply(c){S.replyTo={id:c.id,staffId:c.staffId,text:(c.text||(c.att?(c.att.kind==='video'?'🎬 Відео':'📎 '+c.att.name):'Фото')).slice(0,140)};if(S.drawReply)S.drawReply();const ta=document.getElementById('chatText');if(ta)ta.focus();}
function jumpTo(id){const n=document.getElementById('m-'+id);if(!n){toast('Повідомлення вже немає в історії');return;}n.scrollIntoView({behavior:'smooth',block:'center'});n.classList.remove('flash');void n.offsetWidth;n.classList.add('flash');}
function msgSheet(c,mine){
  const rd=readersOf(c);const all=sortedStaff().filter(x=>x.id!==c.staffId&&x.userId);
  const notYet=all.filter(x=>!rd.includes(x));
  const kids=[el('h2',{text:mine?'Ваше повідомлення':'Повідомлення'}),
    c.text?el('p',{class:'muted',style:'margin:0;white-space:pre-wrap;overflow-wrap:anywhere',text:c.text.length>160?c.text.slice(0,160)+'…':c.text}):null,
    el('div',{class:'stack',style:'gap:8px'},el('b',{text:'Переглянули ('+rd.length+')'}),
      rd.length?el('div',{class:'readers'},rd.map(x=>plink(x,[avatarP(x),el('span',{text:x.name}),el('span',{class:'ticks seen'},svg(TICK2))],'reader'))):el('span',{class:'muted small',text:'Ще ніхто не переглянув'}),
      notYet.length?el('span',{class:'muted small',text:'Ще не бачили: '+notYet.map(x=>x.name).join(', ')}):null)];
  if(myStaff()){const myR=(c.reactions||{})[myStaff().id];
    kids.splice(1,0,el('div',{class:'rbarx',role:'group','aria-label':'Реакції'},REACTS.map(e=>el('button',{type:'button',class:'rpick'+(myR===e?' on':''),'aria-label':'Реакція '+e,onclick:()=>{closeSheet();toggleReact(c,e);}},e))),
      el('button',{class:'btn',type:'button',onclick:()=>{closeSheet();setReply(c);}},'↩ Відповісти'));}
  const rx=Object.entries(c.reactions||{}).filter(([,e])=>e);
  if(rx.length)kids.push(el('div',{class:'stack',style:'gap:6px'},el('b',{text:'Реакції ('+rx.length+')'}),el('div',{class:'readers'},rx.map(([sid,e])=>{const x=staffById(sid);return x?plink(x,[avatarP(x),el('span',{text:x.name}),el('span',{style:'font-size:20px',text:e})],'reader'):null;}))));
  if(mine)kids.push(el('div',{class:'row'},
    c.text!=null?el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>editMsg(c)},'Редагувати'):null,
    el('button',{class:'btn danger',type:'button',onclick:()=>delMsg(c)},'Видалити')));
  kids.push(el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));
  openSheet(...kids);
}
function editMsg(c){
  const ta=el('textarea',{id:'editMsg',maxlength:'2000'});ta.value=c.text||'';
  openSheet(el('h2',{text:'Редагувати повідомлення'}),el('label',{for:'editMsg'},'Текст',ta),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const t=ta.value.trim();if(!t&&!c.thumb){toast('Повідомлення не може бути порожнім');return;}
      closeSheet();write(()=>S.db.doc('chat/'+c.id).update({text:t,edited:true,editedAt:Date.now()}),'Змінено');}},'Зберегти'),
      el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
  if(!IS_TOUCH)ta.focus();
}
function delMsg(c){confirmSheet('Видалити це повідомлення для всіх?','Видалити',()=>write(async()=>{await S.db.doc('chat/'+c.id).delete();if(c.photoId)await S.db.doc('photos/'+c.photoId).delete();if(c.att&&S.assets)await S.assets.delete(c.att.id).catch(()=>{});},'Повідомлення видалено'));}
