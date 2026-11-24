// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: chat attachments (paperclip)

/* ---------- chat attachments (paperclip) ---------- */
const I_CLIP='<path d="M20.5 11.5 12.4 19.6a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/>';
const ATT_TYPES={pdf:'application/pdf',txt:'text/plain',csv:'text/csv',md:'text/markdown',json:'application/json',mp4:'video/mp4',webm:'video/webm',mov:'video/mp4',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp'};
function attType(f){const ok=['application/pdf','text/plain','text/csv','text/markdown','application/json','video/mp4','video/webm','image/png','image/jpeg','image/gif','image/webp'];
  if(ok.includes(f.type))return f.type;const ext=(f.name.split('.').pop()||'').toLowerCase();if(f.type==='video/quicktime'||ext==='mov')return 'video/mp4';return ATT_TYPES[ext]||null;}
const ATT_LIM={video:10,file:5,total:100};
let _usage={t:0,u:null};
async function assetUsage(force){if(!S.assets)return null;if(!force&&_usage.u&&Date.now()-_usage.t<60000)return _usage.u;try{const r=await S.assets.list();_usage={t:Date.now(),u:r.usage,list:r.assets};return r.usage;}catch(e){return _usage.u;}}
function fmtSize(b){return b>1048576?(b/1048576).toFixed(1)+' МБ':Math.max(1,Math.round(b/1024))+' КБ';}
function extOf(n){return ((n||'').split('.').pop()||'файл').slice(0,4).toUpperCase();}
function openAtt(a){const u='/_blob/'+a.id;const w=window.open(u,'_blank','noopener');if(!w){const l=el('a',{href:u,download:a.name||'file',target:'_blank'});document.body.append(l);l.click();l.remove();}}
function fileCard(a){const ext=extOf(a.name);const col={PDF:'#D9534F',TXT:'#5B7178',CSV:'#2E8B5E',MD:'#3E7CB1',JSON:'#8A5A9E'}[ext]||'#1F6F78';
  return el('a',{class:'filecard',href:'/_blob/'+a.id,target:'_blank',rel:'noopener',download:a.name||'file',onclick:e=>e.stopPropagation(),ondblclick:e=>e.stopPropagation()},
    el('span',{class:'fc-ic',style:'background:'+col},svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'),el('b',{text:ext})),
    el('span',{class:'fc-t'},el('b',{text:a.name||'Файл'}),el('span',{text:fmtSize(a.size||0)+' · відкрити'})));}
function closeAttach(){const r=document.getElementById('attRoot');if(!r)return;r.classList.add('out');r.id='';document.querySelectorAll('.composer .clip').forEach(b=>b.classList.remove('open'));
  document.removeEventListener('keydown',attEsc);document.removeEventListener('pointerdown',attOutside,true);setTimeout(()=>r.remove(),200);}
function attEsc(e){if(e.key==='Escape')closeAttach();}
function attOutside(e){const r=document.getElementById('attRoot');if(!r)return;if(r.contains(e.target)||e.target.closest('.composer .clip'))return;closeAttach();}
function attachMenu(anchor,pickFn){if(document.getElementById('attRoot')){closeAttach();return;}
  const can=!!S.assets;
  const opt=(cls,ic,l,sub,fn,dis,i)=>el('button',{type:'button',class:'att-o '+cls,style:'animation-delay:'+(40+i*45)+'ms',disabled:dis?true:null,onclick:()=>{closeAttach();fn();}},el('span',{class:'att-i'},svg(ic)),el('span',{class:'att-l'},el('b',{text:l}),sub?el('small',{text:sub}):null));
  const card=el('div',{class:'att-card',role:'menu','aria-label':'Прикріпити'},
    opt('o1','<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>','Галерея',can?'фото · відео до '+ATT_LIM.video+' МБ':'фото',()=>pickFn(can?'image/*,video/*':'image/*',false),false,0),
    opt('o2','<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>','Камера','зробити фото',()=>pickFn('image/*',true),false,1),
    opt('o3','<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>','Файл',can?'PDF, TXT, CSV до '+ATT_LIM.file+' МБ':'потрібен доступ «Редактор»',()=>pickFn('.pdf,.txt,.csv,.md,.json,application/pdf,text/plain,text/csv',false),!can,2));
  const root=el('div',{id:'attRoot',class:'att-root'},card);document.body.append(root);
  const r=anchor.getBoundingClientRect();card.style.left=Math.max(8,r.left)+'px';card.style.bottom=(innerHeight-r.top+10)+'px';
  anchor.classList.add('open');
  document.addEventListener('keydown',attEsc);setTimeout(()=>document.addEventListener('pointerdown',attOutside,true),0);
  let sy=null;card.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;},{passive:true});card.addEventListener('touchmove',e=>{if(sy!=null&&e.touches[0].clientY-sy>40){sy=null;closeAttach();}},{passive:true});
  const sc=document.getElementById('scroller');if(sc)sc.addEventListener('scroll',closeAttach,{passive:true,once:true});}
