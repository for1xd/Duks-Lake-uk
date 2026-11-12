// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Облік ресурсів: інвентар

/* ---------- Облік ресурсів: інвентар ---------- */
const INV_CATS=[['tech','Садова та прибиральна техніка','🚜'],['attach','Навісне обладнання','🔩'],['hand','Ручний інвентар','🧹'],['home','Побутова техніка','🧺'],['furn','Меблі та літня зона','⛱️'],['light','Освітлення та гірлянди','💡'],
  ['elec','Кабель та електрика','🔌'],['clim','Кліматичне обладнання','❄️'],['sec','Безпека та знаки','🦺'],['eng','Інженерне обладнання','🛠️'],['decor','Декор і сезонне','🎄'],['other','Інше','📦']];
const INV_KIND={use:'В експлуатації',store:'На зберіганні'};const INV_COND={ok:'Справне',fix:'Потребує ремонту',off:'Списано'};
const INV_OWNS=['УК','ASGARD','Маркетинг'];
function invOwnCol(o){const i=INV_OWNS.indexOf(o);const P=[['#1F6F78','#3aa7a0'],['#6250d6','#9085e9'],['#eb6834','#d95926']];return i<0?'#8FA3A8':P[i][dzDark()?1:0];}
function invCat(id){return INV_CATS.find(c=>c[0]===id)||INV_CATS[INV_CATS.length-1];}
function invGuess(n){const s=lc(n);const R=[['home',['пралк','сушарк','пилосос керхер']],['attach',['для райдера','навісн','відгортачка','прицеп','причеп']],['tech',['stihl','мотокос','газонокос','райдер','снігоприбир','дуйк','пилосос садов','керхер для','оприскувач','насос керхер','генератор','бензопил','тример']],
  ['furn',['стол','стіл','парасол','крісл','шезлонг','шизлонг','шатро','лавк']],['clim',['кондиц','конд.','рефнет','вентиль','hr -']],['light',['прожектор','ламп','гірлянд','ліхтар']],['sec',['пандус','камер','каск','знак','сітка','огорож']],
  ['eng',['лічильник','личильник','колодяз']],['elec',['кабель','сіп','ввг','переноска','щитов','подовжувач','автомат']],['decor',['ялинк','іграш','банер','декор']],
  ['hand',['лопат','грабл','льодокол','мотик','ножиці','пила','щітк','тачк','їжак','лійк','драбин','насос ручний','тара','каністр','катушк','котушк','відро','шланг']]];
  for(const [k,w] of R)if(w.some(x=>s.includes(x)))return k;return 'other';}
function invQtyP(v){if(v==null||v==='')return {qty:null,unit:'шт',qtyText:''};if(typeof v==='number')return {qty:v,unit:'шт',qtyText:''};const s=strP(v);
  let m=s.match(/^(\d+(?:[.,]\d+)?)\s*(шт|м|пари|пара|ящик|ящики|мішки|мішків|мішок|компл|л|кг)?\.?$/i);if(m){const u=(m[2]||'шт').toLowerCase();return {qty:parseFloat(m[1].replace(',','.')),unit:{пара:'пари',мішків:'мішки',мішок:'мішки',ящики:'ящик'}[u]||u,qtyText:''};}
  m=s.match(/(\d+(?:[.,]\d+)?)/);return {qty:m?parseFloat(m[1].replace(',','.')):null,unit:/\bм\b/.test(s)?'м':'шт',qtyText:s};}
function invQtyS(r){if(r.qtyText)return r.qtyText;if(r.qty==null)return '—';return String(r.qty).replace('.',',')+' '+(r.unit||'шт');}
function invDoc(){return S.inv.main||null;}
function invRows(){const d=invDoc();if(!d||!d.rows)return [];return Object.entries(d.rows).filter(([,r])=>r).map(([id,r])=>({id,...r})).sort((a,b)=>(a.order||0)-(b.order||0));}
