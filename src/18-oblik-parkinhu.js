// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Облік паркінгу

/* ---------- Облік паркінгу ---------- */
const PK_A11Y=new Set(['A39','A34','B35','A12','B13','A6','B7','B6','B4','B2','C4','B50']);
const PK_ORDER=(()=>{const a=[];for(let i=1;i<=4;i++)a.push('C'+i);for(let i=1;i<=42;i++)a.push('A'+i);for(let i=1;i<=50;i++)a.push('B'+i);return a;})();
const PK_ST={busy:'Зайнято',free:'Вільне',res:'Бронь',uk:'Службове (УК)'};
function pkDoc(){return S.pk.main||null;}
function pkRows(){const d=pkDoc();const rs=(d&&d.rows)||{};return PK_ORDER.filter(id=>rs[id]).map(id=>({id,...rs[id]})).concat(Object.keys(rs).filter(id=>!PK_ORDER.includes(id)).sort().map(id=>({id,...rs[id]})));}
function pkSt(r){if(/брон/i.test(r.status||''))return 'res';if(/вільн/i.test(r.status||'')&&!r.tenant)return 'free';if(/^ук$/i.test(r.tenant||''))return 'uk';return r.tenant?'busy':'free';}
function pkTen(rows){const c={};rows.forEach(r=>{if(r.tenant&&!/^ук$/i.test(r.tenant))c[r.tenant]=(c[r.tenant]||0)+1;});return Object.entries(c).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'uk')).map(x=>x[0]);}
function pkCol(rows){const t=pkTen(rows);const map={};t.forEach((n,i)=>{map[n]=i<8?WS_PAL[i][dzDark()?1:0]:(dzDark()?'#7d8a8e':'#9aa7ab');});return map;}
function pkStCol(k){return {busy:dzDark()?'#3987e5':'#2a78d6',free:dzDark()?'#199e70':'#1baf7a',res:dzDark()?'#c98500':'#eda100',uk:dzDark()?'#a8b6ba':'#5f6f74'}[k];}
function pkGeo(){const P=26,D=52,U=r=>10+r*P,X0=80;const cL=X0,cA1=X0+52,cIA=X0+100,cIB=X0+152,cA2=X0+204,cR=X0+252;const S_=[];
  const right=[];for(let n=50;n>=40;n--)right.push('B'+n);for(let n=38;n>=2;n-=2)right.push('B'+n);right.forEach((id,i)=>S_.push({id,u:U(i),v:cR,du:P,dv:D,o:'h'}));
  const left=['A42','A41','A40','A39','A38','A37','A36','A35'];for(let n=33;n>=13;n-=2)left.push('A'+n);left.forEach((id,i)=>S_.push({id,u:U(i),v:cL,du:P,dv:D,o:'h'}));
  ['A11','A9','A7'].forEach((id,i)=>S_.push({id,u:U(22+i),v:cL,du:P,dv:D,o:'h'}));['A5','A3','A1'].forEach((id,i)=>S_.push({id,u:U(26+i),v:cL,du:P,dv:D,o:'h'}));
  S_.push({id:'B39',u:U(0),v:cIB,du:P,dv:D,o:'h'},{id:'B37',u:U(1),v:cIB,du:P,dv:D,o:'h'});
  for(let k=0;k<12;k++)S_.push({id:'A'+(34-2*k),u:U(7+k),v:cIA,du:P,dv:D,o:'h'},{id:'B'+(35-2*k),u:U(7+k),v:cIB,du:P,dv:D,o:'h'});
  [['A10','B11'],['A8','B9'],['A6','B7'],['A4','B5'],['A2','B3']].forEach(([a,b],k)=>S_.push({id:a,u:U(23+k),v:cIA,du:P,dv:D,o:'h'},{id:b,u:U(23+k),v:cIB,du:P,dv:D,o:'h'}));
  S_.push({id:'B1',u:U(28),v:cIB,du:P,dv:D,o:'h'});
  ['C1','C2','C3'].forEach((id,i)=>S_.push({id,u:U(33.3),v:cIA+6+i*30,du:D,dv:28,o:'v'}));S_.push({id:'C4',u:U(33.1),v:cA2+10,du:D,dv:28,o:'v'});
  const B=[{u:U(0),v:cIA,du:P*6,dv:D,k:'core',l:'Сходи'},{u:U(2),v:cIB,du:P*4,dv:D,k:'core',l:'Ліфти'},{u:U(6),v:cIA,du:P,dv:2*D,k:'hatch'},{u:U(19),v:cL,du:P*3,dv:D,k:'core',l:'WC'},{u:U(19),v:cIA,du:P,dv:2*D,k:'zebra'},
    {u:U(20),v:cIA,du:P*3,dv:2*D,k:'core',l:'Ліфти · сходи'},{u:U(28),v:cIA,du:P,dv:D,k:'core',l:'Сходи'},{u:U(25),v:cL,du:P,dv:D,k:'hatch'},{u:U(33.1),v:cIA,du:P*2.3,dv:96,k:'room'}];
  const R=[{u:U(0),v:cA1,du:P*30,dv:48,dir:1},{u:U(0),v:cA2,du:P*30,dv:48,dir:-1},{u:U(30),v:0,du:P*3,dv:cR+4,dir:0}];
  return {S:S_,B,R,L:U(35.4),W:X0+304,cR};}
