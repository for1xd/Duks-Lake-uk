// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Розваги: «Політ каченяти» (flappy)

/* ---------- Розваги: «Політ каченяти» (flappy) ---------- */
const GAMES=[{id:'surf',name:'Каченя-серфер',desc:'Мчи каналом на дошці: свайпай між доріжками, стрибай через колоди, пірнай під гілки та збирай хробачків.',unit:'м',short:'Серфер'},{id:'flappy',name:'Політ каченяти',desc:'Тапай, щоб каченя злітало. Пролітай між очеретом і збирай хробачків.',unit:'',short:'Політ'}];
function gameRow(g,sid){return S.games.find(x=>x.game===g&&x.staffId===sid)||null;}
function viewFun(){const out=[];const m=myStaff();S.funGame=S.funGame||'surf';if(S.funGame==='poker'&&!canPoker())S.funGame='surf';const g=GAMES.find(x=>x.id===S.funGame)||GAMES[0];S.funTab=S.funTab||'best';
  const pkBtn=canPoker()?el('button',{type:'button',class:'gp-c gp-poker','aria-pressed':String(S.funGame==='poker'),onclick:()=>{S.funGame='poker';render();}},el('span',{class:'gp-ic pk-ic',text:'♠'}),el('span',{class:'gp-t'},el('b',{text:'Покер'}),el('small',{text:PK_COIN+' '+pkCoins(m?pkWal(m.id).bal:0)})),el('span',{class:'gp-new',text:'NEW'}),psMyPending()?el('span',{class:'gp-cnt',title:'Нагороди батл пасу',text:String(psMyPending())}):null):null;
  if(S.funGame==='poker'&&S.pkTab){out.push(...viewPoker());return out;}
  if(S.funGame==='poker'){out.push(el('div',{class:'gpick'},GAMES.map(x=>el('button',{type:'button',class:'gp-c gp-'+x.id,'aria-pressed':'false',onclick:()=>{S.funGame=x.id;render();}},el('span',{class:'gp-ic'},x.id==='surf'?surfIcon():duckArt(document.documentElement.classList.contains('hw'),{fly:true,wing:'up'})),el('span',{class:'gp-t'},el('b',{text:x.name}),el('small',{text:x.short||''})))),pkBtn));out.push(...viewPoker());return out;}
  out.push(el('div',{class:'gpick'},pkBtn,GAMES.map(x=>{const r=m?gameRow(x.id,m.id):null;return el('button',{type:'button',class:'gp-c gp-'+x.id,'aria-pressed':String(x.id===g.id),onclick:()=>{S.funGame=x.id;render();}},
    el('span',{class:'gp-ic'},x.id==='surf'?surfIcon():duckArt(document.documentElement.classList.contains('hw'),{fly:true,wing:'up'})),el('span',{class:'gp-t'},el('b',{text:x.name}),el('small',{text:r?'рекорд '+(r.best||0)+(x.unit?' '+x.unit:''):'ще не грав'})),x.id==='surf'?el('span',{class:'gp-new',text:'NEW'}):null);})));
  const rows=S.games.filter(x=>x.game===g.id);const mine=m?gameRow(g.id,m.id):null;
  const HW=document.documentElement.classList.contains('hw');
  if(g.id==='surf'){out.push(surfHero(g,mine));}else{
  const flyDuck=el('span',{class:'gh-duck'},el('span',{class:'f1'},duckArt(HW,{fly:true,wing:'up'})),el('span',{class:'f2'},duckArt(HW,{fly:true,wing:'down'})),el('i',{class:'gh-trail'}));
  const reeds=[[8,92],[34,64],[58,110],[86,78],[114,96]].map(([x,h],i)=>el('span',{class:'gh-rd',style:'left:'+x+'px;height:'+h+'px;animation-delay:-'+(i*.7)+'s'},HW&&i%2===0?el('span',{class:'gh-pk'},pumpkinArt()):null));
  const hero=el('section',{class:'game-hero'+(HW?' hw':'')},
    el('span',{class:'gh-sky','aria-hidden':'true'}),HW?el('span',{class:'gh-moon','aria-hidden':'true'}):el('span',{class:'gh-sun','aria-hidden':'true'}),
    el('span',{class:'gh-cloud c1','aria-hidden':'true'}),el('span',{class:'gh-cloud c2','aria-hidden':'true'}),
    HW?el('span',{class:'gh-bats','aria-hidden':'true'},[1,2,3].map(i=>el('i',{class:'b'+i},svg('<path d="M12 8c-1.2-1.6-3-1.4-3.6.2-1-1.6-3.5-2-5.4-.8 1.6.7 2.4 2.3 2.2 3.8 1.3-.9 2.9-.7 3.6.5.4-1 1.4-1.4 2.2-1.2l1 1.5 1-1.5c.8-.2 1.8.2 2.2 1.2.7-1.2 2.3-1.4 3.6-.5-.2-1.5.6-3.1 2.2-3.8-1.9-1.2-4.4-.8-5.4.8C15 6.6 13.2 6.4 12 8z" fill="currentColor" stroke="none"/>')))):null,
    el('span',{class:'gh-water','aria-hidden':'true'}),
    el('div',{class:'gh-scene','aria-hidden':'true'},el('div',{class:'gh-reeds'},reeds),flyDuck,
      [0,1,2].map(i=>el('span',{class:'gh-wm w'+i},wormSvg()))),
    el('div',{class:'gh-txt'},el('span',{class:'gh-badge',text:HW?'🎃 Хелловін-версія':'Міні-гра'}),el('h2',{text:g.name}),el('p',{text:g.desc}),
      el('div',{class:'gh-me'},mine?[el('span',{class:'gh-chip'},el('b',{text:String(mine.best||0)}),'рекорд'),el('span',{class:'gh-chip'},wormSvg(),el('b',{text:String(mine.worms||0)})),el('span',{class:'gh-chip'},el('b',{text:String(mine.plays||0)}),'ігор')]:[el('span',{class:'gh-chip',text:'Ти ще не грав — стань першим!'})]),
      el('button',{class:'gh-play',type:'button',onclick:()=>openFlappy()},el('span',{class:'gh-pi'},svg('<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>')),'Грати')));
  out.push(hero);}
  out.push(el('div',{class:'seg full fun-seg'},[['best','Рекорди'],['worms','Хробачки'],['plays','Активність']].map(([k,l])=>el('button',{type:'button',class:'seg-b','aria-pressed':String(S.funTab===k),onclick:()=>{S.funTab=k;render();}},el('span',{text:l})))));
  const key=S.funTab;const sorted=rows.filter(r=>staffById(r.staffId)).sort((a,b)=>(b[key]||0)-(a[key]||0)||(a.bestAt||0)-(b.bestAt||0));
  out.push(sorted.length?el('div',{class:'card lb'},sorted.map((r,i)=>{const w=staffById(r.staffId);const me=m&&r.staffId===m.id;
      return el('div',{class:'lb-r'+(me?' me':'')+(i<3?' top t'+(i+1):'')},el('span',{class:'lb-n',text:i<3?['🥇','🥈','🥉'][i]:String(i+1)}),plink(w,[avatarP(w)]),
        el('span',{class:'lb-nm'},el('b',{text:w.name}),el('small',{text:key==='best'?(r.worms||0)+' хробачків · '+(r.plays||0)+' ігор':key==='worms'?'рекорд '+(r.best||0)+(g.unit?' '+g.unit:''):'рекорд '+(r.best||0)+(g.unit?' '+g.unit:'')+' · '+(r.worms||0)+' хроб.'})),
        el('span',{class:'lb-v'},key==='worms'?wormSvg():null,el('b',{text:String(r[key]||0)+(key==='best'&&g.unit?' '+g.unit:'')})));})):el('div',{class:'card empty'},el('p',{class:'muted',text:'Рейтинг порожній. Зіграй першим!'})));
  return out;}
