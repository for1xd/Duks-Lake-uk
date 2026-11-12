// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Облік сміття

/* ---------- Облік сміття ---------- */
const WS_LOC='Окремо на локації';const WS_ORD=['1.3','1.2','2','4'];
const WS_PAL=[['#2a78d6','#3987e5'],['#eb6834','#d95926'],['#1baf7a','#199e70'],['#eda100','#c98500'],['#6250d6','#9085e9'],['#e87ba4','#d55181'],['#008300','#008300'],['#e34948','#e66767']];
function fl(v){return v==null||isNaN(v)?'—':Math.round(v).toLocaleString('uk-UA');}
function wsPers(){return Object.keys(S.ws).filter(k=>S.ws[k]&&S.ws[k].rows).sort();}
function wsCurPer(){if(S.wsPer)return S.wsPer;const now=ymd(new Date()).slice(0,7);const ps=wsPers().filter(p=>p<=now);return ps.length?ps[ps.length-1]:ymd(new Date()).slice(0,7);}
function wsRows(per){const d=S.ws[per];if(!d||!d.rows)return [];return Object.entries(d.rows).filter(([,r])=>r).map(([id,r])=>({id,...r,bld:dzBld(r.bld)||WS_LOC})).sort((a,b)=>(a.order||0)-(b.order||0));}
function wsBlds(rows){const set=[...new Set(rows.map(r=>r.bld))];return set.sort((a,b)=>{const k=x=>x===WS_LOC?999:WS_ORD.includes(x)?WS_ORD.indexOf(x):100;return k(a)-k(b)||a.localeCompare(b,'uk',{numeric:true});});}
function wsAllBlds(){const all=new Set();wsPers().forEach(p=>wsRows(p).forEach(r=>all.add(r.bld)));return wsBlds([...all].map(b=>({bld:b})));}
function wsCol(b){const i=wsAllBlds().indexOf(b);const c=WS_PAL[(i<0?0:i)%WS_PAL.length];return c[dzDark()?1:0];}
function wsName(b){return b===WS_LOC?WS_LOC:'Будинок '+b;}
function wsPerBar(per){const exists=!!S.ws[per];return el('div',{class:'w-per card'},
  el('button',{class:'iconbtn',type:'button','aria-label':'Попередній місяць',onclick:()=>{S.wsPer=perShift(per,-1);render();}},svg('<path d="M15 5l-7 7 7 7"/>')),
  el('div',{class:'w-per-c'},el('b',{text:perLabel(per)}),el('span',{class:'muted small',text:exists?'звітний період':'ще не створено'})),
  el('button',{class:'iconbtn',type:'button','aria-label':'Наступний місяць',onclick:()=>{S.wsPer=perShift(per,1);render();}},svg('<path d="m9 5 7 7-7 7"/>')));}
function wsSetVol(per,id,raw){const t=String(raw).trim().replace(/\s/g,'').replace(',','.');const v=t===''||t==='-'?null:Math.round(parseFloat(t)*10)/10;if(t!==''&&t!=='-'&&isNaN(v)){toast('Введіть число, л');render();return;}
  write(()=>S.db.doc('waste/'+per).update({rows:{[id]:{vol:v,at:Date.now(),by:S.myId}}}),'Збережено');}
