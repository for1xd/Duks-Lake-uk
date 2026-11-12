// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Нарада з інвестором

/* ---------- Нарада з інвестором ---------- */
/* Офіційне оформлення звіту: посада й ПІБ керівника УК (settings/main: directorTitle, directorName) */
const DIR_DEFAULT='Головньов В.І.';const DIR_TITLE_DEFAULT='Керівник УК';
function dirTitle(){const v=S.cfg&&S.cfg.directorTitle;return (v&&String(v).trim())||DIR_TITLE_DEFAULT;}
function dirName(){const v=S.cfg&&S.cfg.directorName;return (v&&String(v).trim())||DIR_DEFAULT;}
function dmy(d){d=d||new Date();return pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear();}
function dirEdit(){const i=el('input',{id:'dirN',value:dirName(),maxlength:'60',placeholder:DIR_DEFAULT});
  openSheet(el('h2',{text:'ПІБ керівника УК'}),el('p',{class:'muted small',style:'margin:0',text:'Підставляється в шапку та блок підписів звіту для наради з інвестором.'}),el('label',{for:'dirN'},'ПІБ керівника УК',i),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const v=i.value.trim();if(!v){toast('Вкажіть ПІБ');i.focus();return;}closeSheet();S.cfg={...(S.cfg||{}),directorName:v};render();
      write(()=>S.db.doc('settings/main').set({...(S.cfg||{}),directorName:v,updatedAt:Date.now(),updatedBy:S.myId||''}),'Збережено: '+dirTitle().toLowerCase()+' — '+v);}},'Зберегти'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));if(!IS_TOUCH)i.focus();}
/* Блок підписів (екран і PDF) */
function rpSign(per,pdf){return el('div',{class:'rp-sign'+(pdf?'':' scr')},el('div',{class:'rp-sg-h',text:'Підписи'}),
  el('div',{class:'rp-sg-r'},el('span',{class:'rp-sg-l',text:dirTitle()}),el('span',{class:'rp-sg-line'},el('small',{text:'(підпис)'})),el('span',{class:'rp-sg-n',text:dirName()})),
  el('div',{class:'rp-sg-r'},el('span',{class:'rp-sg-l',text:'Дата'}),el('span',{class:'rp-sg-line'},el('small',{text:'(дата підписання)'})),el('span',{class:'rp-sg-mp',text:'М.П.'})));}
function rpMeta(per){return el('dl',{class:'rp-meta'},el('dt',{text:'Звітний період'}),el('dd',{text:perLabel(per)}),el('dt',{text:'Дата формування'}),el('dd',{text:dmy()}),el('dt',{text:dirTitle()}),el('dd',{text:dirName()}));}
function canMeet(){return hasAny(['director','dev','manager']);}
function mtPick(list,per){const ks=list.filter(k=>k<=per).sort();return ks.length?ks[ks.length-1]:null;}
function mtMonLow(p){return perLabel(p).split(' ')[0].toLowerCase();}
function mtPct(a,b){if(a==null||b==null||!b)return null;return (a-b)/Math.abs(b)*100;}
function mtDebt(p){if(!p)return null;let total=0,charged=0,paid=0,over=0;const ten={};
  const by=DZ_SHEETS.map(sh=>{let d=0,c=0,pd=0;const n=new Set();dzRows(p,sh.id).forEach(r=>{const x=dzCalc(r);c+=x.total;pd+=(+r.paid||0);
      if(x.debt>0.004){d+=x.debt;n.add(r.tenant);const k=r.tenant||'—';(ten[k]=ten[k]||{n:k,bld:r.bld,v:0,s:new Set()}).v+=x.debt;ten[k].s.add(sh.name);if(x.b==='b3')over+=x.debt;}});
    total+=d;charged+=c;paid+=pd;return {id:sh.id,n:sh.name,c:sh.c[0],v:d,charged:c,paid:pd,cnt:n.size};});
  const top=Object.values(ten).sort((a,b)=>b.v-a.v);
  const aging=DZ_B.map(b=>({k:b.k,n:b.name,c:b.c,v:0}));DZ_SHEETS.forEach(sh=>dzRows(p,sh.id).forEach(r=>{const x=dzCalc(r);if(x.debt>0.004&&x.b){const a=aging.find(q=>q.k===x.b);if(a)a.v+=x.debt;}}));
  const all=q=>DZ_SHEETS.flatMap(sh=>dzRows(q,sh.id)).map(r=>({...r,...dzCalc(r)}));const pp=perShift(p,-1);
  const eq=dzEqCalc(p,all(p),dzPers().includes(pp)?all(pp):null);
  return {per:p,total,charged,paid,rate:charged?paid/charged*100:null,over,by,top,cnt:top.length,aging,eq};}
/* 5 карток дебіторської заборгованості — як верхній ряд вкладки (dzEqCalc) */
function mtDebtCards(d,pdf){const e=d.eq;const mon=perLabel(d.per).toLowerCase();const pct=Math.round(e.rate*100);
  const c=(lbl,val,cls,...sub)=>el('div',{class:'mt-k'+(cls?' '+cls:'')},el('span',{class:'mt-kl',text:lbl}),el('b',{text:val}),...sub.filter(Boolean));
  return el('div',{class:(pdf?'rp-ks':'mt-ks')+' dz5'},
    c('Дебіторська заборгованість на початок періоду',e.start==null?'—':uah(e.start,true)+' ₴','',el('small',{text:e.start==null?'немає даних за попередній місяць':'станом на 01.'+d.per.slice(5,7)})),
    c('Нараховано поточного місяця',uah(e.month,true)+' ₴','',el('small',{text:'за '+mon})),
    c('Нараховано всього',uah(e.charged,true)+' ₴','',el('small',{text:'початок періоду + місяць'})),
    c('Сплачено',uah(e.paid,true)+' ₴','',el('div',{class:'w-prog dz5-bar'},el('i',{style:'width:'+Math.min(100,pct)+'%'})),el('small',{text:pct+'% зібрано'})),
    c('Дебіторська заборгованість',uah(e.debt,true)+' ₴','acc',el('small',{text:e.debtors+' '+plural(e.debtors,'боржник','боржники','боржників')+' · прострочено '+uah(e.overdue,true)+' ₴'}),e.over>0.004?el('small',{text:'переплата: '+uah(e.over,true)+' ₴'}):null));}
