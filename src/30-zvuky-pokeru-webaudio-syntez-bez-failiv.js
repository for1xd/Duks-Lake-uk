// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Звуки покеру (WebAudio, синтез без файлів)

/* ---------- Звуки покеру (WebAudio, синтез без файлів) ---------- */
const SND={ctx:null,on:(()=>{try{return localStorage.getItem('dl.snd')!=='0';}catch(e){return true;}})(),
  ac(){if(!this.on)return null;if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;this.ctx=new A();this.out=this.ctx.createGain();this.out.gain.value=.55;
      const comp=this.ctx.createDynamicsCompressor();this.out.connect(comp);comp.connect(this.ctx.destination);}
    if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return this.ctx;},
  noise(d){const c=this.ctx,b=c.createBuffer(1,Math.max(1,c.sampleRate*d|0),c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;return s;},
  env(g,t,a,peak,dec){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec);},
  tone(f,t,{type='sine',peak=.3,a=.005,d=.25,to=null}={}){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+a+d);o.connect(g);g.connect(this.out);this.env(g,t,a,peak,d);o.start(t);o.stop(t+a+d+.05);},
  hiss(t,{d=.06,f=3200,q=.9,peak=.35,type='bandpass',sweep=null}={}){const c=this.ctx,s=this.noise(d+.05),fl=c.createBiquadFilter(),g=c.createGain();fl.type=type;fl.frequency.setValueAtTime(f,t);if(sweep)fl.frequency.exponentialRampToValueAtTime(sweep,t+d);fl.Q.value=q;s.connect(fl);fl.connect(g);g.connect(this.out);this.env(g,t,.003,peak,d);s.start(t);s.stop(t+d+.06);},
  play(k,delay){const c=this.ac();if(!c)return;const t=c.currentTime+(delay||0)+.01;try{
    if(k==='deal'){this.hiss(t,{d:.07,f:2600,q:.7,peak:.28,sweep:5200});this.tone(140,t,{peak:.05,d:.05});}
    else if(k==='flip'){this.hiss(t,{d:.05,f:3600,q:1.2,peak:.25});this.hiss(t+.045,{d:.04,f:2200,q:1,peak:.18});}
    else if(k==='chip'){[[2650,.16],[3980,.08],[5300,.05]].forEach(([f,p],i)=>this.tone(f,t,{type:'sine',peak:p,d:.12+i*.02}));this.tone(2450,t+.055,{peak:.1,d:.1});this.hiss(t,{d:.02,f:6000,q:2,peak:.1});}
    else if(k==='check'){this.tone(190,t,{type:'triangle',peak:.28,d:.07,to:120});this.tone(190,t+.11,{type:'triangle',peak:.2,d:.06,to:120});}
    else if(k==='fold'){this.hiss(t,{d:.22,f:1800,q:.6,peak:.18,type:'lowpass',sweep:400});}
    else if(k==='turn'){this.tone(659,t,{type:'sine',peak:.16,d:.22});this.tone(988,t+.1,{type:'sine',peak:.14,d:.35});}
    else if(k==='win'){[523,659,784,1047].forEach((f,i)=>{this.tone(f,t+i*.09,{type:'triangle',peak:.2,d:.4});this.tone(f*2,t+i*.09,{type:'sine',peak:.05,d:.3});});for(let i=0;i<5;i++)this.play('chip',.36+i*.07+Math.random()*.03);}
    else if(k==='lose'){this.tone(392,t,{type:'triangle',peak:.12,d:.25});this.tone(330,t+.14,{type:'triangle',peak:.1,d:.35});}
    else if(k==='coin'){this.tone(1319,t,{type:'square',peak:.05,d:.08});this.tone(1976,t+.07,{type:'square',peak:.06,d:.25});}
    else if(k==='level'){[784,988,1175,1568].forEach((f,i)=>this.tone(f,t+i*.07,{type:'sine',peak:.16,d:.3}));this.hiss(t+.28,{d:.35,f:7000,q:.5,peak:.06,type:'highpass'});}
    else if(k==='allin'){this.tone(110,t,{type:'sawtooth',peak:.08,d:.35,to:220});for(let i=0;i<6;i++)this.play('chip',.05+i*.045);}
  }catch(e){}},
  toggle(){this.on=!this.on;try{localStorage.setItem('dl.snd',this.on?'1':'0');}catch(e){}if(this.on)this.play('coin');}};
addEventListener('pointerdown',()=>{if(SND.on&&S.tab==='fun'&&S.funGame==='poker')SND.ac();},{capture:true,passive:true});
/* Події столу → звуки */
function pkSounds(T){const h=T.hand;const me=pkMySeat(T);if(me<0||!h){S._pkPrev=null;return;}const P=S._pkPrev;S._pkPrev={id:T.id,n:h.n,b:h.board.length,seq:h.seq||0,turn:h.turn,st:h.street};
  const fresh=!h.seq&&!h.board.length&&h.street==='pre';if((!P||P.id!==T.id)&&!fresh)return;
  if(!P||P.id!==T.id||h.n!==P.n){const k=Object.keys(h.p||{}).length*2;for(let i=0;i<Math.min(k,12);i++)SND.play('deal',i*.07);if(h.turn===me)SND.play('turn',k*.07+.15);return;}
  if((h.seq||0)>P.seq){const last=(h.log||[])[h.log.length-1]||'';const txt=last.toLowerCase();
    if(/ва-банк/.test(txt))SND.play('allin');else if(/пас|встав/.test(txt))SND.play('fold');else if(/чек/.test(txt))SND.play('check');else if(/колл|рейз/.test(txt))SND.play('chip');}
  if(h.board.length>P.b){const nw=h.board.length-P.b;for(let i=0;i<nw;i++)SND.play('flip',.25+i*.12);}
  if(h.street==='done'&&P.st!=='done'&&h.res){const won=h.res.wins.some(w=>w.i===me);SND.play(won?'win':(h.p[me]&&!h.p[me].f?'lose':'chip'),.35);}
  else if(h.turn===me&&P.turn!==me&&h.street!=='done')SND.play('turn',.2);}
