// Перевірка рушія нормалізації: node tools/norm-check.js
// Бере код між маркерами NORM:BEGIN / NORM:END з index.html, тож тестує саме те, що працює в застосунку.
const fs=require('fs');const src=fs.readFileSync(__dirname+'/../index.html','utf8');
const code=src.slice(src.indexOf('/* NORM:BEGIN'),src.indexOf('/* NORM:END */'));
const {NR,normalizeResidentData}=new Function(code+';return {NR,normalizeResidentData};')();
const ref=NR.buildRef([
  {bld:'1.2',room:'101',tenant:'Волков'},{bld:'1.2',room:'104',tenant:'Федоренко'},
  {bld:'1.2',room:'105',tenant:'ФОП Дриганик Віталій, Sparkle'},{bld:'1.2',room:'106,107,108',tenant:'3Ф Логістик, Галицький'},
  {bld:'1.2',room:'301',tenant:'Зіновєв А.З.'},{bld:'1.2',room:'301',tenant:'Бурда В. А.'},
  {bld:'1.3',room:'201',tenant:'КлаудСпарк'},{bld:'1.3',room:'301',tenant:'ПРОКРЕДИТ БАНК'},{bld:'4',room:'',tenant:'Маме норі'}]);
const cases=[
  ['Волков','','1.2','Волков','101'],['Федоренко "Мейсон"','кім. 104','Будинок 1.2','Федоренко','104'],
  ['ор. ФОП Шепіда, Sparkle','','1.2','ФОП Дриганик Віталій, Sparkle','105'],['Спаркл','офіс 105','1.2','ФОП Дриганик Віталій, Sparkle','105'],
  ['ЗФ Логістік, Галицький','кім. 107','1.2','3Ф Логістик, Галицький','107'],
  ['Зіновєв А.З. та Бурда В. А.','','1.2','Зіновєв А.З. та Бурда В. А.','301'],
  ['Claudspark','','1.3','КлаудСпарк','201'],['ProCredit Bank','','1.3','ПРОКРЕДИТ БАНК','301'],['Маменорі','','4','Маме норі',''],
];
let bad=0;for(const [n,r,b,en,er] of cases){const x=normalizeResidentData(n,r,b,{ref});const ok=x.status==='auto'&&x.resident.name===en&&x.room===er;
  if(!ok)bad++;console.log(ok?'OK  ':'FAIL',JSON.stringify(n),r,'→',x.status,x.resident&&x.resident.name,x.room,x.score);}
for(const t of ['Діючий загальнобудинковий','Поверх 5 (вільно)']){const x=normalizeResidentData(t,'','1.3',{ref});const ok=x.status==='skip';if(!ok)bad++;console.log(ok?'OK  ':'FAIL',t,'→',x.status);}
console.log(bad?bad+' помилок':'Усе гаразд');process.exit(bad?1:0);