function mtWater(p){if(!p||!S.wPerD[p])return null;const objs=(S.wObj||[]).map(o=>{const x=wStats(p,o.id);return {n:o.name||o.id,v:x.actual,f:x.filled,t:x.total};});
  const f=objs.reduce((a,o)=>a+o.f,0),t=objs.reduce((a,o)=>a+o.t,0);const total=objs.reduce((a,o)=>a+(o.v||0),0);const mains=(S.wObj||[]).reduce((a,o)=>a+wStats(p,o.id).main,0);
  const bill=S.wPerD[p].bill,uahB=S.wPerD[p].billUah;const ok=bill!=null&&+bill>0;const got=ok?Math.min(total,+bill):null;const loss=ok?+bill-total:null;
  return {per:p,total,mains,objs:objs.sort((a,b)=>(b.v||0)-(a.v||0)),f,t,bill,billUah:uahB,got,loss,gotP:ok?got/bill*100:null,lossP:ok?Math.max(0,loss)/bill*100:null,price:ok&&uahB?uahB/bill:null};}
/* Витратні матеріали за місяць */
function mtCons(per){const items=S.consI||[];const L=(S.consO||[]).filter(o=>consOpLive(o)&&String(o.date||'').startsWith(per));if(!items.length&&!L.length)return null;
  const outs=L.filter(o=>o.kind==='issue'),ins=L.filter(o=>o.kind==='receipt');const lines=outs.flatMap(o=>(o.lines||[]).map(l=>({...l,o})));
  const cats=CONS_CATS.map(c=>({n:c[2]+' '+c[1],v:lines.filter(l=>((consItem(l.itemId)||{}).cat||l.cat)===c[0]).length})).filter(x=>x.v).sort((a,b)=>b.v-a.v);
  const byI={};lines.forEach(l=>{const k=l.itemId||l.name;(byI[k]=byI[k]||{n:(consItem(l.itemId)||{}).name||l.name,v:0,q:0,u:l.unit}).v++;byI[k].q+=-l.delta||0;});
  const byS={};outs.forEach(o=>{const k=consToLabel(o)||'—';byS[k]=(byS[k]||0)+1;});
  return {per,n:items.filter(x=>+x.qty>0).length,outs:outs.length,ins:ins.length,cats,top:Object.values(byI).sort((a,b)=>b.v-a.v||b.q-a.q),staff:Object.entries(byS).map(([n,v])=>({n,v})).sort((a,b)=>b.v-a.v),low:items.filter(consLow)};}
function mtWaste(p){if(!p)return null;const rows=wsRows(p);const tot=rows.reduce((a,r)=>a+(+r.vol||0),0);
  const blds=wsBlds(rows).map(b=>({n:wsName(b),v:rows.filter(r=>r.bld===b).reduce((a,r)=>a+(+r.vol||0),0)}));
  const top=rows.filter(r=>+r.vol>0).map(r=>({n:r.tenant||'—',bld:r.bld,v:+r.vol})).sort((a,b)=>b.v-a.v);
  return {per:p,total:tot,blds,top,cnt:top.length,all:rows.length};}
function mtPark(){const rs=pkRows();if(!rs.length)return null;const c={busy:0,free:0,res:0,uk:0};rs.forEach(r=>c[pkSt(r)]++);return {n:rs.length,c,occ:(c.busy+c.uk+c.res)/rs.length*100};}
function mtInv(){const rs=invRows();if(!rs.length)return null;const cats=INV_CATS.map(([id,n,e])=>({n:e+' '+n,v:rs.filter(r=>r.cat===id).length})).filter(x=>x.v).sort((a,b)=>b.v-a.v);
  return {n:rs.length,use:rs.filter(r=>r.kind!=='store').length,store:rs.filter(r=>r.kind==='store').length,fix:rs.filter(r=>r.cond==='fix').map(r=>r.name),cats,date:invDoc()&&invDoc().date};}
function mtSos(per){const [y,m]=per.split('-').map(Number);const a=new Date(y,m-1,1).getTime(),b=new Date(y,m,1).getTime();
  const L=(S.sos||[]).filter(x=>sosT(x)>=a&&sosT(x)<b).sort((p,q)=>sosT(p)-sosT(q));const done=L.filter(x=>x.status==='done');const dt=done.filter(x=>x.doneAt);
  const carry=(S.sos||[]).filter(x=>sosT(x)<a&&(x.status!=='done'||(x.doneAt&&x.doneAt>=a)));
  const solved=(S.sos||[]).filter(x=>x.status==='done'&&x.doneAt&&x.doneAt>=a&&x.doneAt<b).length;
  return {L,done:done.length,solved,open:L.length-done.length,crit:L.filter(x=>x.sev==='crit').length,
    cats:SOS_CAT.map(c=>({id:c.id,n:c.n,c:c.c,v:L.filter(x=>x.cat===c.id).length})),sev:Object.keys(SOS_SEV).map(k=>({k,n:SOS_SEV[k][0],c:SOS_SEV[k][1],v:L.filter(x=>x.sev===k).length})),carry};}
function mtData(per){const prev=perShift(per,-1);const dzP=dzPers(),wsP=wsPers(),wP=Object.keys(S.wPerD||{}).filter(k=>S.wPerD[k]);
  const D={per,pm:pmCan()?pmStats(per+'-01',ymd(new Date(+per.slice(0,4),+per.slice(5,7),0))):null,debt:mtDebt(mtPick(dzP,per)),water:mtWater(mtPick(wP,per)),waste:mtWaste(mtPick(wsP,per)),park:mtPark(),inv:mtInv(),cons:mtCons(per),sos:mtSos(per),sosPrev:mtSos(prev)};
  D.debtCmp=D.debt?dzCmp(dzCmpRpKey(D.debt.per),D.debt.per,null):null;
  D.debtPrev=D.debt?mtDebt(mtPick(dzP,perShift(D.debt.per,-1))):null;if(D.debtPrev&&D.debtPrev.per===D.debt.per)D.debtPrev=null;
  D.wastePrev=D.waste?mtWaste(mtPick(wsP,perShift(D.waste.per,-1))):null;if(D.wastePrev&&D.wastePrev.per===D.waste.per)D.wastePrev=null;
  D.waterPrev=D.water?mtWater(mtPick(wP,perShift(D.water.per,-1))):null;if(D.waterPrev&&D.waterPrev.per===D.water.per)D.waterPrev=null;
  return D;}