function buildComposer(){
  const root=document.getElementById('composer');
  const prev=el('div',{class:'prev',hidden:true});
  const ta=el('textarea',{id:'chatText',rows:'1',placeholder:'Повідомлення…',maxlength:'2000','aria-label':'Повідомлення'});
  const pop=el('div',{class:'mpop',role:'listbox','aria-label':'Кого згадати',hidden:true});
  let mq=null;
  const closePop=()=>{pop.hidden=true;mq=null;};
  const pick=x=>{const pos=ta.selectionStart;const before=ta.value.slice(0,pos).replace(/@([^\s@]*)$/,'@'+x.name+' ');ta.value=before+ta.value.slice(pos);ta.focus();ta.setSelectionRange(before.length,before.length);closePop();};
  const showPop=()=>{const pos=ta.selectionStart;const mm=ta.value.slice(0,pos).match(/(^|\s)@([^\s@]*)$/);if(!mm){closePop();return;}
    mq=mm[2].toLowerCase();const me=myStaff();const list=sortedStaff().filter(x=>(!me||x.id!==me.id)&&x.name.toLowerCase().includes(mq)).slice(0,8);
    if(!list.length){closePop();return;}
    pop.replaceChildren(...list.map(x=>el('button',{type:'button',role:'option',class:'mopt',onmousedown:e=>e.preventDefault(),onclick:()=>pick(x)},avatarP(x),el('span',{class:'nm2',text:x.name}),roleTag(x.role))));pop.hidden=false;};
  ta.addEventListener('input',()=>{ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,120)+'px';showPop();});
  ta.addEventListener('click',showPop);
  const atBtn=el('button',{class:'iconbtn',type:'button','aria-label':'Згадати людину'},el('span',{style:'font-weight:800;font-size:20px',text:'@'}));
  atBtn.addEventListener('click',()=>{const pos=ta.selectionStart??ta.value.length;const pre=ta.value.slice(0,pos);const ins=(pre&&!/\s$/.test(pre)?' ':'')+'@';ta.value=pre+ins+ta.value.slice(pos);ta.focus();const np=pos+ins.length;ta.setSelectionRange(np,np);showPop();});
  const file=el('input',{type:'file',multiple:true,style:'display:none','aria-hidden':'true'});
  const pic=el('button',{class:'iconbtn clip',type:'button','aria-label':'Прикріпити','aria-haspopup':'menu'},svg(I_CLIP));
  pic.addEventListener('click',()=>attachMenu(pic,(accept,cam)=>{file.accept=accept;if(cam)file.setAttribute('capture','environment');else file.removeAttribute('capture');file.click();}));
  const send=el('button',{class:'iconbtn send',type:'button','aria-label':'Надіслати'},svg('<path d="M4 12 20 4l-6 16-3-7z"/>'));
  S.pend=S.pend||[];
  const showPrev=()=>{const P=S.pend;if(!P.length){prev.hidden=true;prev.replaceChildren();setTimeout(fitChatPad,0);return;}prev.hidden=false;
    prev.replaceChildren(el('div',{class:'att-strip'},P.map((x,i)=>el('span',{class:'att-chip '+x.kind},
      x.kind==='photo'?el('img',{src:x.url,alt:''}):x.kind==='video'?el('video',{src:x.url,muted:true,playsinline:true}):el('span',{class:'fc-ic sm'},el('b',{text:extOf(x.file.name)})),
      x.kind!=='photo'?el('span',{class:'att-n',text:x.file.name}):null,
      el('button',{type:'button',class:'att-x','aria-label':'Прибрати',onclick:()=>{P.splice(i,1);showPrev();}},'×')))),
      el('span',{class:'muted small att-cnt',text:P.length===1?'1 вкладення':P.length+' вкладень'}));setTimeout(fitChatPad,0);};
  file.addEventListener('change',()=>{const P=S.pend;for(const f of file.files){if(P.length>=10){toast('Не більше 10 вкладень за раз');break;}
      const t=attType(f);const isImg=/^image\//.test(f.type)||/^image\//.test(t||'');
      if(isImg){P.push({kind:'photo',file:f,url:URL.createObjectURL(f)});continue;}
      if(!S.assets){toast('Відео й файли можуть надсилати люди з доступом «Редактор»');continue;}
      if(!t){toast('Файл «'+f.name+'» не підтримується. Можна: фото, відео MP4, PDF, TXT, CSV');continue;}
      const kind=/^video\//.test(t)?'video':'file';const lim=ATT_LIM[kind];if(f.size>lim*1048576){toast('«'+f.name+'» більший за '+lim+' МБ'+(kind==='video'?' — обріжте або стисніть відео':''));continue;}
      P.push({kind,file:f,type:t,url:URL.createObjectURL(f)});}
    file.value='';showPrev();});
  const doSend=async()=>{
    const m=myStaff();const text=ta.value.trim();const P=S.pend||[];if(!m||(!text&&!P.length))return;
    send.disabled=true;S.chatStick=true;S.belowNew=0;
    try{
      const mentions=mentionsIn(text);
      const items=P.length?P.slice():[null];let first=true;
      const big=P.filter(x=>x.kind!=='photo').reduce((a,x)=>a+x.file.size,0);
      if(big){const u=await assetUsage(true);if(u){const max=Math.min(u.maxBytes||Infinity,ATT_LIM.total*1048576);if(u.bytes+big>max){send.disabled=false;toast('Сховище файлів заповнене: '+fmtSize(u.bytes)+' з '+fmtSize(max)+'. Попросіть Dev очистити старі файли в профілі.');return;}}}
      if(P.length)send.classList.add('busy');
      for(const x of items){const msg={...(curRoom()!==MAIN?{room:curRoom()}:{}),by:S.myId,staffId:m.id,text:first?text:'',mentions:first?mentions:[],at:Date.now(),photoId:null,thumb:null,att:null,replyTo:first?(S.replyTo||null):null};
        if(x&&x.kind==='photo'){const img=await loadImg(x.file);const full=shrinkFit(img);msg.thumb=shrink(img,480,0.65);
          const ref=await S.db.collection('photos').add({taskId:null,img:full,by:S.myId,at:Date.now()});msg.photoId=ref.id;}
        else if(x){const r=await S.assets.upload(x.file,{type:x.type});_usage.t=0;msg.att={id:r.id,kind:x.kind,name:x.file.name.slice(0,120),size:r.sizeBytes||x.file.size,type:r.contentType||x.type};}
        await S.db.collection('chat').add(msg);first=false;}
      send.classList.remove('busy');closePop();
      if(mentions.length)notifyMention(text,mentions);
      ta.value='';ta.style.height='';S.pend=[];showPrev();S.replyTo=null;drawReply();S.chatStick=true;
    }catch(e){send.classList.remove('busy');toast(e&&e.code==='quota_exceeded'?'База заповнена: видаліть старі повідомлення.':(e&&e.code==='too_large'?'Файл завеликий (до 20 МБ)':(e&&e.code==='unsupported_type'?'Такий тип файлу не підтримується':(e&&e.code==='quota_or_state'?'Сховище файлів заповнене':'Не вдалося надіслати. Спробуйте ще раз.'))));}
    send.disabled=false;
  };
  send.addEventListener('click',doSend);
  ta.addEventListener('keydown',e=>{if(!pop.hidden&&e.key==='Escape'){closePop();return;}if(!pop.hidden&&e.key==='Enter'){const f=pop.querySelector('button');if(f){e.preventDefault();f.click();return;}}if(e.key==='Enter'&&!e.shiftKey&&window.matchMedia('(pointer:fine)').matches){e.preventDefault();doSend();}});
  const rbar=el('div',{class:'rbar',hidden:true});
  const drawReply=()=>{const r=S.replyTo;if(!r){rbar.hidden=true;rbar.replaceChildren();return;}const w=staffById(r.staffId);rbar.hidden=false;
    rbar.replaceChildren(svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v4"/>'),el('div',{class:'rq'},el('b',{text:'Відповідь '+(w?w.name:'')}),el('span',{text:r.text})),
      el('button',{type:'button',class:'iconbtn sm','aria-label':'Скасувати відповідь',onclick:()=>{S.replyTo=null;drawReply();}},'×'));};
  S.drawReply=drawReply;
  root.replaceChildren(pop,rbar,prev,el('div',{class:'in'},pic,atBtn,ta,send),file);
  [send,atBtn].forEach(b=>b.addEventListener('pointerdown',e=>{if(document.activeElement===ta)e.preventDefault();}));
  const vv=window.visualViewport;
  const place=()=>{if(!document.body.classList.contains('kb')||!vv){root.style.bottom='';return;}
    const gap=Math.max(0,window.innerHeight-vv.height-vv.offsetTop);root.style.bottom=gap+'px';};
  ta.addEventListener('focus',()=>{if(!IS_TOUCH)return;document.body.classList.add('kb');place();setTimeout(()=>{place();const e=SC();e.scrollTop=e.scrollHeight;},250);});
  ta.addEventListener('blur',()=>{setTimeout(()=>{if(document.activeElement!==ta){document.body.classList.remove('kb');root.style.bottom='';}},150);});
  if(vv){vv.addEventListener('resize',place);vv.addEventListener('scroll',place);}
}