function wasteView(){const per=wsCurPer();const out=[wsPerBar(per)];const can=canW();
  if(!S.ws[per]){out.push(el('div',{class:'card empty'},el('span',{class:'w-drop big',style:'background:linear-gradient(135deg,#2E8B5E,#7BC47F)'},svg(UKS.waste.ic)),el('h2',{text:'Період ще не створено'}),
    el('p',{class:'muted',text:'Перенесемо резидентів, які користуються вивозом, з попереднього місяця — залишиться внести обсяги. Нових додасте з еталонної бази.'}),can?el('button',{class:'btn',type:'button',onclick:()=>wsNewPeriod(per)},'Створити «'+perLabel(per)+'»'):null));return out;}
  const rows=wsRows(per);const blds=wsBlds(rows);const tot=rows.reduce((a,r)=>a+(+r.vol||0),0);const inB=rows.filter(r=>r.bld!==WS_LOC).reduce((a,r)=>a+(+r.vol||0),0);
  const filled=rows.filter(r=>r.vol!=null).length;const ps=wsPers();const prev=ps.filter(p=>p<per).pop();const pt=prev?wsRows(prev).reduce((a,r)=>a+(+r.vol||0),0):null;const ch=pt?((tot-pt)/pt*100):null;
  const withV=rows.filter(r=>+r.vol>0);const avg=withV.length?tot/withV.length:0;
  out.push(el('div',{class:'dz-filters'},el('div',{class:'dz-acts'},...ioBtns(()=>wsExport(per),can?()=>wsImport(per):null),can?el('button',{class:'btn sm',type:'button',onclick:()=>wsPick(per)},'+ Додати резидента'):null)));
  out.push(el('div',{class:'ws-kpi'},
    el('div',{class:'card dz-k hero'},el('span',{text:'Вивезено сміття за місяць'}),el('b',{},fl(tot),el('small',{text:' л'})),ch!=null?el('span',{class:'ws-trend',text:(ch>0?'▲ +':ch<0?'▼ ':'')+ch.toFixed(1).replace('.',',')+'% до '+perLabel(prev).split(' ')[0].toLowerCase()}):el('small',{text:'≈ '+(tot/1000).toLocaleString('uk-UA',{maximumFractionDigits:1})+' м³'})),
    (()=>{const bb=blds.map(b=>[b,rows.filter(r=>r.bld===b).reduce((a,r)=>a+(+r.vol||0),0)]).sort((a,b)=>b[1]-a[1])[0]||['—',0];return el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Найбільше сміття — будинок'}),el('b',{text:bb[0]===WS_LOC?'Локація':'Буд. '+bb[0]}),el('small',{class:'muted',text:fl(bb[1])+' л · '+(tot?Math.round(bb[1]/tot*100):0)+'% усього вивозу'}));})(),
    (()=>{const tr=[...withV].sort((a,b)=>b.vol-a.vol)[0];return el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Найбільший резидент'}),el('b',{class:'ws-kn',text:tr?tr.tenant:'—'}),el('small',{class:'muted',text:tr?fl(tr.vol)+' л · '+(tot?(tr.vol/tot*100).toFixed(1).replace('.',','):0)+'% · середнє '+fl(avg)+' л':''}));})(),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Внесено обсягів'}),el('b',{text:filled+' / '+rows.length}),el('div',{class:'w-prog'},el('i',{style:'width:'+(rows.length?Math.round(filled/rows.length*100):0)+'%;background:linear-gradient(90deg,#2E8B5E,#7BC47F)'})))));
  // charts
  const bv=blds.map(b=>({b,v:rows.filter(r=>r.bld===b).reduce((a,r)=>a+(+r.vol||0),0),n:rows.filter(r=>r.bld===b).length}));const bMax=Math.max(1,...bv.map(x=>x.v));
  const bCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'За будинками'}),el('span',{class:'muted small',text:'літри'})),el('div',{class:'dz-bars'},bv.map(x=>hov(el('div',{class:'dz-br'},el('span',{class:'dz-bl'},el('i',{style:'background:'+wsCol(x.b)}),x.b===WS_LOC?'Локація':'Буд. '+x.b),el('div',{class:'dz-bt'},el('span',{style:'width:'+(x.v/bMax*100)+'%;background:'+wsCol(x.b)})),el('b',{text:fl(x.v)})),
    ()=>[el('b',{text:wsName(x.b)}),el('div',{text:fl(x.v)+' л · '+(tot?Math.round(x.v/tot*100):0)+'%'}),el('div',{class:'muted',text:x.n+' резидентів'})]))));
  const allTop=rows.filter(r=>+r.vol>0).sort((a,b)=>b.vol-a.vol);const top=S.wsAll?allTop:allTop.slice(0,5);const tMax=Math.max(1,...top.map(r=>+r.vol));const c3=allTop.slice(0,3).reduce((a,r)=>a+(+r.vol),0);
  const tCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Рейтинг резидентів за обсягом'}),el('span',{class:'muted small',text:allTop.length+' з вивозом'})),el('p',{class:'ws-note'},'Перші 3 резиденти дають ',el('b',{text:(tot?Math.round(c3/tot*100):0)+'%'}),' усього сміття'),el('div',{class:'dz-top'},top.map((r,i)=>hov(el('div',{class:'dz-tr ws-tr'},
    el('span',{class:'dz-tn'},el('em',{text:String(i+1)}),el('span',{text:r.tenant}),el('i',{class:'dz-dot',style:'background:'+wsCol(r.bld)})),el('div',{class:'dz-seg'},el('span',{style:'width:'+(r.vol/tMax*100)+'%;background:'+wsCol(r.bld)})),el('b',{text:fl(r.vol)}),el('small',{class:'ws-pc',text:(tot?(r.vol/tot*100).toFixed(1).replace('.',','):0)+'%'})),
    ()=>[el('b',{text:r.tenant}),el('div',{text:fl(r.vol)+' л · '+(tot?(r.vol/tot*100).toFixed(1).replace('.',','):0)+'% від усього'}),el('div',{class:'muted',text:wsName(r.bld)+(r.floor?' · поверх '+r.floor:'')})])),allTop.length>5?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.wsAll=!S.wsAll;render();}},S.wsAll?'Згорнути':'Показати всіх ('+allTop.length+')'):null));
  const segs=bv.filter(x=>x.v>0);let acc=0;const R=60,C=2*Math.PI*R;
  const donut=el('div',{class:'ws-donut'});donut.innerHTML='<svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="'+R+'" fill="none" stroke="var(--surface-2)" stroke-width="22"/>'+segs.map(x=>{const f=x.v/(tot||1);const len=Math.max(0,f*C-2);const o='<circle cx="80" cy="80" r="'+R+'" fill="none" stroke="'+wsCol(x.b)+'" stroke-width="22" stroke-dasharray="'+len+' '+(C-len)+'" stroke-dashoffset="'+(-acc*C)+'" transform="rotate(-90 80 80)"><title>'+(x.b===WS_LOC?'Локація':'Буд. '+x.b)+': '+Math.round(f*100)+'%</title></circle>';acc+=f;return o;}).join('')+'</svg>';
  donut.append(el('div',{class:'ws-dc'},el('b',{text:(tot/1000).toLocaleString('uk-UA',{maximumFractionDigits:1})}),el('small',{text:'м³ за місяць'})));
  const mv=ps.filter(p=>p<=per).slice(-6).map(p=>({p,t:wsRows(p).reduce((a,r)=>a+(+r.vol||0),0)}));
  const mCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Частка будинків'}),el('span',{class:'muted small',text:perLabel(per)})),
    el('div',{class:'ws-pie'},donut,el('div',{class:'ws-pl'},segs.sort((a,b)=>b.v-a.v).map(x=>el('div',{class:'ws-pli'},el('i',{style:'background:'+wsCol(x.b)}),el('span',{text:x.b===WS_LOC?'Окремо на локації':'Будинок '+x.b}),el('b',{text:Math.round(x.v/(tot||1)*100)+'%'}),el('small',{text:fl(x.v)+' л'}))))),
    mv.length>1?el('div',{class:'ws-hist'},mv.map(x=>el('button',{type:'button',class:'ws-hm'+(x.p===per?' cur':''),onclick:()=>{S.wsPer=x.p;render();}},el('small',{text:perLabel(x.p).split(' ')[0].slice(0,3)}),el('b',{text:Math.round(x.t/1000)+' м³'})))):el('p',{class:'muted small',style:'margin:0',text:'Порівняння по місяцях з’явиться з наступного місяця.'}));
  out.push(el('div',{class:'dz-grid ws-mas'},bCard,tCard,mCard,(()=>{const nil=rows.filter(r=>r.vol==null);return el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Без даних за місяць'}),el('span',{class:'muted small',text:nil.length+' резид.'})),
    nil.length?el('div',{class:'dz-resp'},nil.map(r=>el('span',{class:'dz-rc'},el('b',{text:r.tenant}),el('small',{text:wsName(r.bld)})))):el('p',{class:'muted',style:'margin:0',text:'Усі обсяги внесено ✓'}),
    el('p',{class:'muted small',style:'margin:0',text:'«—» означає, що вивозу не було або дані ще не внесені.'}));})()));
  out.push(wsTable(per,rows,blds,can));
  return out;}