function mtHighlights(D){const H=mtHi0(D);if(D.pm&&D.pm.n)H.push(['🛠','Проведено '+D.pm.n+' '+plural(D.pm.n,'планове ТО','планові ТО','планових ТО')+(D.pm.fail?', з них '+D.pm.fail+' неуспішн.':' — усі успішні')+(D.pm.over.length?'; прострочено зараз: '+D.pm.over.length:'')+'.']);return H;}
function mtHi0(D){const H=[];const mo=mtMonLow(D.per);
  if(D.sos.L.length)H.push(['🚨','За '+mo+' зафіксовано '+D.sos.L.length+' '+plural(D.sos.L.length,'екстрену ситуацію','екстрені ситуації','екстрених ситуацій')+', вирішено за місяць '+D.sos.solved+(D.sos.open?'; ще відкрито '+D.sos.open:'')+'.']);
  else H.push(['✅','За '+mo+' екстрених ситуацій не було.']);
  if(D.sos.crit)H.push(['⚠️','Критичних ситуацій: '+D.sos.crit+'. Найчастіше — '+D.sos.cats.slice().sort((a,b)=>b.v-a.v)[0].n.toLowerCase()+'.']);
  if(D.debt){const ch=D.debtPrev?mtPct(D.debt.total,D.debtPrev.total):null;H.push(['₴','Дебіторська заборгованість — '+uah(D.debt.total,true)+' ₴ у '+D.debt.cnt+' '+plural(D.debt.cnt,'резидента','резидентів','резидентів')+(ch!=null?' ('+(ch<=0?'↓ ':'↑ ')+Math.abs(Math.round(ch))+'% до '+mtMonLow(D.debtPrev.per)+')':'')+(D.debt.rate!=null?'. Зібрано '+Math.round(D.debt.rate)+'% нарахувань.':'.')]);}
  if(D.waste){const ch=D.wastePrev?mtPct(D.waste.total,D.wastePrev.total):null;H.push(['🗑','Вивезено '+fl(D.waste.total)+' л сміття'+(ch!=null?' ('+(ch<=0?'↓ ':'↑ ')+Math.abs(Math.round(ch))+'%)':'')+(D.waste.top[0]?'. Найбільше — '+D.waste.top[0].n+' ('+fl(D.waste.top[0].v)+' л).':'.')]);}
  if(D.water){const w=D.water;H.push(['💧','Споживання води — '+fm3(w.total)+' м³'+(w.gotP!=null?'; перевиставлено резидентам '+Math.round(w.gotP)+'% рахунку Водоканалу'+(w.loss>0?', нестача УК '+fm3(w.loss)+' м³'+(w.price?' (≈ '+Math.round(w.loss*w.price).toLocaleString('uk-UA')+' грн)':''):''):'; внесено '+w.f+' з '+w.t+' показників')+'.']);}
  if(D.debt&&D.debt.over>0)H.push(['⚖️','Критична дебіторська заборгованість (понад 30 днів або старий борг) — '+uah(D.debt.over,true)+' ₴.']);
  if(D.cons&&(D.cons.outs||D.cons.low.length))H.push(['🧴','Витратні матеріали: '+D.cons.outs+' '+plural(D.cons.outs,'видача','видачі','видач')+' за місяць'+(D.cons.top[0]?', найчастіше — '+D.cons.top[0].n:'')+(D.cons.low.length?'; закінчуються: '+D.cons.low.slice(0,3).map(x=>x.name).join(', '):'')+'.']);
  if(D.park)H.push(['🅿️','Паркінг заповнений на '+Math.round(D.park.occ)+'%: '+D.park.c.busy+' в оренді, '+D.park.c.free+' вільних.']);
  if(D.inv&&D.inv.fix.length)H.push(['🛠','Інвентар: '+D.inv.n+' позицій, '+D.inv.fix.length+' потребують ремонту.']);
  return H;}

/* Shared small builders (screen + PDF) */
function mtBars(items,fmt,opt){opt=opt||{};const max=Math.max(1,...items.map(i=>i.v||0));
  return el('div',{class:'mt-bars'},items.map(i=>el('div',{class:'mt-br',title:i.n+': '+fmt(i.v)},
    el('span',{class:'mt-bl'},i.c&&opt.dot!==false?el('i',{style:'background:'+i.c}):null,el('span',{text:i.n})),
    el('span',{class:'mt-bt'},el('span',{class:'mt-bf',style:'width:'+Math.max(i.v?2:0,(i.v||0)/max*100)+'%;background:'+(i.c||'var(--mt-acc)')})),
    el('b',{class:'mt-bv',text:fmt(i.v)}))));}
function mtStack(items){const t=items.reduce((a,i)=>a+i.v,0);return el('div',{class:'mt-stk'},
  el('div',{class:'mt-sb'},t?items.filter(i=>i.v).map(i=>el('span',{style:'flex:'+i.v+';background:'+i.c,title:i.n+': '+i.v})):el('span',{class:'mt-s0'})),
  el('div',{class:'mt-lg'},items.map(i=>el('span',{},el('i',{style:'background:'+i.c}),i.n+' ',el('b',{text:String(i.v)})))));}
function mtKpi(lbl,val,sub,cls){return el('div',{class:'mt-k'+(cls?' '+cls:'')},el('span',{class:'mt-kl',text:lbl}),el('b',{text:val}),sub?el('small',{text:sub}):null);}
function mtDelta(cur,prev,lowGood){const p=mtPct(cur,prev);if(p==null)return null;const up=p>0;const good=lowGood?!up:up;
  return (Math.abs(p)<0.5?'≈ ':up?'↑ ':'↓ ')+Math.abs(Math.round(p))+'% до мин. міс.';}
function mtKpis(D){const s=D.sos;return [
  mtKpi('Екстрені ситуації',String(s.L.length),s.crit?s.crit+' '+plural(s.crit,'критична','критичні','критичних'):'критичних не було',s.crit?'warn':''),
  mtKpi('Вирішено за місяць',String(s.solved),s.open?s.open+' ще відкрито':'усі закрито'),
  mtKpi('Дебіторська заборгованість',D.debt?uah(D.debt.total,true)+' ₴':'—',D.debt?(D.debt.over>0?'критична: '+uah(D.debt.over,true)+' ₴':(mtDelta(D.debt.total,D.debtPrev&&D.debtPrev.total,true)||D.debt.cnt+' боржників')):'немає даних',D.debt&&D.debt.over>0?'warn':''),
  mtKpi('Сміття',D.waste?fl(D.waste.total)+' л':'—',D.waste?(mtDelta(D.waste.total,D.wastePrev&&D.wastePrev.total,true)||D.waste.cnt+' резидентів'):'немає даних'),
  mtKpi('Вода',D.water?fm3(D.water.total)+' м³':'—',D.water?(D.water.gotP!=null?'зібрано '+Math.round(D.water.gotP)+'% рахунку':D.water.f+' / '+D.water.t+' показників'):'немає даних',D.water&&D.water.lossP>5?'warn':''),
  mtKpi('Паркінг',D.park?Math.round(D.park.occ)+'%':'—',D.park?D.park.c.busy+' в оренді · '+D.park.c.free+' вільних':'немає даних')];}