function wormSvg(){const pts=[[7,25,3.6],[13,21.5,4.4],[19.5,23,5],[26,27,5.4],[33,26.5,5.8],[39.5,22,6.2],[45,17.5,6.6]];
  return artSvg(`<defs><radialGradient id="ID_w" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#FFD0DA"/><stop offset=".55" stop-color="#FF8FA6"/><stop offset="1" stop-color="#D9506E"/></radialGradient></defs>
${pts.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#ID_w)" stroke="#C2405E" stroke-opacity=".35" stroke-width=".9"/><ellipse cx="${x-r*.25}" cy="${y-r*.45}" rx="${r*.45}" ry="${r*.22}" fill="#fff" opacity=".45"/>`).join('')}
<circle cx="53" cy="14" r="8.6" fill="url(#ID_w)" stroke="#C2405E" stroke-opacity=".35" stroke-width=".9"/><ellipse cx="50" cy="9.5" rx="3.6" ry="1.8" fill="#fff" opacity=".5"/>
<circle cx="50.6" cy="13" r="2.5" fill="#fff"/><circle cx="56.4" cy="13" r="2.5" fill="#fff"/><circle cx="51.1" cy="13.4" r="1.35" fill="#2A1020"/><circle cx="56.9" cy="13.4" r="1.35" fill="#2A1020"/><circle cx="51.5" cy="12.8" r=".45" fill="#fff"/><circle cx="57.3" cy="12.8" r=".45" fill="#fff"/>
<path d="M51 17.6q2.6 2.2 5.2 0" stroke="#7A1E36" stroke-width="1.1" fill="none" stroke-linecap="round"/><ellipse cx="48.6" cy="17" rx="1.6" ry="1" fill="#FF5C80" opacity=".5"/><ellipse cx="59" cy="17" rx="1.6" ry="1" fill="#FF5C80" opacity=".5"/>`,'0 4 64 32');}
function svgImg(svgEl){return new Promise(res=>{svgEl.setAttribute('xmlns','http://www.w3.org/2000/svg');const vb=svgEl.getAttribute('viewBox').split(' ').map(Number);svgEl.setAttribute('width',vb[2]*4);svgEl.setAttribute('height',vb[3]*4);
  const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svgEl));const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=url;});}
async function openFlappy(){const m=myStaff();
  const cv=el('canvas',{class:'fl-cv'});const hud=el('div',{class:'fl-hud'});const panel=el('div',{class:'fl-panel',hidden:true});
  const close=()=>{stop=true;document.removeEventListener('keydown',key,true);root.remove();document.body.classList.remove('game-on');render();};
  const root=el('div',{class:'fl-root'+(document.documentElement.classList.contains('hw')?' hw':'')},cv,hud,panel,el('button',{class:'fl-x',type:'button','aria-label':'Вийти з гри',onclick:close},svg('<path d="M6 6l12 12M18 6 6 18"/>')));
  document.body.append(root);document.body.classList.add('game-on');
  const HW=document.documentElement.classList.contains('hw');
  const [duckI,duckU,duckD,wormI,pumpI]=await Promise.all([svgImg(duckArt(HW,{fly:true,wing:'mid'})),svgImg(duckArt(HW,{fly:true,wing:'up'})),svgImg(duckArt(HW,{fly:true,wing:'down'})),svgImg(wormSvg()),HW?svgImg(pumpkinArt()):Promise.resolve(null)]);
  let flapT=0;const stars=Array.from({length:40},()=>({x:Math.random(),y:Math.random()*.6,r:.5+Math.random()*1.3,p:Math.random()*6}));const bats=Array.from({length:4},(_,i)=>({x:Math.random(),y:.12+Math.random()*.3,k:.5+Math.random()*.6,p:i}));
  const ctx=cv.getContext('2d');let W=0,H=0,dpr=1;
  const size=()=>{dpr=Math.min(2,devicePixelRatio||1);W=root.clientWidth;H=root.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};size();addEventListener('resize',size);
  const row=m?gameRow('flappy',m.id):null;let best=row?row.best||0:0;
  let dtS=1,startT=0,st='ready',t0=performance.now(),last=t0,stop=false;let duck,pipes,score,worms,speed,parts,clouds,shake,flashT;
  const S0=()=>Math.min(W,H);
  function reset(){const s=S0()*0.12;duck={x:W*0.28,y:H*0.42,vy:0,r:s*0.42,s,rot:0};pipes=[];score=0;worms=0;speed=Math.max(2.4,W/170);parts=[];shake=0;flashT=0;
    clouds=Array.from({length:5},(_,i)=>({x:Math.random()*W,y:H*(0.06+Math.random()*0.32),k:.4+Math.random()*.6}));panel.hidden=true;drawHud();}
  reset();
  const groundH=()=>Math.max(56,H*0.13);
  function addPipe(){const gh=groundH();const gap=Math.max(duck.s*3.0,H*0.27-Math.min(score,25)*H*0.002);const minY=H*0.12+gap/2,maxY=H-gh-H*0.08-gap/2;
    const gy=minY+Math.random()*Math.max(10,maxY-minY);const p={x:W+40,gy,gap,w:duck.s*1.15,passed:false,worm:null};
    if(Math.random()<0.75)p.worm={y:gy+(Math.random()-.5)*gap*0.45,taken:false,ph:Math.random()*6};pipes.push(p);}
  function flap(){if(st==='over')return;if(st==='ready'){st='play';startT=performance.now();}duck.vy=-H*0.0106;flapT=1;for(let i=0;i<4;i++)parts.push({x:duck.x-duck.r*.6,y:duck.y+duck.r*.3,vx:-1-Math.random()*1.5,vy:Math.random()*1.5-.5,l:22,c:'rgba(255,255,255,.8)',r:2+Math.random()*2});}
  cv.addEventListener('pointerdown',e=>{e.preventDefault();flap();});
  const key=e=>{if(e.code==='Space'||e.key===' '||e.key==='ArrowUp'){e.preventDefault();if(st==='over')again();else flap();}else if(e.key==='Escape')close();};
  document.addEventListener('keydown',key,true);
  function drawHud(){hud.replaceChildren(el('span',{class:'fl-w'},wormSvg(),el('b',{text:String(worms)})),el('span',{class:'fl-s',text:String(score)}),el('span',{class:'fl-b',text:'рекорд '+best}));}
  async function over(){st='over';shake=12;flashT=1;if(navigator.vibrate)try{navigator.vibrate([30,40,30]);}catch(_){}
    const rec=score>best;if(rec)best=score;
    panel.hidden=false;panel.replaceChildren(el('div',{class:'fl-card'},rec&&score>0?el('span',{class:'fl-rec',text:'🏆 Новий рекорд!'}):null,el('span',{class:'eyebrow',text:'Гру закінчено'}),
      el('div',{class:'fl-res'},el('div',{},el('b',{text:String(score)}),el('small',{text:'очок'})),el('div',{},el('b',{},wormSvg(),String(worms)),el('small',{text:'хробачків'})),el('div',{},el('b',{text:String(best)}),el('small',{text:'рекорд'}))),
      el('button',{class:'btn',type:'button',onclick:again},'Ще раз'),el('button',{class:'btn ghost',type:'button',onclick:close},'До рейтингу')));
    if(m){const r=gameRow('flappy',m.id);const id='flappy_'+m.id;const data={game:'flappy',staffId:m.id,by:S.myId,best:Math.max(score,r?r.best||0:0),worms:(r?r.worms||0:0)+worms,plays:(r?r.plays||0:0)+1,last:Date.now()};
      if(!r||score>(r.best||0))data.bestAt=Date.now();
      if(r&&r.bestAt&&!data.bestAt)data.bestAt=r.bestAt;try{await S.db.doc('games/'+id).set(data);}catch(e){}}}
  function again(){reset();st='ready';}
  function hit(p){const cx=duck.x,cy=duck.y,r=duck.r*.82;if(cx+r<p.x||cx-r>p.x+p.w)return false;return cy-r<p.gy-p.gap/2||cy+r>p.gy+p.gap/2;}
  function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  const RC={};
  function reedSpr(w){const k=Math.round(w*10);if(RC[k])return RC[k];const d=dpr,pw=Math.ceil(w*d);
    const st=document.createElement('canvas');st.width=pw;st.height=4;const c=st.getContext('2d');const g=c.createLinearGradient(0,0,pw,0);
    if(HW){g.addColorStop(0,'#16301F');g.addColorStop(.35,'#3E6E43');g.addColorStop(.6,'#2C5535');g.addColorStop(1,'#11281A');}else{g.addColorStop(0,'#2A6E42');g.addColorStop(.35,'#6CC07A');g.addColorStop(.6,'#4E9E5E');g.addColorStop(1,'#215634');}
    c.fillStyle=g;c.fillRect(0,0,pw,4);c.fillStyle='rgba(255,255,255,.22)';c.fillRect(Math.round(pw*.22),0,Math.max(1,Math.round(d*1.5)),4);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(Math.round(pw*.68),0,Math.max(1,Math.round(d)),4);
    const cw=w*1.18,ch=w*1.7,cc=document.createElement('canvas');cc.width=Math.ceil(cw*d);cc.height=Math.ceil(ch*d);const x=cc.getContext('2d');x.scale(d,d);
    const cg=x.createLinearGradient(0,0,cw,0);cg.addColorStop(0,'#5A3015');cg.addColorStop(.38,'#B0743E');cg.addColorStop(.62,'#8A5328');cg.addColorStop(1,'#4A270F');
    x.fillStyle=cg;x.beginPath();x.ellipse(cw/2,ch/2,cw/2,ch/2-1,0,0,7);x.fill();
    x.fillStyle='rgba(60,30,10,.25)';for(let i=0;i<14;i++){x.beginPath();x.arc(cw*.2+((i*37)%10)/10*cw*.6,ch*.15+((i*53)%10)/10*ch*.7,Math.max(.8,w*.025),0,7);x.fill();}
    x.fillStyle='rgba(255,235,200,.28)';x.beginPath();x.ellipse(cw*.32,ch*.42,cw*.08,ch*.28,0,0,7);x.fill();
    return RC[k]={st,cc,cw,ch};}
  function reed(x,y,w,h,top){const R=reedSpr(w);ctx.drawImage(R.st,x,y,w,h);
    if(HW&&!top&&pumpI){const ps=w*1.45;ctx.drawImage(pumpI,x+w/2-ps/2,y-ps*.2,ps,ps);return;}
    const cy=top?y+h-R.ch*.62:y-R.ch*.38;ctx.drawImage(R.cc,x+w/2-R.cw/2,cy,R.cw,R.ch);}
  function frame(now){if(stop)return;const raw=Math.min(2.2,(now-last)/16.67);last=now;dtS=dtS*0.85+raw*0.15;const dt=dtS;const gh=groundH();
    if(st==='play'){duck.vy+=H*0.00062*dt;duck.y+=duck.vy*dt;speed=Math.min(W/95,Math.max(2.4,W/170)+score*0.06);
      if((!pipes.length&&now-startT>900)||(pipes.length&&pipes[pipes.length-1].x<W-Math.max(210,W*0.48)))addPipe();
      for(const p of pipes){p.x-=speed*dt;if(!p.passed&&p.x+p.w<duck.x){p.passed=true;score++;drawHud();}
        if(p.worm&&!p.worm.taken){const wx=p.x+p.w/2,wy=p.worm.y+Math.sin(now/300+p.worm.ph)*6;if(Math.hypot(wx-duck.x,wy-duck.y)<duck.r+14){p.worm.taken=true;worms++;drawHud();
          for(let i=0;i<14;i++)parts.push({x:wx,y:wy,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,l:30,c:i%2?'#FF9FB0':'#FFD166',r:2+Math.random()*3});parts.push({x:wx,y:wy-10,vx:0,vy:-1.2,l:40,txt:'+1'});}}
        if(hit(p)){over();break;}}
      pipes=pipes.filter(p=>p.x+p.w>-60);
      if(duck.y+duck.r>H-gh){duck.y=H-gh-duck.r;over();}if(duck.y-duck.r<0){duck.y=duck.r;duck.vy=0;}}
    else if(st==='ready'){duck.y=H*0.42+Math.sin(now/320)*8;}
    else if(st==='over'&&duck.y+duck.r<H-gh){duck.vy+=H*0.0009*dt;duck.y+=duck.vy*dt;}
    duck.rot=st==='ready'?Math.sin(now/400)*.08:Math.max(-.45,Math.min(1.2,duck.vy/(H*0.02)));
    // --- draw
    ctx.save();if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.85;if(shake<.5)shake=0;}
    const sky=ctx.createLinearGradient(0,0,0,H);if(HW){sky.addColorStop(0,'#140B24');sky.addColorStop(.5,'#3B1F55');sky.addColorStop(1,'#7A3326');}else{sky.addColorStop(0,'#7FCBD2');sky.addColorStop(.55,'#CFEDEB');sky.addColorStop(1,'#F4F1E4');}ctx.fillStyle=sky;ctx.fillRect(-20,-20,W+40,H+40);
    if(HW){for(const t of stars){ctx.globalAlpha=.4+.6*Math.abs(Math.sin(now/900+t.p));ctx.fillStyle='#FFF4D6';ctx.beginPath();ctx.arc(t.x*W,t.y*H,t.r,0,7);ctx.fill();}ctx.globalAlpha=1;}
    const sx=W*.8,sy=H*.16;const sg=ctx.createRadialGradient(sx,sy,4,sx,sy,H*.16);if(HW){sg.addColorStop(0,'rgba(255,240,200,.9)');sg.addColorStop(.25,'rgba(255,214,120,.35)');sg.addColorStop(1,'rgba(255,214,120,0)');}else{sg.addColorStop(0,'rgba(255,248,214,1)');sg.addColorStop(.3,'rgba(255,236,170,.85)');sg.addColorStop(1,'rgba(255,236,170,0)');}ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,H*.16,0,7);ctx.fill();
    if(HW){const mr=Math.min(W,H)*.07;const mg=ctx.createRadialGradient(sx-mr*.3,sy-mr*.3,mr*.1,sx,sy,mr);mg.addColorStop(0,'#FFF6DC');mg.addColorStop(1,'#E9C26E');ctx.fillStyle=mg;ctx.beginPath();ctx.arc(sx,sy,mr,0,7);ctx.fill();ctx.fillStyle='rgba(180,130,60,.25)';[[-.3,-.2,.22],[.25,.15,.16],[-.05,.35,.12]].forEach(([a,b,r])=>{ctx.beginPath();ctx.arc(sx+a*mr,sy+b*mr,r*mr,0,7);ctx.fill();});
      ctx.fillStyle='#0E0716';for(const b of bats){if(st==='play')b.x-=speed*.0006*b.k*dt;if(b.x<-.1)b.x=1.1;const bx=b.x*W,by=b.y*H+Math.sin(now/500+b.p)*10,sz=9*b.k+6,fl=Math.sin(now/90+b.p)*.6;ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx-sz*.6,by-sz*(.6+fl),bx-sz*1.4,by-sz*.2*fl);ctx.quadraticCurveTo(bx-sz*.8,by+sz*.1,bx,by+sz*.3);ctx.quadraticCurveTo(bx+sz*.8,by+sz*.1,bx+sz*1.4,by-sz*.2*fl);ctx.quadraticCurveTo(bx+sz*.6,by-sz*(.6+fl),bx,by);ctx.fill();}}
    for(const c of clouds){if(st==='play')c.x-=speed*.18*c.k*dt;if(c.x<-160)c.x=W+60;ctx.fillStyle=HW?'rgba(120,80,160,'+(0.18+c.k*.15)+')':'rgba(255,255,255,'+(0.55+c.k*.35)+')';const r=22*c.k+14;ctx.beginPath();ctx.arc(c.x,c.y,r,0,7);ctx.arc(c.x+r*.9,c.y-r*.35,r*.8,0,7);ctx.arc(c.x+r*1.8,c.y,r*.9,0,7);ctx.arc(c.x+r*.9,c.y+r*.25,r*.85,0,7);ctx.fill();}
    const off=(now*speed*.012)%400;ctx.fillStyle=HW?'#2A1840':'#9CCFB5';ctx.beginPath();ctx.moveTo(0,H-gh);for(let x=-400;x<=W+400;x+=40){ctx.lineTo(x-off*0.5,H-gh-30-Math.sin(x*.012)*22-Math.sin(x*.031)*10);}ctx.lineTo(W,H-gh);ctx.fill();
    ctx.fillStyle=HW?'#1A0F2A':'#6DB38E';ctx.beginPath();ctx.moveTo(0,H-gh);for(let x=-400;x<=W+400;x+=30){ctx.lineTo(x-off,H-gh-12-Math.abs(Math.sin(x*.05))*16);}ctx.lineTo(W,H-gh);ctx.fill();
    for(const p of pipes){const top=p.gy-p.gap/2,bot=p.gy+p.gap/2;const px=Math.round(p.x*dpr)/dpr;reed(px,-20,p.w,top+20,true);reed(px,bot,p.w,H-gh-bot+10,false);
      if(p.worm&&!p.worm.taken&&wormI){const wy=p.worm.y+Math.sin(now/300+p.worm.ph)*6;const ww=duck.s*.78,wh=ww*.6;ctx.save();ctx.translate(p.x+p.w/2,wy);if(HW){ctx.shadowColor='rgba(255,140,180,.8)';ctx.shadowBlur=14;}ctx.rotate(Math.sin(now/200+p.worm.ph)*.15);ctx.drawImage(wormI,-ww/2,-wh/2,ww,wh);ctx.restore();}}
    const wg=ctx.createLinearGradient(0,H-gh,0,H);if(HW){wg.addColorStop(0,'#3A2356');wg.addColorStop(1,'#120A1E');}else{wg.addColorStop(0,'#3FA3AC');wg.addColorStop(1,'#1F6F78');}ctx.fillStyle=wg;ctx.fillRect(-20,H-gh,W+40,gh+20);
    if(HW){const rg=ctx.createLinearGradient(sx-30,0,sx+30,0);rg.addColorStop(0,'rgba(255,214,120,0)');rg.addColorStop(.5,'rgba(255,214,120,.35)');rg.addColorStop(1,'rgba(255,214,120,0)');ctx.fillStyle=rg;for(let k=0;k<5;k++){const w2=60-k*10;ctx.fillRect(sx-w2/2+Math.sin(now/500+k)*4,H-gh+6+k*10,w2,3);}}
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();const yy=H-gh+12+k*16;for(let x=-40;x<W+40;x+=8){const xx=x-((now*speed*.03*(k+1))%40);ctx.lineTo(xx,yy+Math.sin((xx+k*20)*.08+now/400)*2.5);}ctx.stroke();}
    for(const q of parts){q.x+=(q.vx||0)*dt;q.y+=(q.vy||0)*dt;q.l-=dt;if(q.txt){ctx.globalAlpha=Math.max(0,q.l/40);ctx.fillStyle='#E5607A';ctx.font='800 20px Manrope,sans-serif';ctx.textAlign='center';ctx.fillText(q.txt,q.x,q.y);ctx.globalAlpha=1;}else{ctx.globalAlpha=Math.max(0,q.l/30);ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.fill();ctx.globalAlpha=1;}}
    parts=parts.filter(q=>q.l>0);
    if(duckI){const s=duck.s*1.3;flapT=Math.max(0,flapT-.07*dt);const ph=st==='ready'?Math.sin(now/120):(flapT>0?Math.sin(flapT*Math.PI*3):(duck.vy>0?-1:0));const img=ph>.33?duckU:ph<-.33?duckD:duckI;ctx.save();ctx.translate(duck.x,duck.y);ctx.rotate(duck.rot);const sq=st==='play'&&duck.vy<0?1+Math.min(.1,-duck.vy/(H*.12)):1;ctx.scale(1/sq,sq);ctx.drawImage(img||duckI,-s*.55,-s*.6,s,s);ctx.restore();}
    if(flashT>0){ctx.fillStyle='rgba(255,255,255,'+(flashT*.6)+')';ctx.fillRect(-20,-20,W+40,H+40);flashT-=.06*dt;}
    if(st==='ready'){ctx.fillStyle=HW?'rgba(255,240,220,.9)':'rgba(15,42,51,.75)';ctx.font='800 '+Math.round(Math.min(26,W/16))+'px Manrope,sans-serif';ctx.textAlign='center';ctx.fillText('Торкнись, щоб злетіти',W/2,H*0.66);
      ctx.font='600 15px Manrope,sans-serif';ctx.fillStyle=HW?'rgba(255,240,220,.6)':'rgba(15,42,51,.55)';ctx.fillText(IS_TOUCH?'тап — змах крилами':'пробіл або клік — змах крилами',W/2,H*0.66+26);}
    ctx.restore();requestAnimationFrame(frame);}
  requestAnimationFrame(frame);}