/* Еталон резидентів — ДЗ OPEX за останній місяць */
function wsRef(){const ks=Object.keys(S.dz||{}).filter(k=>k.endsWith('_opex')).sort();const d=ks.length?S.dz[ks[ks.length-1]]:null;if(!d||!d.rows)return [];
  const seen=new Set();return Object.entries(d.rows).filter(([,r])=>r&&!r.deleted&&String(r.tenant||'').trim()).map(([id,r])=>{const bld=/інші|окремо/i.test(r.bld||'')?WS_LOC:(dzBld(r.bld)||WS_LOC);
    const room=String(r.room||'').trim();const m=room.match(/^\D{0,2}(\d{3,})/);const floor=m?String(Math.floor(+m[1]/100)):'';
    return {rid:'opex:'+id,tenant:String(r.tenant).trim(),bld,room,floor,order:r.order||0};}).filter(x=>{const k=x.bld+'|'+x.tenant.toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});}
const wsKey=r=>r.rid||((r.bld||'')+'|'+String(r.tenant||'').trim().toLowerCase());
/* «Додати резидента»: пошук по еталону, назва/приміщення/поверх підтягуються автоматично */
function wsPick(per,relink){const ref=wsRef();if(!ref.length){toast('Немає еталонних резидентів — спершу заповніть ДЗ OPEX');return;}
  const list=el('div',{class:'wsp-list',role:'listbox'});const inp=el('input',{type:'search',placeholder:'Назва резидента або приміщення…','aria-label':'Пошук резидента',autocomplete:'off'});
  const draw=()=>{const have=new Set(wsRows(per).map(wsKey));const q=inp.value.trim().toLowerCase();
    const items=ref.filter(x=>!q||(x.tenant+' '+x.room+' '+x.bld).toLowerCase().includes(q));const blds=wsBlds(items);
    list.replaceChildren(...(items.length?blds.map(b=>el('div',{class:'wsp-g'},el('div',{class:'wsp-gh'},el('i',{style:'background:'+wsCol(b)}),wsName(b)),
      items.filter(x=>x.bld===b).sort((a,c)=>a.order-c.order).map(x=>{const added=have.has(x.rid)||have.has(x.bld+'|'+x.tenant.toLowerCase());
        return el('button',{type:'button',class:'wsp-it'+(added?' added':''),disabled:added&&!relink?true:null,onclick:()=>wsAddRef(per,x,relink).then(()=>{if(relink)closeSheet();else{draw();inp.focus();}})},
          el('span',{class:'wsp-t'},el('b',{text:x.tenant}),el('small',{text:[x.room?'прим. '+x.room:'',x.floor?'поверх '+x.floor:''].filter(Boolean).join(' · ')||wsName(x.bld)})),
          el('span',{class:'wsp-st',text:added?'✓ у списку':'+ Додати'}));}))):[el('p',{class:'muted',style:'margin:8px 0',text:'Нічого не знайдено в еталонній базі OPEX.'})]));};
  inp.addEventListener('input',draw);
  openSheet(el('h2',{text:relink?'Прив’язати до еталону':'Додати резидента'}),el('p',{class:'muted small',style:'margin:0',text:relink?'«'+relink.tenant+'» → оберіть резидента з еталонної бази OPEX. Обсяг збережеться.':'Лише резиденти, які користуються вивозом. Назва, приміщення й поверх беруться з еталонної бази OPEX.'}),inp,list,
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Готово'));draw();if(!IS_TOUCH)inp.focus();}
async function wsAddRef(per,x,relink){const rows=wsRows(per);
  const d={tenant:x.tenant,bld:x.bld,room:x.room,floor:x.floor,rid:x.rid,at:Date.now(),by:S.myId};
  if(relink){await write(()=>S.db.doc('waste/'+per).update({rows:{[relink.id]:d}}),'Прив’язано до еталону');return;}
  d.vol=null;d.order=rows.reduce((a,r)=>Math.max(a,r.order||0),0)+1;
  await write(()=>S.db.doc('waste/'+per).update({rows:{['w'+Date.now().toString(36)]:d}}),'Додано: '+x.tenant);}
/* Резиденти: одна таблиця, згрупована по будинках (акордеон), без порожніх зон */
function wsTable(per,rows,blds,can){const q=(S.wsQ||'').toLowerCase();S.wsOpen=S.wsOpen||{};
  const qi=el('input',{type:'search',placeholder:'Пошук резидента…',value:S.wsQ||'','aria-label':'Пошук резидента'});qi.addEventListener('input',()=>{S.wsQ=qi.value;const p=qi.selectionStart;render();const n=document.querySelector('.wst-tools input[type=search]');if(n){n.focus();n.setSelectionRange(p,p);}});
  const fltr=r=>!q||[r.tenant,r.floor,r.room].join(' ').toLowerCase().includes(q);
  const card=el('div',{class:'card wst'},el('div',{class:'wst-hd'},el('div',{},el('h2',{text:'Резиденти з вивозом'}),el('span',{class:'muted small',text:rows.length+' резидентів · '+blds.length+' об’єктів'})),el('div',{class:'wst-tools'},qi)),
    el('div',{class:'wst-row wst-h',role:'row'},el('span',{text:'Пов.'}),el('span',{text:'Прим.'}),el('span',{text:'Орендар'}),el('span',{text:'Обсяг, л'})));
  const leg=rows.filter(r=>!r.rid);if(can&&leg.length){const nm=s=>String(s||'').toLowerCase().replace(/[’'"«»`ʼ.,]/g,'').replace(/\s+/g,' ').trim();const ref=wsRef();
    const hits=leg.map(r=>[r,ref.filter(x=>x.bld===r.bld&&nm(x.tenant)===nm(r.tenant))]).filter(([,m])=>m.length===1);
    card.insertBefore(el('div',{class:'wst-bn'},el('span',{},el('b',{text:leg.length+' '+plural(leg.length,'резидент','резиденти','резидентів')+' не прив’язано до еталону OPEX.'}),el('small',{class:'muted',text:hits.length?' Точних збігів назв: '+hits.length+'. Інших — натисніть на назву й оберіть з еталону.':' Натисніть на назву й оберіть з еталону.'})),
      hits.length?el('button',{class:'btn sm',type:'button',onclick:async()=>{const ch={};hits.forEach(([r,[x]])=>{ch[r.id]={tenant:x.tenant,bld:x.bld,room:x.room,floor:r.floor||x.floor,rid:x.rid};});await write(()=>S.db.doc('waste/'+per).update({rows:ch}),'Прив’язано: '+hits.length);}},'Прив’язати збіги ('+hits.length+')'):null),card.children[1]);}
  if(!rows.length)card.append(el('div',{class:'wst-empty'},el('p',{class:'muted',style:'margin:0',text:'Ще нікого не додано. Додайте резидентів, які користуються вивозом сміття від УК.'}),can?el('button',{class:'btn sm',type:'button',onclick:()=>wsPick(per)},'+ Додати резидента'):null));
  blds.forEach(b=>{const all=rows.filter(r=>r.bld===b);const rs=all.filter(fltr);if(!rs.length)return;const sm=all.reduce((a,r)=>a+(+r.vol||0),0);const nf=all.filter(r=>r.vol!=null).length;
    const open=q?true:S.wsOpen[b]!==false;const sec=el('section',{class:'wst-g'+(open?' open':'')});
    const head=el('button',{type:'button',class:'wst-gh','aria-expanded':String(open),onclick:()=>{S.wsOpen[b]=!open;render();}},
      el('i',{class:'wst-dot',style:'background:'+wsCol(b)}),el('b',{text:wsName(b)}),el('span',{class:'muted small',text:all.length+' · внесено '+nf+'/'+all.length}),el('span',{class:'wst-sum',text:fl(sm)+' л'}),el('span',{class:'wst-chev'},svg('<path d="m6 9 6 6 6-6"/>')));
    sec.append(head);
    if(open)rs.forEach(r=>{const legacy=!r.rid;
      sec.append(el('div',{class:'wst-row',role:'row'},el('span',{class:'wst-fl',text:r.floor||'—'}),el('span',{class:'wst-rm',text:r.room||'—'}),
        el('button',{type:'button',class:'wst-tn'+(can?' ed':''),onclick:()=>can?wsEdit(per,r):null},el('b',{text:r.tenant||'—'}),legacy?el('small',{class:'wst-warn',text:'не прив’язано до еталону'}):(sm&&+r.vol>0?el('span',{class:'ws-share'},el('span',{style:'width:'+(r.vol/sm*100)+'%;background:'+wsCol(b)})):null)),
        can?(()=>{const i=el('input',{type:'text',inputmode:'decimal',class:'w-in ws-in','data-k':'ws.'+r.id,'aria-label':'Обсяг сміття '+r.tenant,value:r.vol==null?'':String(r.vol).replace('.',','),placeholder:'—'});
          i.addEventListener('focus',()=>i.select());i.addEventListener('change',()=>wsSetVol(per,r.id,i.value));i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const all=[...document.querySelectorAll('.ws-in')];const k=all.indexOf(i);if(all[k+1])all[k+1].focus();else i.blur();}});return i;})()
        :el('span',{class:'ws-v'+(r.vol==null?' nil':''),text:r.vol==null?'—':fl(r.vol)})));});
    card.append(sec);});
  const tot=rows.reduce((a,r)=>a+(+r.vol||0),0);if(rows.length)card.append(el('div',{class:'wst-row wst-f'},el('span'),el('span'),el('span',{text:'Разом'}),el('span',{class:'ws-v',text:fl(tot)+' л'})));
  return card;}
function wsEdit(per,r){const isNew=!r;r=r||{};const blds=wsAllBlds();
  const mk=(id,lbl,val,o)=>{const i=el('input',{id,value:val==null?'':String(val),...(o||{})});return [i,el('label',{for:id},lbl,i)];};
  const [tn,tnL]=mk('wsT','Орендар / резидент',r.tenant);const [bl,blL]=mk('wsB','Будинок',r.bld||(blds[0]||''),{list:'wsBl'});const [fl_,flL]=mk('wsF','Поверх',r.floor);const [vo,voL]=mk('wsV','Сміття за місяць, л',r.vol==null?'':String(r.vol).replace('.',','),{inputmode:'decimal',placeholder:'—'});
  if(r.rid){tn.disabled=true;bl.disabled=true;}
  openSheet(el('h2',{text:isNew?'Новий резидент':'Редагувати резидента'}),r.rid?el('p',{class:'muted small',style:'margin:0',text:'Назва й будинок — з еталонної бази OPEX'+(r.room?' · приміщення '+r.room:'')}):(!isNew?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{closeSheet();wsPick(per,r);}},'Прив’язати до еталону OPEX'):null),el('datalist',{id:'wsBl'},[...new Set([...WS_ORD,...blds,WS_LOC])].map(x=>el('option',{value:x}))),tnL,el('div',{class:'grid2'},blL,flL),voL,
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const t=vo.value.trim().replace(/\s/g,'').replace(',','.');const v=t===''||t==='-'?null:Math.round(parseFloat(t)*10)/10;if(t!==''&&t!=='-'&&isNaN(v)){toast('Обсяг: введіть число');return;}
      const d={tenant:tn.value.trim(),bld:r.rid?r.bld:(dzBld(bl.value)||WS_LOC),floor:fl_.value.trim(),vol:v,at:Date.now(),by:S.myId};if(r.rid)d.tenant=r.tenant;if(!d.tenant){toast('Вкажіть резидента');return;}closeSheet();
      if(isNew){d.order=wsRows(per).reduce((a,x)=>Math.max(a,x.order||0),0)+1;write(()=>S.db.doc('waste/'+per).update({rows:{['w'+Date.now().toString(36)]:d}}),'Додано');}
      else write(()=>S.db.doc('waste/'+per).update({rows:{[r.id]:d}}),'Збережено');}},isNew?'Додати':'Зберегти'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Прибрати «'+r.tenant+'» з цього місяця?','Прибрати',()=>write(()=>S.db.doc('waste/'+per).update({rows:{[r.id]:null}}),'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function wsNewPeriod(per){const prev=wsPers().filter(p=>p<per).pop();const rows={};if(prev)wsRows(prev).forEach(r=>{rows[r.id]={bld:r.bld,floor:r.floor||'',room:r.room||'',rid:r.rid||null,tenant:r.tenant,vol:null,order:r.order||0};});
  write(()=>S.db.doc('waste/'+per).set({per,rows,at:Date.now(),by:S.myId}),'Місяць «'+perLabel(per)+'» створено');}