function mtSevPill(x){const sv=SOS_SEV[x.sev]||SOS_SEV.mid;return el('span',{class:'mt-sev',style:'--sc:'+sv[1]},el('i'),sv[0]);}
function mtStPill(x){const st=SOS_ST[x.status||'open'];return el('span',{class:'mt-st '+(x.status||'open'),text:st[0]});}
function mtDT(t){const d=new Date(t);return pad(d.getDate())+'.'+pad(d.getMonth()+1)+' · '+pad(d.getHours())+':'+pad(d.getMinutes());}
function mtResT(x){if(x.status!=='done'||!x.doneAt)return '—';const d=new Date(x.doneAt);return pad(d.getDate())+'.'+pad(d.getMonth()+1);}
function mtWho(id){const s=staffById(id);return s?s.name:'—';}

/* Screen */
function viewMeet(){if(!canMeet())return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Розділ доступний директору, менеджерам і Dev.'}))];
  const per=S.mtPer||ymd(new Date()).slice(0,7);const D=mtData(per);const tab=S.mtTab||'sum';const out=[];
  out.push(el('section',{class:'mt-hero'},
    el('div',{class:'mt-hl'},el('span',{class:'eyebrow',text:'Звіт для інвестора'}),el('h2',{text:'Нарада з інвестором'}),el('p',{text:'Облік, екстрені ситуації та планове ТО за місяць — одним екраном і у PDF.'})),
    el('div',{class:'mt-hc'},
      el('div',{class:'mt-mon'},el('button',{type:'button','aria-label':'Попередній місяць',onclick:()=>{S.mtPer=perShift(per,-1);render();}},svg('<path d="m15 6-6 6 6 6"/>')),
        el('b',{text:perLabel(per)}),el('button',{type:'button','aria-label':'Наступний місяць',disabled:per>=ymd(new Date()).slice(0,7)?true:null,onclick:()=>{S.mtPer=perShift(per,1);render();}},svg('<path d="m9 6 6 6-6 6"/>'))),
      el('button',{type:'button',class:'btn mt-own',onclick:()=>mtBuilder(per)},svg('<path d="M4 6h10M4 12h16M4 18h7"/><path d="m15 16 2 2 4-4"/>'),' Скласти звіт'),
      el('button',{type:'button',class:'btn mt-pdf',onclick:e=>mtPdf(per,e.currentTarget)},svg('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>'),' Повний PDF'))));
  out.push(el('div',{class:'card mt-doc'},rpMeta(per),canAdmin()?el('button',{type:'button',class:'btn ghost sm',onclick:dirEdit},'Змінити керівника'):null));
  out.push(el('div',{class:'seg full mt-seg'},[['sum','Огляд'],['obl','Облік'],['sos','Екстрені ситуації'],...(D.pm?[['pm','Планове ТО']]:[])].map(([k,l])=>el('button',{type:'button','aria-pressed':String(tab===k),onclick:()=>{S.mtTab=k;render();}},l))));
  if(tab==='sum'){out.push(el('div',{class:'mt-kg'},mtKpis(D)));
    out.push(el('div',{class:'card mt-card'},el('h3',{text:'Головне за '+mtMonLow(per)}),el('ul',{class:'mt-hi'},mtHighlights(D).map(([e,t])=>el('li',{},el('span',{class:'mt-he',text:e}),el('span',{text:t}))))));
    out.push(el('div',{class:'mt-2'},
      el('div',{class:'card mt-card'},el('h3',{text:'Екстрені ситуації за категоріями'}),D.sos.L.length?mtBars(D.sos.cats.filter(c=>c.v).sort((a,b)=>b.v-a.v),v=>String(v)):el('p',{class:'muted',text:'Ситуацій за місяць не було.'})),
      el('div',{class:'card mt-card'},el('h3',{text:'Дебіторська заборгованість за типом платежу'}),D.debt?mtBars(D.debt.by,v=>uah(v,true)+' ₴'):el('p',{class:'muted',text:'Немає даних дебіторки.'}))));}
  if(tab==='obl')out.push(...mtOblScreen(D));
  if(tab==='sos')out.push(...mtSosScreen(D));
  if(tab==='pm')out.push(...mtPmScreen(D));
  out.push(el('div',{class:'card mt-signc'},rpSign(per,false)));
  return out;}
