// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Каченя-серфер

/* ---------- Каченя-серфер ---------- */
function surfIcon(){return artSvg(`<defs><linearGradient id="ID_sb" x1="0" x2="1"><stop offset="0" stop-color="#FF8A5B"/><stop offset="1" stop-color="#F2C14E"/></linearGradient><radialGradient id="ID_sd" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#C9F4F6"/><stop offset=".5" stop-color="#59C6CD"/><stop offset="1" stop-color="#1C7880"/></radialGradient></defs>
<path d="M8 92c18 10 86 10 104 0" stroke="#4FB3BC" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
<ellipse cx="60" cy="86" rx="40" ry="10" fill="url(#ID_sb)"/><path d="M26 86h68" stroke="#fff" stroke-width="3" opacity=".7"/>
<ellipse cx="60" cy="60" rx="24" ry="21" fill="url(#ID_sd)"/><ellipse cx="38" cy="58" rx="8" ry="14" fill="#1C7880" transform="rotate(25 38 58)"/><ellipse cx="82" cy="58" rx="8" ry="14" fill="#1C7880" transform="rotate(-25 82 58)"/>
<circle cx="60" cy="32" r="15" fill="url(#ID_sd)"/><path d="M57 18c2-6 8-7 10-3" stroke="#1C7880" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="54" cy="27" rx="4" ry="6" fill="#fff" opacity=".3"/>`);}
let _sfImgs={};
function surfImgs(HW){const k=HW?'h':'c';if(!_sfImgs[k])_sfImgs[k]=Promise.all([svgImg(wormSvg()),svgImg(duckArt(HW,{fly:true,wing:'mid'})),HW?svgImg(pumpkinArt()):Promise.resolve(null)]).then(([worm,duck,pump])=>({worm,duck,pump}));return _sfImgs[k];}
function surfEngine(cv,mode,hooks){hooks=hooks||{};const HW=document.documentElement.classList.contains('hw');const demo=mode==='demo';
  const ctx=cv.getContext('2d');let W=0,H=0,dpr=1,img={},stop=false,last=performance.now(),dtS=1/60;
  let bgReady=false,qMax=demo?1:Math.min(1.5,devicePixelRatio||1),lowQ=false,ftAcc=0,ftN=0;const bgC=document.createElement('canvas'),bgX=bgC.getContext('2d');const spr={};
  const size=()=>{dpr=qMax;const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=Math.max(1,Math.round(W*dpr));cv.height=Math.max(1,Math.round(H*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);if(bgReady)buildBg();};
  size();addEventListener('resize',size);surfImgs(HW).then(i=>{img=i;});
  const Z0=6.5,ZF=72;
  const L=()=>Math.min(W*(demo?0.2:0.27),H*0.3),hor=()=>H*(demo?0.42:0.36),Y0=()=>H*(demo?0.86:0.83);
  const P=z=>1/(1+Math.max(z,-3.2)/Z0),SX=(x,z)=>W/2+(demo?W*0.16:0)+x*L()*P(z),SY=z=>hor()+(Y0()-hor())*P(z);
  const C=HW?{sky:['#120A22','#3B1F55','#8A3A2A'],hill:'#24143A',hill2:'#170D26',water:['#4A2E6E','#1B1030'],bank:['#2A3B22','#14200F'],curb:'#4C3A5E',board:['#5B2E8C','#F28A1E'],b:['#FFD9A0','#F7A23C','#B04C0B'],w:'#9C3F08'}
    :{sky:['#6EC3CB','#BFE6E6','#F6EBD2'],hill:'#8CC7A6',hill2:'#6CB18C',water:['#7FD0D6','#1F7F88'],bank:['#7DC07A','#4E9A55'],curb:'#E8DCC0',board:['#FF8A5B','#F2C14E'],b:['#C9F4F6','#59C6CD','#1C7880'],w:'#155F67'};
  let G;const rnd=Math.random;
  function scen(z){const r=rnd();return {z,side:rnd()<.5?-1:1,x:2.15+rnd()*1.6,k:r<.42?'tree':r<.7?'reed':r<.85?'lamp':'bush',s:.85+rnd()*.5};}
  function reset(){G={st:demo?'play':'ready',t:0,dist:0,worms:0,speed:demo?12:11,lane:0,lp:0,jy:0,vy:0,dive:0,objs:[],parts:[],scen:[],rowZ:demo?10:20,row:0,fly:[],shield:0,magnet:0,x2:0,shake:0,flash:0,spin:0,clouds:Array.from({length:5},()=>({x:rnd(),y:.08+rnd()*.5,k:.5+rnd()*.6}))};
    for(let z=-2;z<ZF;z+=2.6)G.scen.push(scen(z));if(hooks.hud)hooks.hud(G);}
  reset();buildBg();buildSpr();bgReady=true;
  function addRow(z){G.row++;const lanes=[-1,0,1].sort(()=>rnd()-.5);const early=G.row<3;
    const nb=early?0:(rnd()<.28?2:rnd()<.55?1:0);const used={};
    for(let i=0;i<nb;i++){const l=lanes[i];G.objs.push({t:'block',lane:l,z,len:2.6+rnd()*1.6});used[l]=1;}
    for(const l of lanes.slice(nb)){if(early)break;const r=rnd();if(r<.26){G.objs.push({t:'low',lane:l,z});used[l]=1;}else if(r<.44&&G.row>5){G.objs.push({t:'high',lane:l,z});used[l]=1;}}
    const free=lanes.filter(l=>!used[l]);const wl=free.length?free[0]:lanes[nb]??0;
    const n=4+Math.floor(rnd()*3);for(let i=0;i<n;i++)G.objs.push({t:'worm',lane:wl,z:z-n*1.3+i*1.3,ph:rnd()*6});
    if(rnd()<.06&&free.length)G.objs.push({t:'gold',lane:free[free.length-1],z:z+3});
    else if(rnd()<.07&&G.row>4)G.objs.push({t:'pw',k:['magnet','shield','x2'][Math.floor(rnd()*3)],lane:lanes[2],z:z+4});}
  function input(a){if(demo)return;if(G.st==='ready'){G.st='play';if(hooks.start)hooks.start();}if(G.st!=='play')return;
    if(a==='l'&&G.lane>-1){G.lane--;splash(10);}else if(a==='r'&&G.lane<1){G.lane++;splash(10);}
    else if(a==='u'&&G.jy<0.05){G.vy=7.4;G.dive=0;splash(14);}else if(a==='d'){if(G.dive<=0)splash(16);G.dive=.75;if(G.jy>0.05)G.vy=-15;}}
  function splash(n){const p=P(0),x=SX(G.lp,0),y=SY(0);for(let i=0;i<n;i++)G.parts.push({x:x+(rnd()-.5)*L()*.5,y:y-2,vx:(rnd()-.5)*4,vy:-1.6-rnd()*3,g:.3,l:22+rnd()*10,r:1.6+rnd()*2.4*p,c:'rgba(255,255,255,.9)',w:1});}
  function burst(x,y,c,n){for(let i=0;i<n;i++){const a=rnd()*6.283,v=1.5+rnd()*3;G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,g:.08,l:16+rnd()*8,r:1.2+rnd()*2,c,w:1,wf:1.4});}}
  function die(){G.st='over';G.shake=16;G.flash=1;G.vy=6;G.spin=1;if(navigator.vibrate)try{navigator.vibrate([40,40,40]);}catch(_){}if(hooks.over)setTimeout(()=>hooks.over({dist:Math.floor(G.dist),worms:G.worms}),700);}
  function ai(){const ahead=G.objs.filter(o=>o.z>0.5&&o.z<10&&!o.dead);const blk=l=>ahead.some(o=>o.lane===l&&o.t==='block'&&o.z<8);
    if(blk(G.lane)){const opts=[-1,0,1].filter(l=>!blk(l)).sort((a,b)=>Math.abs(a-G.lane)-Math.abs(b-G.lane));if(opts.length)G.lane=opts[0];}
    for(const o of ahead){if(Math.abs(o.lane-G.lp)>.5)continue;if(o.t==='low'&&o.z<2.4&&G.jy<.05)G.vy=7.4;if(o.t==='high'&&o.z<2.6&&G.dive<=0)G.dive=.75;}}
  function update(dt){G.t+=dt;
    if(G.st==='play'){G.speed=Math.min(27,(demo?12:11)+G.t*.2);const dz=G.speed*dt;G.dist+=dz;
      for(const o of G.objs)o.z-=dz;for(const c of G.scen){c.z-=dz;if(c.z<-3)Object.assign(c,scen(c.z+ZF+3));}G.rowZ-=dz;
      while(G.rowZ<ZF){G.rowZ+=Math.max(10,G.speed*(1.02-Math.min(.32,G.dist/7000)));addRow(G.rowZ);}
      G.objs=G.objs.filter(o=>o.z+(o.len||0)>-3.5&&!o.gone);
      if(demo)ai();
      G.lp+=(G.lane-G.lp)*Math.min(1,dt*13);
      G.vy-=24*dt;G.jy=Math.max(0,G.jy+G.vy*dt);if(G.jy===0&&G.vy<0)G.vy=0;
      G.dive=Math.max(0,G.dive-dt);G.shield=Math.max(0,G.shield-dt);G.magnet=Math.max(0,G.magnet-dt);G.x2=Math.max(0,G.x2-dt);
      if(rnd()<.45)G.parts.push({x:SX(G.lp,0)+(rnd()<.5?-1:1)*L()*.18,y:SY(0)-1,vx:(rnd()-.5)*1.6,vy:-.5-rnd()*1.1,g:.12,l:16,r:1.2+rnd()*1.8,c:'rgba(255,255,255,.7)',w:1});
      for(const o of G.objs){if(o.dead)continue;
        if(G.magnet>0&&(o.t==='worm'||o.t==='gold')&&o.z<16&&o.z>0)o.lane+=(G.lp-o.lane)*Math.min(1,dt*7);
        const len=o.len||0;if(o.z>0.5||o.z+len<-0.4)continue;if(Math.abs(o.lane-G.lp)>(o.t==='worm'||o.t==='gold'?0.6:0.52))continue;
        const sx=SX(o.lane,Math.max(o.z,0)),sy=SY(Math.max(o.z,0));
        if(o.t==='worm'){o.dead=1;o.gone=1;G.worms+=G.x2>0?2:1;burst(sx,sy-L()*.35,'rgba(255,170,190,.9)',4);G.fly.push({x:sx,y:sy-L()*.38,t:0,k:'w'});continue;}
        if(o.t==='gold'){o.dead=1;o.gone=1;G.worms+=G.x2>0?20:10;burst(sx,sy-L()*.4,'#FFD166',16);for(let i=0;i<5;i++)G.fly.push({x:sx+(rnd()-.5)*20,y:sy-L()*.4,t:-i*.08,k:'g'});continue;}
        if(o.t==='pw'){o.dead=1;o.gone=1;G[o.k]=o.k==='shield'?12:9;burst(sx,sy-L()*.4,'#8FD6DC',20);if(hooks.hud)hooks.hud(G);continue;}
        const hit=o.t==='block'||(o.t==='low'&&G.jy<.42)||(o.t==='high'&&!(G.dive>0&&G.jy<.7));
        if(hit&&!demo){if(G.shield>0){G.shield=0;o.dead=1;o.gone=1;G.flash=.6;G.shake=8;burst(sx,sy-L()*.4,'#BFF0F3',26);if(hooks.hud)hooks.hud(G);}else{die();break;}}}
      if(hooks.hud&&(G._hd=(G._hd||0)+dt)>.12){G._hd=0;hooks.hud(G);}}
    else if(G.st==='over'){G.vy-=20*dt;G.jy=Math.max(-.2,G.jy+G.vy*dt);G.spin+=dt*9;}
    else{G.lp=Math.sin(G.t*1.4)*.08;}
    {const k=Math.min(3,dt*60),dr=(G.st==='play'?G.speed:0)*0.11*k*(H/700);for(const q of G.parts){q.x+=q.vx*k;q.y+=q.vy*k+(q.w?dr*(q.wf||1):0);q.vy+=(q.g||0)*k;q.vx*=Math.pow(.97,k);q.l-=k;}G.parts=G.parts.filter(q=>q.l>0);}
    if(G.st==='play'&&G.jy<=.04&&!(G.dive>0)){G.wk=G.wk||[];if((G._wt=(G._wt||0)+dt)>.07){G._wt=0;G.wk.push({lp:G.lp,a:0});}}
    if(G.wk){for(const w of G.wk)w.a+=dt;G.wk=G.wk.filter(w=>w.a<.9);}
    for(const f of G.fly){f.t+=dt*2.4;if(f.t>=1&&!f.done){f.done=1;if(hooks.hud)hooks.hud(G,true);}}G.fly=G.fly.filter(f=>!f.done);}
  /* ---- drawing ---- */
  function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  function buildBg(){const h=Math.ceil(hor())+2;bgC.width=Math.max(1,Math.round(W*dpr));bgC.height=Math.max(1,Math.round(h*dpr));const c=bgX;c.setTransform(dpr,0,0,dpr,0,0);
    const sk=c.createLinearGradient(0,0,0,h);sk.addColorStop(0,C.sky[0]);sk.addColorStop(.6,C.sky[1]);sk.addColorStop(1,C.sky[2]);c.fillStyle=sk;c.fillRect(0,0,W,h);
    const sx=W*.74,sy=h*.42,R=Math.min(W,H)*.07;
    if(HW){c.fillStyle='#FFF4D6';for(let i=0;i<40;i++){c.globalAlpha=.3+((i*37)%10)/14;c.fillRect((i*97.3%1)*W,((i*53.1)%1)*h*.85,1.6,1.6);}c.globalAlpha=1;
      const gl=c.createRadialGradient(sx,sy,R*.5,sx,sy,R*3);gl.addColorStop(0,'rgba(255,214,120,.35)');gl.addColorStop(1,'rgba(255,214,120,0)');c.fillStyle=gl;c.fillRect(sx-R*3,sy-R*3,R*6,R*6);
      const mg=c.createRadialGradient(sx-R*.3,sy-R*.3,R*.1,sx,sy,R);mg.addColorStop(0,'#FFF6DC');mg.addColorStop(1,'#E9C26E');c.fillStyle=mg;c.beginPath();c.arc(sx,sy,R,0,7);c.fill();
      c.fillStyle='rgba(180,130,60,.25)';[[-.3,-.2,.22],[.25,.15,.16],[-.05,.35,.12]].forEach(([a,b,r])=>{c.beginPath();c.arc(sx+a*R,sy+b*R,r*R,0,7);c.fill();});}
    else{const sg=c.createRadialGradient(sx,sy,R*.3,sx,sy,R*3.2);sg.addColorStop(0,'rgba(255,250,220,1)');sg.addColorStop(.3,'rgba(255,236,170,.75)');sg.addColorStop(1,'rgba(255,236,170,0)');c.fillStyle=sg;c.beginPath();c.arc(sx,sy,R*3.2,0,7);c.fill();}
    c.fillStyle=C.hill;c.beginPath();c.moveTo(-10,h);for(let x=-20;x<W+40;x+=20)c.lineTo(x,h-20-Math.sin(x*.009)*16-Math.sin(x*.023)*8);c.lineTo(W+10,h);c.fill();
    c.fillStyle=C.hill2;c.beginPath();c.moveTo(-10,h);for(let x=-20;x<W+40;x+=16)c.lineTo(x,h-6-Math.abs(Math.sin(x*.03))*12);c.lineTo(W+10,h);c.fill();}
  function mkSpr(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c;}
  function buildSpr(){const S2=128;
    spr.tree=mkSpr(S2,S2*1.6,(c,w,h)=>{const x=w/2,y=h,s=w*.8;c.fillStyle=HW?'#2B1D16':'#7A4E2C';c.fillRect(x-s*.05,y-s*.95,s*.1,s*.95);
      const cols=HW?['#2A1A3C','#3B2456','#1C1029']:['#5FAE5B','#7FC46F','#3F8E48'];[[0,-1.15,.42],[-.22,-.95,.32],[.24,-.98,.33],[0,-1.45,.3]].forEach(([a,b,r],i)=>{const g=c.createRadialGradient(x+a*s-r*s*.3,y+b*s-r*s*.4,r*s*.1,x+a*s,y+b*s,r*s);g.addColorStop(0,HW?'#4A3266':'#9AD77F');g.addColorStop(1,cols[i%3]);c.fillStyle=g;c.beginPath();c.arc(x+a*s,y+b*s,r*s,0,7);c.fill();});
      if(HW){c.fillStyle='#FFB347';for(const[a,b]of[[-.15,-1.05],[.2,-1.2],[.05,-.85],[-.05,-1.4]]){c.beginPath();c.arc(x+a*s,y+b*s,s*.035,0,7);c.fill();}}});
    spr.bush=mkSpr(S2,S2*.6,(c,w,h)=>{const x=w/2,y=h,s=w*.8;c.fillStyle=HW?'#2A1A3C':'#5FAE5B';c.beginPath();c.arc(x-s*.15,y-s*.14,s*.18,0,7);c.arc(x+s*.12,y-s*.16,s*.2,0,7);c.arc(x,y-s*.27,s*.2,0,7);c.fill();
      if(!HW){c.fillStyle='#F6A3B7';for(const a of[-.15,.08,.2]){c.beginPath();c.arc(x+a*s,y-s*.27,s*.035,0,7);c.fill();}}});
    spr.lamp=mkSpr(S2*.6,S2*1.7,(c,w,h)=>{const x=w/2,y=h,s=S2*.8;c.fillStyle=HW?'#1A1024':'#3D4F55';c.fillRect(x-s*.025,y-s*1.25,s*.05,s*1.25);
      if(!HW){const lg=c.createRadialGradient(x,y-s*1.28,1,x,y-s*1.28,s*.3);lg.addColorStop(0,'rgba(255,240,190,.95)');lg.addColorStop(1,'rgba(255,240,190,0)');c.fillStyle=lg;c.beginPath();c.arc(x,y-s*1.28,s*.3,0,7);c.fill();c.fillStyle='#FFF2C4';c.beginPath();c.arc(x,y-s*1.28,s*.07,0,7);c.fill();}});}
  function drawBg(){const h=hor();ctx.drawImage(bgC,0,0,W,Math.ceil(h)+2);
    for(const c of G.clouds){if(G.st==='play')c.x-=.00025*c.k;if(c.x<-.2)c.x=1.2;const x=c.x*W,y=c.y*h,r=14+c.k*18;ctx.fillStyle=HW?'rgba(110,74,154,.28)':'rgba(255,255,255,.8)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.arc(x+r,y-r*.4,r*.8,0,7);ctx.arc(x+r*2,y,r*.9,0,7);ctx.arc(x+r,y+r*.2,r*.9,0,7);ctx.fill();}}
  function drawGround(){const h=hor(),zN=-3.2,zF=ZF;
    const bk=ctx.createLinearGradient(0,h,0,H);bk.addColorStop(0,C.bank[0]);bk.addColorStop(1,C.bank[1]);ctx.fillStyle=bk;ctx.fillRect(-20,h,W+40,H-h+20);
    // grass stripes
    if(!lowQ){ctx.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<14;i++){const z1=i*5-(G.dist%10),z2=z1+2.5;if(z2<zN)continue;for(const sd of[-1,1]){ctx.beginPath();ctx.moveTo(SX(sd*1.62,z1),SY(z1));ctx.lineTo(SX(sd*9,z1),SY(z1));ctx.lineTo(SX(sd*9,z2),SY(z2));ctx.lineTo(SX(sd*1.62,z2),SY(z2));ctx.fill();}}}
    // curb
    ctx.fillStyle=C.curb;for(const sd of[-1,1]){ctx.beginPath();ctx.moveTo(SX(sd*1.5,zN),SY(zN));ctx.lineTo(SX(sd*1.68,zN),SY(zN));ctx.lineTo(SX(sd*1.68,zF),SY(zF));ctx.lineTo(SX(sd*1.5,zF),SY(zF));ctx.fill();}
    // water
    const wg=ctx.createLinearGradient(0,h,0,H);wg.addColorStop(0,C.water[0]);wg.addColorStop(1,C.water[1]);ctx.fillStyle=wg;ctx.beginPath();ctx.moveTo(SX(-1.5,zN),SY(zN));ctx.lineTo(SX(1.5,zN),SY(zN));ctx.lineTo(SX(1.5,zF),SY(zF));ctx.lineTo(SX(-1.5,zF),SY(zF));ctx.fill();
    if(HW){const mx=W*.74,rg=ctx.createLinearGradient(mx-40,0,mx+40,0);rg.addColorStop(0,'rgba(255,214,120,0)');rg.addColorStop(.5,'rgba(255,214,120,.18)');rg.addColorStop(1,'rgba(255,214,120,0)');ctx.fillStyle=rg;ctx.fillRect(mx-40,h,80,H-h);}
    // waves
    for(let i=0;i<(lowQ?12:20);i++){const z=i*3.4-(G.dist%3.4);if(z<zN)continue;const p=P(z);for(const l of[-1,0,1]){const x=SX(l+((i*37+l*11)%7-3)*.06,z),y=SY(z),w=L()*p*.32;ctx.strokeStyle='rgba(255,255,255,'+(.08+.3*p)+')';ctx.lineWidth=Math.max(1,2.2*p);ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w/2,y-4*p,x,y);ctx.quadraticCurveTo(x+w/2,y+4*p,x+w,y);ctx.stroke();}}
    // lane ropes with floats
    for(const lx of[-.5,.5]){ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(SX(lx,zN),SY(zN));ctx.lineTo(SX(lx,zF),SY(zF));ctx.stroke();
      for(let i=0;i<30;i++){const z=i*1.6-(G.dist%3.2);if(z<zN)continue;const p=P(z);ctx.fillStyle=(i%2?'#fff':(HW?'#F28A1E':'#E8574A'));ctx.beginPath();ctx.ellipse(SX(lx,z),SY(z)-2*p,Math.max(1.2,L()*.045*p),Math.max(1,L()*.03*p),0,0,7);ctx.fill();}}}
  function drawScen(c){const p=P(c.z),x=SX(c.side*c.x,c.z),y=SY(c.z),s=L()*p*c.s;if(y<hor()-2)return;
    if(c.k==='tree'||c.k==='bush'){const im=spr[c.k];if(!im)return;const k=s/(128*.8);ctx.drawImage(im,x-im.width*k/2,y-im.height*k,im.width*k,im.height*k);}
    else if(c.k==='reed'){for(let i=-2;i<=2;i++){const xx=x+i*s*.07,hh=s*(.55+((i+3)%3)*.12);ctx.strokeStyle=HW?'#2F4A2A':'#3E8A4E';ctx.lineWidth=Math.max(1,s*.025);ctx.beginPath();ctx.moveTo(xx,y);ctx.quadraticCurveTo(xx+Math.sin(G.t*2+i)*s*.04,y-hh/2,xx+Math.sin(G.t*2+i)*s*.06,y-hh);ctx.stroke();
      if(i%2===0){ctx.fillStyle='#7A4A22';rr(xx-s*.025+Math.sin(G.t*2+i)*s*.06,y-hh-s*.05,s*.05,s*.16,s*.025);ctx.fill();}}}
    else if(c.k==='lamp'){const im=spr.lamp;if(!im)return;const k=s/(128*.8);ctx.drawImage(im,x-im.width*k/2,y-im.height*k,im.width*k,im.height*k);if(HW&&img.pump)ctx.drawImage(img.pump,x-s*.2,y-s*1.55,s*.4,s*.4);}}
  function drawObj(o){if(o.t!=='block'&&o.z<-1.3)return;if(o.t==='block'&&o.z+o.len<-1.2)return;const z=Math.max(o.z,o.t==='block'?-1.2:-3),p=P(z),x=SX(o.lane,z),y=SY(z),s=L()*p;if(y<hor()-2)return;
    if(o.t==='low'){ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(x,y,s*.5,s*.06,0,0,7);ctx.fill();
      const g=ctx.createLinearGradient(0,y-s*.24,0,y);g.addColorStop(0,'#B5773F');g.addColorStop(1,'#5A3015');ctx.fillStyle=g;rr(x-s*.44,y-s*.24,s*.88,s*.22,s*.11);ctx.fill();
      ctx.strokeStyle='rgba(60,30,10,.4)';ctx.lineWidth=Math.max(1,s*.012);for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(x+i*s*.1,y-s*.21);ctx.lineTo(x+i*s*.1+s*.04,y-s*.05);ctx.stroke();}
      for(const sd of[-1,1]){ctx.fillStyle='#E1B98A';ctx.beginPath();ctx.ellipse(x+sd*s*.44,y-s*.13,s*.05,s*.11,0,0,7);ctx.fill();ctx.strokeStyle='#A8693A';ctx.beginPath();ctx.ellipse(x+sd*s*.44,y-s*.13,s*.025,s*.055,0,0,7);ctx.stroke();}
      if(HW&&img.pump)ctx.drawImage(img.pump,x-s*.12,y-s*.46,s*.24,s*.24);}
    else if(o.t==='high'){const top=y-s*1.15,bar=y-s*.72;ctx.fillStyle=HW?'#2B1D16':'#6B4424';for(const sd of[-1,1])rr(x+sd*s*.43-s*.035,top,s*.07,y-top,s*.03),ctx.fill();
      const g=ctx.createLinearGradient(0,bar-s*.08,0,bar+s*.08);g.addColorStop(0,HW?'#3B2A20':'#8A5A2E');g.addColorStop(1,HW?'#1E140E':'#4E2E14');ctx.fillStyle=g;rr(x-s*.5,bar-s*.07,s*1,s*.14,s*.07);ctx.fill();
      for(let i=0;i<7;i++){const lx=x-s*.42+i*s*.14,ly=bar+s*.06+((i*7)%3)*s*.04;ctx.fillStyle=HW?'#3E2A5A':(i%2?'#4F9E53':'#6DBB62');ctx.beginPath();ctx.ellipse(lx,ly+Math.sin(G.t*3+i)*s*.01,s*.05,s*.1,.3,0,7);ctx.fill();}
      if(HW){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+s*.2,bar);ctx.lineTo(x+s*.2,bar+s*.3+Math.sin(G.t*2)*s*.05);ctx.stroke();ctx.fillStyle='#120A1C';ctx.beginPath();ctx.arc(x+s*.2,bar+s*.32+Math.sin(G.t*2)*s*.05,s*.04,0,7);ctx.fill();}
      ctx.fillStyle=HW?'#F28A1E':'#F2C14E';ctx.beginPath();ctx.moveTo(x-s*.07,top+s*.04);ctx.lineTo(x+s*.07,top+s*.04);ctx.lineTo(x,top+s*.16);ctx.fill();}
    else if(o.t==='block'){const z2=Math.max(o.z+o.len,-1.2),p2=P(z2),x2=SX(o.lane,z2),y2=SY(z2),s2=L()*p2;const hN=s*.55,hF=s2*.55;
      if(HW&&img.pump){ctx.fillStyle='#2A1A3C';ctx.beginPath();ctx.moveTo(x-s*.42,y);ctx.lineTo(x+s*.42,y);ctx.lineTo(x2+s2*.42,y2);ctx.lineTo(x2-s2*.42,y2);ctx.fill();
        ctx.drawImage(img.pump,x2-s2*.5,y2-s2*.95,s2,s2);if(o.z>-.9)ctx.drawImage(img.pump,x-s*.5,y-s*.98,s*1,s*1);return;}
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.ellipse(x,y,s*.5,s*.07,0,0,7);ctx.fill();
      ctx.fillStyle='#C9B79A';ctx.beginPath();ctx.moveTo(x-s*.42,y-hN);ctx.lineTo(x+s*.42,y-hN);ctx.lineTo(x2+s2*.42,y2-hF);ctx.lineTo(x2-s2*.42,y2-hF);ctx.fill();
      ctx.fillStyle='#E9DCC3';ctx.beginPath();ctx.moveTo(x-s*.3,y-hN-s*.02);ctx.lineTo(x+s*.3,y-hN-s*.02);ctx.lineTo(x2+s2*.3,y2-hF);ctx.lineTo(x2-s2*.3,y2-hF);ctx.fill();
      const cz=(x+x2)/2,cy=(y-hN+y2-hF)/2,cs=(s+s2)/2;ctx.fillStyle='#F6F1E6';rr(cz-cs*.22,cy-cs*.32,cs*.44,cs*.3,cs*.05);ctx.fill();ctx.fillStyle='#4FB3BC';rr(cz-cs*.16,cy-cs*.27,cs*.32,cs*.1,cs*.03);ctx.fill();
      const hg=ctx.createLinearGradient(0,y-hN,0,y);hg.addColorStop(0,'#FFFFFF');hg.addColorStop(1,'#D8E2E2');ctx.fillStyle=hg;ctx.beginPath();ctx.moveTo(x-s*.44,y-hN);ctx.lineTo(x+s*.44,y-hN);ctx.lineTo(x+s*.38,y-s*.08);ctx.quadraticCurveTo(x,y+s*.04,x-s*.38,y-s*.08);ctx.closePath();ctx.fill();
      ctx.fillStyle='#E8574A';ctx.fillRect(x-s*.43,y-hN+s*.12,s*.86,s*.08);ctx.fillStyle='#1F6F78';ctx.beginPath();ctx.arc(x,y-s*.27,s*.06,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(1,s*.015);ctx.beginPath();ctx.arc(x,y-s*.27,s*.06,0,7);ctx.stroke();}
    else if(o.t==='worm'){if(!img.worm)return;const b=Math.sin(G.t*5+o.ph)*s*.04;const w=s*.46,h=w*.5;if(HW){ctx.fillStyle='rgba(255,140,180,.18)';ctx.beginPath();ctx.arc(x,y-s*.38+b,w*.55,0,7);ctx.fill();}ctx.drawImage(img.worm,x-w/2,y-s*.38+b-h/2,w,h);}
    else if(o.t==='gold'){const r=s*.17,cy=y-s*.42+Math.sin(G.t*4)*s*.03,k=Math.abs(Math.cos(G.t*3));const g=ctx.createRadialGradient(x-r*.3,cy-r*.3,1,x,cy,r);g.addColorStop(0,'#FFF3B0');g.addColorStop(.6,'#F5C542');g.addColorStop(1,'#C98A1B');
      ctx.save();ctx.translate(x,cy);ctx.scale(Math.max(.15,k),1);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.strokeStyle='#A8700F';ctx.lineWidth=Math.max(1,r*.12);ctx.stroke();if(img.duck&&k>.4)ctx.drawImage(img.duck,-r*.75,-r*.75,r*1.5,r*1.5);ctx.restore();}
    else if(o.t==='pw'){const r=s*.2,cy=y-s*.45+Math.sin(G.t*3)*s*.04;const g=ctx.createRadialGradient(x-r*.35,cy-r*.35,1,x,cy,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.5,o.k==='magnet'?'rgba(255,120,120,.55)':o.k==='shield'?'rgba(120,200,255,.55)':'rgba(255,210,100,.6)');g.addColorStop(1,'rgba(255,255,255,.25)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,cy,r,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=Math.max(1,r*.08);ctx.stroke();ctx.fillStyle='#0F2A33';ctx.font='800 '+Math.round(r*.9)+'px Manrope,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.k==='magnet'?'🧲':o.k==='shield'?'🛡':'×2',x,cy+1);ctx.textBaseline='alphabetic';}}
  function drawDuck(){const p=P(0),s=L()*p,x=SX(G.lp,0),base=SY(0);const jp=G.jy*s*.95;
    if(G.jy>.04){ctx.fillStyle='rgba(0,40,50,'+Math.max(.05,.22-G.jy*.08)+')';ctx.beginPath();ctx.ellipse(x,base,s*.26*(1-Math.min(.5,G.jy*.2)),s*.06,0,0,7);ctx.fill();}
    const du=G.dive>0&&G.jy<.05?1-G.dive/.75:-1;const dk0=du<0?0:(du<.2?du/.2:du>.78?(1-du)/.22:1);const dk=dk0*dk0*(3-2*dk0);
    if(dk>0){ctx.fillStyle='rgba(8,40,52,'+(.3*dk)+')';ctx.beginPath();ctx.ellipse(x,base+s*.05,s*.28,s*.08,0,0,7);ctx.fill();
      for(let i=0;i<3;i++){const f=(G.t*1.6+i/3)%1;ctx.strokeStyle='rgba(255,255,255,'+((1-f)*.7*dk)+')';ctx.lineWidth=Math.max(1,s*.015);ctx.beginPath();ctx.ellipse(x,base,s*(.22+f*.4),s*(.06+f*.1),0,0,7);ctx.stroke();}
      if(rnd()<.55)G.parts.push({x:x+(rnd()-.5)*s*.35,y:base-1,vx:(rnd()-.5)*.4,vy:-.5-rnd()*1.2,g:0,l:20,r:1.5+rnd()*2.4,c:'rgba(230,250,255,.85)'});}
    if(G.wk&&G.wk.length){ctx.lineCap='round';for(const w of G.wk){const z=-w.a*G.speed*.12,pz=P(z),y=SY(z),sp=.16+w.a*.55,al=Math.max(0,(1-w.a/.9))*.5;if(y>H+10)continue;ctx.strokeStyle='rgba(255,255,255,'+al+')';ctx.lineWidth=Math.max(1,L()*pz*.014);
      for(const sd of[-1,1]){const x1=SX(w.lp+sd*sp*.55,z),x2=SX(w.lp+sd*(sp*.55+.12),z);ctx.beginPath();ctx.moveTo(x1,y);ctx.quadraticCurveTo((x1+x2)/2,y+L()*pz*.02,x2,y+L()*pz*.01);ctx.stroke();}}}
    if(dk>.02);else if(G.jy<=.04){ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=Math.max(1.2,s*.018);ctx.beginPath();ctx.ellipse(x,base,s*.24,s*.05,0,0,Math.PI);ctx.stroke();}
    if(dk>0){ctx.save();ctx.beginPath();ctx.rect(x-s*1.5,base-s*3,s*3,s*3-s*.02);ctx.clip();}
    if(G.shield>0){ctx.strokeStyle='rgba(143,214,220,'+(.5+.3*Math.sin(G.t*8))+')';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,base-jp-s*.4,s*.42,s*.52,0,0,7);ctx.stroke();ctx.fillStyle='rgba(143,214,220,.12)';ctx.fill();}
    ctx.save();ctx.translate(x,base-jp+dk*s*.95);ctx.rotate((G.lane-G.lp)*-.45+(G.st==='over'?G.spin:0)+dk*.12*Math.sin(G.t*6));
    const bw=s*.56,bh=s*.17;const bg=ctx.createLinearGradient(-bw/2,0,bw/2,0);bg.addColorStop(0,C.board[0]);bg.addColorStop(1,C.board[1]);ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,-bh*.4,bw/2,bh/2,0,0,7);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=Math.max(1,s*.018);ctx.beginPath();ctx.moveTo(-bw*.38,-bh*.4);ctx.lineTo(bw*.38,-bh*.4);ctx.stroke();ctx.fillStyle='rgba(0,0,0,.12)';ctx.beginPath();ctx.ellipse(0,-bh*.15,bw*.46,bh*.25,0,0,Math.PI);ctx.fill();
    const dv=G.dive>0&&dk<=0?.75:1,bob=G.jy>0?0:Math.sin(G.t*9)*s*.012;ctx.save();ctx.translate(0,-bh*.6);ctx.scale(1+(1-dv)*.25,dv);
    const B=(cx,cy,r)=>{const g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r*1.1);g.addColorStop(0,C.b[0]);g.addColorStop(.55,C.b[1]);g.addColorStop(1,C.b[2]);return g;};
    const fl=G.jy>.04?Math.sin(G.t*28)*.7:(G.dive>0?-.3:Math.sin(G.t*5)*.12);
    for(const sd of[-1,1]){ctx.save();ctx.translate(sd*s*.2,-s*.26+bob);ctx.rotate(sd*(.5+fl));ctx.fillStyle=C.w;ctx.beginPath();ctx.ellipse(0,-s*.04,s*.075,s*.16,0,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-s*.14);ctx.lineTo(0,s*.07);ctx.stroke();ctx.restore();}
    ctx.fillStyle=B(0,-s*.24+bob,s*.25);ctx.beginPath();ctx.ellipse(0,-s*.24+bob,s*.25,s*.22,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.ellipse(0,-s*.1+bob,s*.16,s*.07,0,0,7);ctx.fill();
    ctx.fillStyle=C.b[1];ctx.beginPath();ctx.moveTo(-s*.05,-s*.06+bob);ctx.quadraticCurveTo(0,s*.04+bob,s*.05,-s*.06+bob);ctx.fill();
    ctx.fillStyle=B(0,-s*.53+bob,s*.16);ctx.beginPath();ctx.arc(0,-s*.53+bob,s*.155,0,7);ctx.fill();
    ctx.fillStyle='#F2A03A';for(const sd of[-1,1]){ctx.beginPath();ctx.ellipse(sd*s*.15,-s*.5+bob,s*.03,s*.02,0,0,7);ctx.fill();}
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.ellipse(-s*.06,-s*.6+bob,s*.05,s*.07,-.5,0,7);ctx.fill();
    if(HW){ctx.fillStyle='#2A1747';ctx.beginPath();ctx.ellipse(0,-s*.66+bob,s*.22,s*.05,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-s*.12,-s*.67+bob);ctx.lineTo(s*.03,-s*1.02+bob);ctx.lineTo(s*.12,-s*.67+bob);ctx.fill();ctx.fillStyle='#B98CFF';ctx.fillRect(-s*.11,-s*.73+bob,s*.22,s*.04);}
    else{ctx.strokeStyle=C.b[2];ctx.lineWidth=Math.max(1.2,s*.025);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-s*.02,-s*.68+bob);ctx.quadraticCurveTo(s*.02,-s*.78+bob,s*.07,-s*.72+bob);ctx.stroke();}
    ctx.restore();ctx.restore();if(dk>0)ctx.restore();}
  function draw(){ctx.save();if(G.shake>0){ctx.translate((rnd()-.5)*G.shake,(rnd()-.5)*G.shake);G.shake*=.86;if(G.shake<.4)G.shake=0;}
    drawBg();drawGround();
    const list=[...G.scen.map(c=>({z:c.z,f:()=>drawScen(c)})),...G.objs.filter(o=>!o.gone).map(o=>({z:o.z+(o.t==='block'?0.01:0),f:()=>drawObj(o)})),{z:.0001,f:drawDuck}];
    list.sort((a,b)=>b.z-a.z);for(const it of list)it.f();
    for(const q of G.parts){ctx.globalAlpha=Math.max(0,Math.min(1,q.l/24));if(q.txt){ctx.fillStyle=q.c;ctx.font='800 20px Manrope,sans-serif';ctx.textAlign='center';ctx.fillText(q.txt,q.x,q.y);}else{ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.fill();}}ctx.globalAlpha=1;
    const tx=48,ty=40;for(const f of G.fly){if(f.t<0)continue;const t=Math.min(1,f.t),e=t*t*(3-2*t);const mx=(f.x+tx)/2-60,my=Math.min(f.y,ty)-80;const x=(1-e)*(1-e)*f.x+2*(1-e)*e*mx+e*e*tx,y=(1-e)*(1-e)*f.y+2*(1-e)*e*my+e*e*ty;const sc=1-.45*e;
      if(f.k==='w'&&img.worm)ctx.drawImage(img.worm,x-16*sc,y-8*sc,32*sc,16*sc);else{ctx.fillStyle='#F5C542';ctx.beginPath();ctx.arc(x,y,8*sc,0,7);ctx.fill();ctx.strokeStyle='#A8700F';ctx.lineWidth=1.5;ctx.stroke();}}
    if(G.st==='play'&&G.speed>18&&!demo&&!lowQ){ctx.strokeStyle='rgba(255,255,255,'+Math.min(.25,(G.speed-18)*.03)+')';ctx.lineWidth=1.5;for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2+G.t,r1=Math.min(W,H)*.45,r2=r1+40;ctx.beginPath();ctx.moveTo(W/2+Math.cos(a)*r1,hor()+Math.sin(a)*r1*.6);ctx.lineTo(W/2+Math.cos(a)*r2,hor()+Math.sin(a)*r2*.6);ctx.stroke();}}
    if(G.flash>0){ctx.fillStyle='rgba(255,255,255,'+G.flash*.55+')';ctx.fillRect(-20,-20,W+40,H+40);G.flash-=.05;}
    ctx.restore();}
  function frame(now){if(stop||!cv.isConnected){removeEventListener('resize',size);return;}const raw=Math.min(.05,(now-last)/1000);last=now;
    if(demo&&document.body.classList.contains('game-on')){requestAnimationFrame(frame);return;}
    dtS=dtS*.8+raw*.2;if(G.st==='play'){ftAcc+=raw;ftN++;if(ftN>=45){const avg=ftAcc/ftN;ftAcc=0;ftN=0;if(avg>.026){if(qMax>1){qMax=1;size();}else lowQ=true;}}}
    if(document.visibilityState==='visible'){update(dtS);draw();}requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
  return {input,reset,get G(){return G;},stop(){stop=true;}};}