function pkSvg(rows,hz){const G=pkGeo();const L=G.L,W=G.W;const T=(u,v)=>hz?[L-u,v]:[v,u];const rect=(u,v,du,dv)=>{const [x1,y1]=T(u,v),[x2,y2]=T(u+du,v+dv);return [Math.min(x1,x2),Math.min(y1,y2),Math.abs(x2-x1),Math.abs(y2-y1)];};
  const byId={};rows.forEach(r=>byId[r.id]=r);const col=pkCol(rows);const mode=S.pkMode||'ten';const q=lc(S.pkQ);const hl=S.pkHl||'';const dk=dzDark();
  const f=n=>Math.round(n*10)/10;let s='';
  G.R.forEach(r=>{const [x,y,w,h]=rect(r.u,r.v,r.du,r.dv);s+=`<rect class="pk-road" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="6"/>`;
    if(r.dir){for(let k=2;k<30;k+=5){const uc=r.u+k*26,vc=r.v+r.dv/2,sg=r.dir;const pts=[[uc+8*sg,vc],[uc-6*sg,vc-7],[uc-6*sg,vc+7]].map(([u,v])=>T(u,v).map(f).join(',')).join(' ');s+=`<polygon class="pk-arr" points="${pts}"/>`;}
      const [xa,ya]=T(r.u+4,r.v+r.dv/2),[xb,yb]=T(r.u+r.du-4,r.v+r.dv/2);}
    else{const vc=r.v+r.du/2;for(let k=0;k<4;k++){const v0=40+k*80;const uc=r.u+r.du/2;const pts=[[uc,v0+9],[uc-7,v0-5],[uc+7,v0-5]].map(([u,v])=>T(u,v).map(f).join(',')).join(' ');}
      const [lx,ly]=T(r.u+r.du/2,24);s+=`<text class="pk-in" x="${f(lx)}" y="${f(ly)}">В’ЇЗД ⇄</text>`;}});
  G.B.forEach(b=>{const [x,y,w,h]=rect(b.u,b.v,b.du,b.dv);s+=`<rect class="pk-${b.k}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${b.k==='zebra'?0:5}"/>`;if(b.l){s+=`<text class="pk-bl" x="${f(x+w/2)}" y="${f(y+h/2+3)}">${b.l}</text>`;}});
  G.S.forEach(g=>{const r=byId[g.id]||{id:g.id};const st=pkSt(r);const c=mode==='st'?pkStCol(st):(st==='free'?null:st==='uk'?pkStCol('uk'):(col[r.tenant]||pkStCol('busy')));
    const [x,y,w,h]=rect(g.u+1.5,g.v+2,g.du-3,g.dv-4);const match=pkMatch(r);
    const sel=S.pkSel===g.id;s+=`<g class="pk-s${c?'':' free'}${match?'':' dim'}${sel?' sel':''}" data-id="${g.id}" style="${c?'--sc:'+c:''}"><rect class="pk-sp" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="4"/>`;
    if(c){const along=(g.o==='h')!==!!hz;// car long axis
      const cw=along?w*.78:w*.56,ch=along?h*.56:h*.78;const cx=x+(w-cw)/2,cy=y+(h-ch)/2;s+=`<rect class="pk-car" x="${f(cx)}" y="${f(cy)}" width="${f(cw)}" height="${f(ch)}" rx="${f(Math.min(cw,ch)*.32)}"/>`;
      const rw=along?cw*.42:cw*.8,rh=along?ch*.8:ch*.42;s+=`<rect class="pk-roof" x="${f(cx+(cw-rw)/2+(along?cw*.06:0))}" y="${f(cy+(ch-rh)/2+(along?0:ch*.06))}" width="${f(rw)}" height="${f(rh)}" rx="${f(Math.min(rw,rh)*.3)}"/>`;}
    const tx=x+w/2,ty=y+h/2+3.4;s+=`<text class="pk-id" x="${f(tx)}" y="${f(ty)}">${g.id}</text>`;
    if(PK_A11Y.has(g.id))s+=`<text class="pk-a11y" x="${f(x+(hz?w-6:7))}" y="${f(y+(hz?9:h-4))}">♿</text>`;s+='</g>';});
  const vb=hz?[L,W]:[W,L];
  return {html:`<svg viewBox="0 0 ${vb[0]} ${vb[1]}" class="pk-svg" role="img" aria-label="План паркінгу, ${G.S.length} місць" xmlns="http://www.w3.org/2000/svg">${s}</svg>`,ar:vb[0]/vb[1]};}