function mtSecHead(id,note){const u=UKS[id];return el('div',{class:'mt-sh'},el('span',{class:'uk-ic',style:'--c1:'+u.c1+';--c2:'+u.c2},svg(u.ic)),el('div',{},el('h3',{text:u.name}),note?el('small',{class:'muted',text:note}):null));}
function mtDataNote(p,per){return p?(p===per?'дані за '+perLabel(p).toLowerCase():'останні дані: '+perLabel(p).toLowerCase()):'немає даних';}
function mtOblScreen(D){const o=[];const per=D.per;
  if(D.waste){const w=D.waste;o.push(el('div',{class:'card mt-card'},mtSecHead('waste',mtDataNote(w.per,per)),
    el('div',{class:'mt-ks'},mtKpi('Вивезено',fl(w.total)+' л',mtDelta(w.total,D.wastePrev&&D.wastePrev.total,true)),mtKpi('Резидентів з вивозом',String(w.cnt),'з '+w.all),mtKpi('Середньо на резидента',w.cnt?fl(w.total/w.cnt)+' л':'—')),
    el('div',{class:'mt-2 in'},el('div',{},el('h4',{text:'По будинках'}),mtBars(w.blds,v=>fl(v)+' л')),el('div',{},el('h4',{text:'Топ-5 резидентів'}),mtBars(w.top.slice(0,5).map(x=>({n:x.n,v:x.v})),v=>fl(v)+' л')))));}
  if(D.water){const w=D.water;o.push(el('div',{class:'card mt-card'},mtSecHead('water',mtDataNote(w.per,per)),
    el('div',{class:'mt-ks'},...mtWaterKpis(w,D)),mtWaterBal(w),
    mtBars(w.objs.map(x=>({n:x.n,v:x.v||0})),v=>fm3(v)+' м³')));}
  if(D.park){const p=D.park;o.push(el('div',{class:'card mt-card'},mtSecHead('park','поточний стан'),
    el('div',{class:'mt-ks'},mtKpi('Заповненість',Math.round(p.occ)+'%'),mtKpi('Усього місць',String(p.n)),mtKpi('Вільні',String(p.c.free))),
    mtStack([{n:'Зайнято',v:p.c.busy,c:'#2a78d6'},{n:'Службові (УК)',v:p.c.uk,c:'#1baf7a'},{n:'Бронь',v:p.c.res,c:'#eda100'},{n:'Вільні',v:p.c.free,c:'#b7c4c6'}])));}
  if(D.inv){const v=D.inv;o.push(el('div',{class:'card mt-card'},mtSecHead('res',v.date?'інвентаризація від '+dm(v.date):'поточний стан'),
    el('div',{class:'mt-ks'},mtKpi('Позицій',String(v.n)),mtKpi('В експлуатації',String(v.use)),mtKpi('На зберіганні',String(v.store)),mtKpi('Потребують ремонту',String(v.fix.length),v.fix.slice(0,3).join(', ')||null,v.fix.length?'warn':'')),
    mtBars(v.cats.slice(0,6),x=>String(x))));}
  if(D.cons)o.push(el('div',{class:'card mt-card'},...mtConsBody(D.cons,false)));
  if(D.debt){const d=D.debt;o.push(el('div',{class:'card mt-card'},mtSecHead('debt',mtDataNote(d.per,per)),
    mtDebtCards(d,false),
    el('div',{class:'mt-2 in'},el('div',{},el('h4',{text:'За типом платежу'}),mtBars(d.by,v=>uah(v,true)+' ₴')),el('div',{},el('h4',{text:'Строки заборгованості'}),mtAging(d))),
    d.top.length?el('div',{class:'mt-tw'},el('table',{class:'mt-t'},el('thead',{},el('tr',{},['Резидент','Будинок','Типи платежів','Борг'].map(h=>el('th',{text:h})))),
      el('tbody',{},d.top.slice(0,8).map(r=>el('tr',{},el('td',{text:r.n}),el('td',{text:r.bld||'—'}),el('td',{text:[...r.s].join(', ')}),el('td',{class:'num',text:uah(r.v,true)+' ₴'})))))):null));
    if(D.debtCmp)o.push(dzCmpBlock(D.debtCmp));}
  if(!o.length)o.push(el('div',{class:'card empty'},el('p',{class:'muted',text:'Даних обліку поки немає.'})));
  return o;}
function mtAging(d){const items=d.aging.filter(a=>a.v>0).map(a=>{const [t,sub]=a.n.split(' · ');return {n:a.k==='ok'?'Строк не настав':(sub?sub[0].toUpperCase()+sub.slice(1)+' ('+t+')':t),v:Math.round(a.v),c:a.c};});
  if(!items.length)return el('p',{class:'muted small',style:'margin:0',text:'Простроченої заборгованості немає.'});
  const st=mtStack(items);st.querySelectorAll('.mt-lg b').forEach(b=>{b.textContent=uah(+b.textContent,true)+' ₴';});return st;}
function mtWaterKpis(w,D){return [mtKpi('Спожито резидентами',fm3(w.total)+' м³',mtDelta(w.total,D.waterPrev&&D.waterPrev.total,true)),mtKpi('Загальнобудинкові',fm3(w.mains)+' м³'),
  mtKpi('Рахунок Водоканалу',w.bill!=null?fm3(w.bill)+' м³':'—',w.billUah?uah(+w.billUah,true)+' ₴':(w.bill==null?'не внесено':null)),
  mtKpi('Нестача / втрати УК',w.loss==null?'—':fm3(Math.max(0,w.loss))+' м³',w.lossP!=null?Math.round(w.lossP*10)/10+'% рахунку'+(w.price&&w.loss>0?' · ≈ '+Math.round(w.loss*w.price).toLocaleString('uk-UA')+' грн':''):null,w.lossP>5?'warn':'')];}
function mtWaterBal(w){if(w.gotP==null)return el('p',{class:'muted small',style:'margin:0',text:'Рахунок Водоканалу за місяць не внесено — баланс не розраховано.'});
  return el('div',{},el('h4',{text:'Баланс з рахунком Водоканалу'}),mtStack([{n:'Перевиставлено резидентам · '+Math.round(w.gotP)+'%',v:Math.round(w.got),c:'#2BB3C9'},{n:'Нестача УК · '+Math.round(w.lossP)+'%',v:Math.round(Math.max(0,w.loss)),c:w.lossP>5?'#D9483B':'#E8892C'}]));}
function mtConsBody(c,pdf){const head=pdf?(()=>{const u=UKS.res;return el('div',{class:'rp-sh'},el('span',{class:'rp-ic',style:'background:linear-gradient(135deg,'+u.c1+','+u.c2+')'},svg(u.ic)),el('div',{},el('h3',{text:'Витратні матеріали'}),el('small',{text:'дані за '+perLabel(c.per).toLowerCase()})));})()
    :el('div',{class:'mt-sh'},el('span',{class:'uk-ic',style:'--c1:'+UKS.res.c1+';--c2:'+UKS.res.c2},svg(UKS.res.ic)),el('div',{},el('h3',{text:'Витратні матеріали'}),el('small',{class:'muted',text:'дані за '+perLabel(c.per).toLowerCase()})));
  return [head,el('div',{class:pdf?'rp-ks':'mt-ks'},mtKpi('Видач за місяць',String(c.outs)),mtKpi('Надходжень',String(c.ins)),mtKpi('Позицій на складі',String(c.n)),mtKpi('Закінчуються',String(c.low.length),c.low.slice(0,3).map(x=>x.name).join(', ')||null,c.low.length?'warn':'')),
    c.outs?el('div',{class:pdf?'rp-2 in':'mt-2 in'},el('div',{},el('h4',{text:'ТОП матеріалів'}),mtBars(c.top.slice(0,5).map(x=>({n:x.n,v:x.v})),v=>v+' '+plural(v,'видача','видачі','видач'))),
      el('div',{},el('h4',{text:'Кому видавали'}),mtBars(c.staff.slice(0,5),v=>v+' '+plural(v,'раз','рази','разів')))):el('p',{class:pdf?'rp-mut':'muted small',text:'Видач за місяць не було.'})];}