function surfHero(g,mine){const HW=document.documentElement.classList.contains('hw');const cv=el('canvas',{class:'sf-demo','aria-hidden':'true'});
  const hero=el('section',{class:'game-hero sf-hero'+(HW?' hw':'')},cv,el('span',{class:'sf-veil','aria-hidden':'true'}),
    el('div',{class:'gh-txt'},el('span',{class:'gh-badge',text:HW?'🎃 Хелловін-версія':'Нова гра'}),el('h2',{text:g.name}),el('p',{text:g.desc}),
      el('div',{class:'gh-me'},mine?[el('span',{class:'gh-chip'},el('b',{text:(mine.best||0)+' м'}),'рекорд'),el('span',{class:'gh-chip'},wormSvg(),el('b',{text:String(mine.worms||0)})),el('span',{class:'gh-chip'},el('b',{text:String(mine.plays||0)}),'ігор')]:[el('span',{class:'gh-chip',text:'Ти ще не грав — стань першим!'})]),
      el('button',{class:'gh-play',type:'button',onclick:()=>openSurf()},el('span',{class:'gh-pi'},svg('<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>')),'Грати')));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(cv.isConnected)surfEngine(cv,'demo');}));return hero;}
function openSurf(){const m=myStaff();const HW=document.documentElement.classList.contains('hw');
  const cv=el('canvas',{class:'fl-cv'});const hud=el('div',{class:'fl-hud sf-hud'});const pw=el('div',{class:'sf-pw'});const panel=el('div',{class:'fl-panel',hidden:true});
  const tip=el('div',{class:'sf-tip'},el('b',{text:'Торкнись, щоб почати'}),el('div',{class:'sf-keys'},
    el('span',{},el('i',{text:IS_TOUCH?'← →':'← →'}),'доріжка'),el('span',{},el('i',{text:'↑'}),'стрибок'),el('span',{},el('i',{text:'↓'}),'пірнути')),el('small',{text:IS_TOUCH?'Свайпай пальцем у потрібний бік':'Стрілки або WASD, пробіл — стрибок'}));
  let eng=null,best=(m&&gameRow('surf',m.id)||{}).best||0;
  const close=()=>{if(eng)eng.stop();document.removeEventListener('keydown',key,true);root.remove();document.body.classList.remove('game-on');render();};
  const root=el('div',{class:'fl-root sf-root'+(HW?' hw':'')},cv,hud,pw,tip,panel,el('button',{class:'fl-x',type:'button','aria-label':'Вийти з гри',onclick:close},svg('<path d="M6 6l12 12M18 6 6 18"/>')));
  document.body.append(root);document.body.classList.add('game-on');
  const wChip=el('span',{class:'sf-wc'},el('span',{class:'sf-wi'},wormSvg()),el('b',{text:'0'}));const dB=el('b',{text:'0'}),dBar=el('i'),dRec=el('small');
  hud.replaceChildren(wChip,el('span',{class:'sf-dist'},el('span',{class:'sf-dv'},dB,el('em',{text:'м'})),el('span',{class:'sf-bar'},dBar),dRec),el('span',{class:'fl-b'}));
  let shownW=-1;const drawHud=(G,bump)=>{const d=Math.floor(G.dist);dB.textContent=String(d);dBar.style.width=Math.min(100,best?d/best*100:0)+'%';dRec.textContent=best?(d>best?'🏆 новий рекорд!':'рекорд '+best+' м'):'перший заплив';
    const delivered=G.worms-G.fly.filter(f=>!f.done).length*(G.x2>0?2:1);const w=Math.max(shownW,Math.min(G.worms,delivered));if(w!==shownW){shownW=w;wChip.lastChild.textContent=String(Math.max(0,w));}
    if(bump){wChip.classList.remove('bump');void wChip.offsetWidth;wChip.classList.add('bump');}
    pw.replaceChildren(...[['magnet','🧲'],['shield','🛡'],['x2','×2']].filter(([k])=>G[k]>0).map(([k,e])=>el('span',{class:'sf-pwc'},el('b',{text:e}),el('i',{style:'width:'+Math.round(G[k]/(k==='shield'?12:9)*100)+'%'}))));};
  const over=async r=>{const rec=r.dist>best&&r.dist>0;if(rec)best=r.dist;
    panel.hidden=false;panel.replaceChildren(el('div',{class:'fl-card'},rec?el('span',{class:'fl-rec',text:'🏆 Новий рекорд!'}):null,el('span',{class:'eyebrow',text:'Заплив завершено'}),
      el('div',{class:'fl-res'},el('div',{},el('b',{text:String(r.dist)}),el('small',{text:'метрів'})),el('div',{},el('b',{},wormSvg(),String(r.worms)),el('small',{text:'хробачків'})),el('div',{},el('b',{text:String(best)}),el('small',{text:'рекорд'}))),
      el('button',{class:'btn',type:'button',onclick:again},'Ще раз'),el('button',{class:'btn ghost',type:'button',onclick:close},'До рейтингу')));
    if(m){const row=gameRow('surf',m.id);const data={game:'surf',staffId:m.id,by:S.myId,best:Math.max(r.dist,row?row.best||0:0),worms:(row?row.worms||0:0)+r.worms,plays:(row?row.plays||0:0)+1,last:Date.now()};
      data.bestAt=(!row||r.dist>(row.best||0))?Date.now():(row.bestAt||Date.now());try{await S.db.doc('games/surf_'+m.id).set(data);}catch(e){}}};
  const again=()=>{panel.hidden=true;tip.hidden=false;shownW=-1;eng.reset();};
  eng=surfEngine(cv,'play',{hud:drawHud,over,start:()=>{tip.hidden=true;}});
  let sx=0,sy=0,fired=false;
  cv.addEventListener('pointerdown',e=>{e.preventDefault();sx=e.clientX;sy=e.clientY;fired=false;if(eng.G.st==='ready')eng.input('start');});
  cv.addEventListener('pointermove',e=>{if(fired||!e.buttons&&e.pointerType==='mouse')return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<26)return;fired=true;
    eng.input(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy<0?'u':'d'));});
  cv.addEventListener('pointerup',e=>{if(!fired&&eng.G.st==='play'&&e.pointerType!=='mouse'){}fired=true;});
  const key=e=>{const k=e.key;const map={ArrowLeft:'l',a:'l',A:'l','ф':'l',ArrowRight:'r',d:'r',D:'r','в':'r',ArrowUp:'u',w:'u',W:'u',' ':'u','ц':'u',ArrowDown:'d',s:'d',S:'d','і':'d'};
    if(k==='Escape'){close();return;}if(map[k]){e.preventDefault();if(eng.G.st==='over'){if(k===' ')again();return;}eng.input(map[k]);}};
  document.addEventListener('keydown',key,true);}