/* Excel для бухгалтерії: одна вертикальна таблиця + підсумок по будинках */
function wsXlsx(ExcelJS,per,rows){const wb=new ExcelJS.Workbook();wb.creator='Duck’s Lake';wb.created=new Date();
  const NAVY='FF1A365D',LINE='FFB8C4D2',B=()=>{const s={style:'thin',color:{argb:LINE}};return {top:s,left:s,bottom:s,right:s};};
  const ws=wb.addWorksheet('Облік сміття',{views:[{state:'frozen',ySplit:1,showGridLines:false}],properties:{tabColor:{argb:'FF2E8B5E'}}});
  ws.columns=[{header:'Об’єкт (Будинок)',key:'b',width:22},{header:'Поверх',key:'f',width:9},{header:'Номер приміщення',key:'r',width:16},{header:'Орендар',key:'t',width:40},{header:'Обсяг сміття за місяць (л)',key:'v',width:18}];
  const h=ws.getRow(1);h.height=32;h.eachCell(c=>{c.font={name:'Calibri',size:11,bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:NAVY}};c.alignment={vertical:'middle',horizontal:'center',wrapText:true};c.border=B();});
  const order=wsBlds(rows);const nk=v=>{const n=parseFloat(String(v||'').replace(',','.'));return isNaN(n)?1e9:n;};
  const sorted=[...rows].sort((a,b)=>order.indexOf(a.bld)-order.indexOf(b.bld)||nk(a.floor)-nk(b.floor)||nk(a.room)-nk(b.room)||(a.order||0)-(b.order||0));
  const num=v=>v===''||v==null?null:(/^\d+$/.test(String(v))?+v:String(v));let zebra=false,prev=null;
  sorted.forEach(r=>{if(r.bld!==prev){zebra=!zebra;prev=r.bld;}const row=ws.addRow({b:r.bld===WS_LOC?WS_LOC:'Будинок '+r.bld,f:num(r.floor),r:num(r.room),t:r.tenant||'',v:r.vol==null||r.vol===''?null:+r.vol});
    row.eachCell({includeEmpty:true},(c,i)=>{c.border=B();c.font={name:'Calibri',size:11};c.alignment={vertical:'middle',horizontal:i===4||i===1?'left':i===5?'right':'center',wrapText:i===4};if(zebra)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF5F8FC'}};});
    row.getCell(5).numFmt='#,##0';});
  const last=ws.rowCount;const tr=ws.addRow({b:'РАЗОМ',v:{formula:'SUM(E2:E'+Math.max(2,last)+')',result:rows.reduce((a,r)=>a+(+r.vol||0),0)}});
  ws.mergeCells(tr.number,1,tr.number,4);tr.height=22;
  for(let i=1;i<=5;i++){const c=tr.getCell(i);c.border={...B(),top:{style:'medium',color:{argb:NAVY}}};c.font={name:'Calibri',size:12,bold:true};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFDCE6F1'}};c.alignment={vertical:'middle',horizontal:i===5?'right':'left',indent:i===1?1:0};}
  tr.getCell(5).numFmt='#,##0';
  ws.autoFilter={from:{row:1,column:1},to:{row:Math.max(1,last),column:5}};
  ws.pageSetup={paperSize:9,orientation:'portrait',fitToPage:true,fitToWidth:1,fitToHeight:0,printTitlesRow:'1:1',margins:{left:0.4,right:0.4,top:0.5,bottom:0.6,header:0.3,footer:0.3}};
  ws.headerFooter={oddHeader:'&L&B Облік сміття · '+perLabel(per),oddFooter:'&LDuck’s Lake&RСторінка &P з &N'};
  /* Підсумок по будинках — формули SUMIF по основній таблиці */
  const s2=wb.addWorksheet('Підсумок по будинках',{views:[{state:'frozen',ySplit:1,showGridLines:false}]});
  s2.columns=[{header:'Об’єкт (Будинок)',key:'b',width:24},{header:'Резидентів',key:'n',width:12},{header:'Обсяг за місяць (л)',key:'v',width:20}];
  s2.getRow(1).eachCell(c=>{c.font={bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:NAVY}};c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.border=B();});s2.getRow(1).height=28;
  const R="'Облік сміття'!";order.forEach(b=>{const name=b===WS_LOC?WS_LOC:'Будинок '+b;const rs=rows.filter(r=>r.bld===b);const row=s2.addRow({b:name,n:{formula:'COUNTIF('+R+'$A$2:$A$'+last+',A'+(s2.rowCount+1)+')',result:rs.length},v:{formula:'SUMIF('+R+'$A$2:$A$'+last+',A'+(s2.rowCount+1)+','+R+'$E$2:$E$'+last+')',result:rs.reduce((a,r)=>a+(+r.vol||0),0)}});
    row.eachCell(c=>{c.border=B();});row.getCell(3).numFmt='#,##0';row.getCell(2).alignment={horizontal:'center'};});
  const l2=s2.rowCount;const t2=s2.addRow({b:'РАЗОМ',n:{formula:'SUM(B2:B'+l2+')',result:rows.length},v:{formula:'SUM(C2:C'+l2+')',result:rows.reduce((a,r)=>a+(+r.vol||0),0)}});
  t2.eachCell(c=>{c.border={...B(),top:{style:'medium',color:{argb:NAVY}}};c.font={bold:true};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFDCE6F1'}};});t2.getCell(3).numFmt='#,##0';t2.getCell(2).alignment={horizontal:'center'};
  return wb;}
async function wsExport(per){toast('Готую файл…');let EJ;try{EJ=await loadExcelJS();}catch(e){toast('Не вдалося завантажити модуль Excel — перевірте інтернет');return;}
  try{const buf=await wsXlsx(EJ,per,wsRows(per)).xlsx.writeBuffer();await saveFile('Облік сміття — '+perLabel(per)+'.xlsx',new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));}
  catch(e){console.error(e);toast('Не вдалося сформувати файл');}}