function mtSosScreen(D){const s=D.sos;const o=[];
  o.push(el('div',{class:'mt-kg four'},mtKpi('Усього за місяць',String(s.L.length),'минулого місяця: '+D.sosPrev.L.length),mtKpi('Вирішено за місяць',String(s.solved),'успішно закрито'),mtKpi('Критичні',String(s.crit),null,s.crit?'warn':''),mtKpi('Ще відкрито',String(s.open),s.carry.length?'+ '+s.carry.length+' з минулих місяців':null,s.open?'warn':'')));
  o.push(el('div',{class:'mt-2'},el('div',{class:'card mt-card'},el('h3',{text:'За категоріями'}),mtBars(s.cats,v=>String(v))),
    el('div',{class:'card mt-card'},el('h3',{text:'За терміновістю'}),mtStack(s.sev),s.carry.length?el('p',{class:'muted small',style:'margin:12px 0 0',text:'Ще '+s.carry.length+' '+plural(s.carry.length,'ситуація перейшла','ситуації перейшли','ситуацій перейшли')+' з попередніх місяців.'}):null)));
  o.push(el('div',{class:'card mt-card'},el('h3',{text:'Розпис ситуацій'}),s.L.length?el('div',{class:'mt-tl'},s.L.map(x=>{const c=sosCat(x.cat);
    return el('button',{type:'button',class:'mt-ti',style:'--cc:'+c.c,onclick:()=>sosDetail(x.id)},el('span',{class:'mt-td',text:mtDT(sosT(x))}),el('span',{class:'mt-tc'},svg(c.ic)),
      el('span',{class:'mt-tm'},el('b',{text:x.title}),el('small',{text:[c.n,x.bld?'Буд. '+x.bld:'',x.place].filter(Boolean).join(' · ')}),el('span',{class:'mt-tp'},mtSevPill(x),mtStPill(x))));})):
    el('p',{class:'muted',text:'За '+mtMonLow(D.per)+' екстрених ситуацій не було.'})));
  return o;}

/* PDF */
async function saveFile(name,blob){const api=window.claude&&claude.use?await claude.use('downloads').catch(()=>null):null;
  if(api){try{await api.save({filename:name,data:blob});toast('Файл готовий');}catch(e){if(e&&e.code!=='declined')toast('Не вдалося зберегти файл');}return;}
  const u=URL.createObjectURL(blob);const a=el('a',{href:u,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('Файл готовий');}
let _pdfP=null;function loadPdfLibs(){if(window.html2canvas&&window.jspdf)return Promise.resolve();if(!_pdfP){const ld=src=>new Promise((res,rej)=>{const sc=document.createElement('script');sc.src=src;sc.onload=res;sc.onerror=()=>rej(new Error(src));document.head.append(sc);});
  _pdfP=Promise.all([ld('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),ld('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')]).catch(e=>{_pdfP=null;throw e;});}return _pdfP;}
const MT_OPTS=[['Загальне',[['kpi','Ключові показники','6 цифр місяця'],['hi','Головне за місяць','короткі висновки текстом']]],
 ['Екстрені ситуації',[['sosSum','Підсумки','скільки, вирішено, критичні, відкриті'],['sosCharts','Графіки','за категоріями й терміновістю'],['sosList','Розпис ситуацій','таблиця всіх подій місяця']]],
 ['Планове ТО',[['pmSum','Підсумки ТО','проведено, успішні, вчасно, графіки'],['pmList','Проведені ТО','таблиця з відповідальними й коментарями'],['pmPlan','Що потребує уваги','прострочені, найближчі 30 днів, неуспішні']]],
 ['Облік',[['debt','Дебіторська заборгованість','5 карток, типи платежу, строки'],['debtTop','Найбільші боржники','таблиця топ-10'],['debtCmp','Порівняння з минулим періодом','борг тоді й зараз, погашено'],['waste','Сміття','вивіз по будинках і резидентах'],['water','Вода','споживання по об’єктах'],['park','Паркінг','заповненість місць'],['inv','Інвентар','позиції та ремонт'],['cons','Витратні матеріали','видачі, ТОП, працівники, залишки']]]];
function MT_ALL(){const o={};MT_OPTS.forEach(([,l])=>l.forEach(([k])=>o[k]=true));return o;}
function mtScope(O){const a=[];if(O.debt||O.waste||O.water||O.park||O.inv||O.cons)a.push('облік');if(O.sosSum||O.sosCharts||O.sosList)a.push('екстрені ситуації');if(O.pmSum||O.pmList||O.pmPlan)a.push('планове ТО');return a.length?a.join(' і '):'підсумки місяця';}
function mtBuilder(per){let O;try{O=JSON.parse(localStorage.getItem('dl.mtOpt')||'null');}catch(e){}O=Object.assign(MT_ALL(),O||{});O.note='';O.title='';let P=per;
  const D0=()=>mtData(P);let D=D0();const has={pmSum:!!D.pm,pmList:!!D.pm,pmPlan:!!D.pm,debt:!!D.debt,debtTop:!!(D.debt&&D.debt.top.length),debtCmp:!!D.debtCmp,waste:!!D.waste,water:!!D.water,park:!!D.park,inv:!!D.inv,cons:!!D.cons,sosList:true};
  const cnt=el('b',{});const upd=()=>{const n=Object.keys(MT_ALL()).filter(k=>O[k]).length;cnt.textContent=n?n+' '+plural(n,'блок','блоки','блоків'):'нічого не вибрано';go.disabled=!n;};
  const opt=([k,t,d])=>{const b=el('button',{type:'button',class:'rb-o','aria-pressed':String(!!O[k]),disabled:has[k]===false?true:null,onclick:()=>{O[k]=!O[k];b.setAttribute('aria-pressed',String(O[k]));if(k==='debt'&&!O.debt){O.debtTop=false;O.debtCmp=false;['debtTop','debtCmp'].forEach(x=>grid.querySelector('[data-k='+x+']').setAttribute('aria-pressed','false'));}upd();}},
      el('span',{class:'rb-c'},svg('<path d="m5 12 5 5 9-10"/>')),el('span',{class:'rb-t'},el('b',{text:t}),el('small',{text:has[k]===false?'немає даних за цей місяць':d})));b.dataset.k=k;return b;};
  const grid=el('div',{class:'rb-g'},MT_OPTS.map(([g,l])=>el('div',{class:'rb-grp'},el('div',{class:'rb-gh'},el('span',{text:g}),
      el('button',{type:'button',class:'rb-all',onclick:()=>{const on=!l.every(([k])=>O[k]||has[k]===false);l.forEach(([k])=>{if(has[k]!==false)O[k]=on;});grid.querySelectorAll('.rb-o').forEach(b=>b.setAttribute('aria-pressed',String(!!O[b.dataset.k])));upd();}},'усі')),
    el('div',{class:'rb-l'},l.map(opt)))));
  const ttl=el('input',{type:'text',placeholder:'Нарада з інвестором',maxlength:'60'});const note=el('textarea',{rows:'3',placeholder:'Наприклад: план робіт на листопад, на що звернути увагу…',maxlength:'800'});
  const go=el('button',{type:'button',class:'btn mt-pdf',onclick:async()=>{O.title=ttl.value.trim();O.note=note.value.trim();const save={...O};delete save.note;delete save.title;try{localStorage.setItem('dl.mtOpt',JSON.stringify(save));}catch(e){}closeSheet();await mtPdf(P,null,O);}},svg('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>'),' Сформувати PDF');
  openSheet(el('div',{class:'notes-head'},el('span',{class:'nh-ic',text:'🧩'}),el('div',{},el('h2',{style:'margin:0',text:'Скласти звіт'}),el('span',{class:'muted small',text:'Виберіть, що потрапить у PDF · '+perLabel(P)}))),
    grid,el('label',{class:'rb-f'},el('span',{class:'t-lbl',text:'Назва звіту'}),ttl),el('label',{class:'rb-f'},el('span',{class:'t-lbl',text:'Коментар на першій сторінці (необов’язково)'}),note),
    el('div',{class:'rb-foot'},el('span',{class:'muted small'},'У звіті: ',cnt),go),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));upd();}
function mtRpBlocks(D,O){O=O||MT_ALL();const B=[];const per=D.per;const sec=(id,note)=>{const u=UKS[id];return el('div',{class:'rp-sh'},el('span',{class:'rp-ic',style:'background:linear-gradient(135deg,'+u.c1+','+u.c2+')'},svg(u.ic)),el('div',{},el('h3',{text:u.name}),note?el('small',{text:note}):null));};
  const kp=list=>el('div',{class:'rp-ks'},list.filter(Boolean));
  B.push(el('div',{class:'rp-cover'},el('div',{class:'rp-cv-t'},el('span',{class:'rp-eb',text:'Звіт для інвестора'}),el('h1',{text:O.title||'Нарада з інвестором'}),el('p',{text:perLabel(per)+' · '+mtScope(O)})),rpMeta(per)));
  if(O.note)B.push(el('div',{class:'rp-card rp-note'},el('h3',{text:'Коментар'}),el('p',{text:O.note})));
  if(O.kpi)B.push(el('div',{class:'rp-kg'},mtKpis(D)));
  if(O.hi)B.push(el('div',{class:'rp-card'},el('h3',{text:'Головне за '+mtMonLow(per)}),el('ul',{class:'rp-hi'},mtHighlights(D).map(([e,t])=>el('li',{},el('span',{class:'mt-he',text:e}),el('span',{text:t}))))));
  const s=D.sos;if(O.sosSum||O.sosCharts||O.sosList)B.push({h2:'Екстрені ситуації'});
  if(O.sosSum)B.push(el('div',{class:'rp-kg four'},mtKpi('Усього за місяць',String(s.L.length)),mtKpi('Вирішено за місяць',String(s.solved),'успішно закрито'),mtKpi('Критичні',String(s.crit),null,s.crit?'warn':''),mtKpi('Ще відкрито',String(s.open),null,s.open?'warn':'')));
  if(O.sosCharts)B.push(el('div',{class:'rp-2'},el('div',{class:'rp-card'},el('h4',{text:'За категоріями'}),mtBars(s.cats,v=>String(v))),el('div',{class:'rp-card'},el('h4',{text:'За терміновістю'}),mtStack(s.sev))));
  if(!O.sosList);else if(s.L.length)B.push({title:'Розпис ситуацій',cols:['Дата','Категорія','Що сталося','Терміновість','Статус'],w:[50,158,null,96,84],
    rows:s.L.map(x=>{const c=sosCat(x.cat);const d=new Date(sosT(x));return [el('span',{},el('b',{text:pad(d.getDate())+'.'+pad(d.getMonth()+1)}),el('small',{text:pad(d.getHours())+':'+pad(d.getMinutes())})),el('span',{class:'rp-cat'},el('i',{style:'background:'+c.c}),c.n),el('span',{},el('b',{text:x.title}),el('small',{text:[x.bld?'Буд. '+x.bld:'',x.place,'відп.: '+mtWho(x.resp||x.sid)].filter(Boolean).join(' · ')})),mtSevPill(x),mtStPill(x)];})});
  else B.push(el('p',{class:'rp-mut',text:'За '+mtMonLow(per)+' екстрених ситуацій не було.'}));
  if(D.pm&&(O.pmSum||O.pmList||O.pmPlan))B.push(...pmRpBlocks(D.pm,O,false));
  if(O.debt||O.waste||O.water||O.park||O.inv||O.cons)B.push({h2:'Облік'});
  if(O.waste&&D.waste){const w=D.waste;B.push(el('div',{class:'rp-card'},sec('waste',mtDataNote(w.per,per)),kp([mtKpi('Вивезено',fl(w.total)+' л',mtDelta(w.total,D.wastePrev&&D.wastePrev.total,true)),mtKpi('Резидентів з вивозом',String(w.cnt),'з '+w.all),mtKpi('Середньо на резидента',w.cnt?fl(w.total/w.cnt)+' л':'—')]),
    el('div',{class:'rp-2 in'},el('div',{},el('h4',{text:'По будинках'}),mtBars(w.blds,v=>fl(v)+' л')),el('div',{},el('h4',{text:'Топ-5 резидентів'}),mtBars(w.top.slice(0,5),v=>fl(v)+' л')))));}
  if(O.water&&D.water){const w=D.water;B.push(el('div',{class:'rp-card'},sec('water',mtDataNote(w.per,per)),kp(mtWaterKpis(w,D)),mtWaterBal(w),mtBars(w.objs.map(x=>({n:x.n,v:x.v||0})),v=>fm3(v)+' м³')));}
  if(O.cons&&D.cons)B.push(el('div',{class:'rp-card'},...mtConsBody(D.cons,true)));
  if(O.park&&D.park){const p=D.park;B.push(el('div',{class:'rp-card'},sec('park','поточний стан'),kp([mtKpi('Заповненість',Math.round(p.occ)+'%'),mtKpi('Усього місць',String(p.n)),mtKpi('Вільні',String(p.c.free))]),mtStack([{n:'Зайнято',v:p.c.busy,c:'#2a78d6'},{n:'Службові (УК)',v:p.c.uk,c:'#1baf7a'},{n:'Бронь',v:p.c.res,c:'#eda100'},{n:'Вільні',v:p.c.free,c:'#b7c4c6'}])));}
  if(O.inv&&D.inv){const v=D.inv;B.push(el('div',{class:'rp-card'},sec('res',v.date?'інвентаризація від '+dm(v.date):'поточний стан'),kp([mtKpi('Позицій',String(v.n)),mtKpi('В експлуатації',String(v.use)),mtKpi('На зберіганні',String(v.store)),mtKpi('Потребують ремонту',String(v.fix.length))]),mtBars(v.cats.slice(0,6),x=>String(x)),v.fix.length?el('p',{class:'rp-mut',text:'На ремонт: '+v.fix.join(', ')}):null));}
  if(O.debt&&D.debt){const d=D.debt;B.push(el('div',{class:'rp-card'},sec('debt',mtDataNote(d.per,per)),mtDebtCards(d,true),el('div',{class:'rp-2 in'},el('div',{},el('h4',{text:'За типом платежу'}),mtBars(d.by,v=>uah(v,true)+' ₴')),el('div',{},el('h4',{text:'Строки заборгованості'}),mtAging(d)))));
    if(O.debtTop&&d.top.length)B.push({title:'Найбільші боржники',cols:['Резидент','Будинок','Типи платежів','Борг, ₴'],w:[null,80,200,110],num:[3],rows:d.top.slice(0,10).map(r=>[r.n,r.bld||'—',[...r.s].join(', '),uah(r.v)])});
    if(O.debtCmp&&D.debtCmp)B.push(dzCmpBlock(D.debtCmp,{pdf:true}));}
  B.push(rpSign(per,true));
  return B;}
function mtRpPage(per,who,hdr){const pg=el('div',{class:'rp-page'},el('div',{class:'rp-top'},el('span',{class:'rp-logo'},svg('<path d="M5 5l14 14M19 9v10H9"/>'),'DUCK’S LAKE'),el('span',{text:hdr||('Звіт для інвестора · '+perLabel(per))})),el('div',{class:'rp-body'}),
  el('div',{class:'rp-foot'},el('span',{text:'Сформовано '+dm(ymd(new Date()))+'.'+new Date().getFullYear()+(who?' · '+who:'')}),el('span',{class:'rp-pn'})));return pg;}
function mtRpTable(b,rows,cont){return el('div',{class:'rp-tblk'},el('h4',{text:b.title+(cont?' (продовження)':'')}),el('table',{class:'rp-t'},el('colgroup',{},b.cols.map((c,i)=>el('col',{style:b.w&&b.w[i]?'width:'+b.w[i]+'px':null}))),
  el('thead',{},el('tr',{},b.cols.map((c,i)=>el('th',{class:b.num&&b.num.includes(i)?'num':null,text:c})))),el('tbody',{},rows.map(r=>el('tr',{},r.map((c,i)=>el('td',{class:b.num&&b.num.includes(i)?'num':null},c&&c.nodeType?c.cloneNode(true):String(c))))))));}
function mtLayout(host,per,blocks,who,hdr){const pages=[];let pg,body;const LIM=1123-56-44-40;
  const np=()=>{pg=mtRpPage(per,who,hdr);host.append(pg);body=pg.querySelector('.rp-body');pages.push(pg);};np();
  const fits=()=>body.scrollHeight<=LIM;
  for(const b of blocks){
    if(b.h2){const h=el('h2',{class:'rp-h2',text:b.h2});if(body.children.length&&body.scrollHeight>LIM-260){np();}body.append(h);continue;}
    if(b.rows){let i=0,cont=false;while(i<b.rows.length){let n=b.rows.length-i;let t=mtRpTable(b,b.rows.slice(i,i+n),cont);body.append(t);
        while(!fits()&&n>1){t.remove();n=Math.max(1,Math.floor(n*0.75)===n?n-1:Math.floor(n*0.75));t=mtRpTable(b,b.rows.slice(i,i+n),cont);body.append(t);}
        if(!fits()&&body.children.length>1){t.remove();np();continue;}
        // grow back one by one if we undershot
        while(i+n<b.rows.length){const t2=mtRpTable(b,b.rows.slice(i,i+n+1),cont);t.replaceWith(t2);if(fits()){t=t2;n++;}else{t2.replaceWith(t);break;}}
        i+=n;cont=true;if(i<b.rows.length)np();}continue;}
    body.append(b);if(!fits()&&body.children.length>1){b.remove();const last=body.lastElementChild;if(last&&last.classList.contains('rp-h2')){last.remove();np();body.append(last);}else np();body.append(b);}}
  pages.forEach((p,i)=>p.querySelector('.rp-pn').textContent='Сторінка '+(i+1)+' з '+pages.length);return pages;}
async function mtPdf(per,btn,O){if(btn){if(btn.disabled)return;btn.disabled=true;btn.classList.add('busy');}toast('Формую PDF…');
  const host=el('div',{class:'rp-host','aria-hidden':'true'});
  try{await loadPdfLibs();if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    document.body.append(host);const me=myStaff();const D=mtData(per);const pages=mtLayout(host,per,mtRpBlocks(D,O),me&&me.name);
    const {jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'p',unit:'mm',format:'a4',compress:true});
    for(let i=0;i<pages.length;i++){const cv=await html2canvas(pages[i],{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,width:794,height:1123,windowWidth:1200});
      if(i)doc.addPage();doc.addImage(cv.toDataURL('image/jpeg',0.9),'JPEG',0,0,210,297,undefined,'FAST');}
    doc.setProperties({title:((O&&O.title)||'Нарада з інвестором')+' — '+perLabel(per),author:'Duck’s Lake'});
    const blob=doc.output('blob');window.__lastPdf=blob;
    await saveFile('Duck’s Lake — '+(((O&&O.title)||'нарада з інвестором').replace(/[\\/:*?"<>|]/g,''))+', '+perLabel(per)+'.pdf',blob);
  }catch(e){console.error(e);if(typeof logErr==='function')try{logErr('pdf: '+(e&&e.message||e));}catch(_){}toast('Не вдалося сформувати PDF. Перевірте з’єднання й спробуйте ще раз.');}
  finally{if(!window.__keepRp)host.remove();if(btn){btn.disabled=false;btn.classList.remove('busy');}}}
