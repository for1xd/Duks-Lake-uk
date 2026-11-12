// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Вода: Excel для бухгалтерії (формат вихідної таблиці)

/* ---------- Вода: Excel для бухгалтерії (формат вихідної таблиці) ---------- */
let _xlsxSP=null;function loadXlsxStyle(){if(window.XLSX&&window.XLSX.style_version)return Promise.resolve(window.XLSX);if(!_xlsxSP)_xlsxSP=new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js';sc.onload=()=>res(window.XLSX);sc.onerror=()=>{_xlsxSP=null;rej(new Error('xlsx-style'));};document.head.append(sc);});return _xlsxSP;}
function wExportMenu(per){openSheet(el('h2',{text:'Вивантажити в Excel'}),el('p',{class:'muted',style:'margin:0',text:perLabel(per)}),
  el('button',{type:'button',class:'w-xo main',onclick:()=>{closeSheet();wExportX(per,'acc');}},el('span',{class:'w-xi',text:'🧾'}),el('span',{},el('b',{text:'Для бухгалтерії'}),el('small',{text:'аркуш на кожен будинок, лише лічильники резидентів, «Спожито» — формулами'}))),
  el('button',{type:'button',class:'w-xo',onclick:()=>{closeSheet();wExportX(per,'full');}},el('span',{class:'w-xi',text:'📊'}),el('span',{},el('b',{text:'Повний облік'}),el('small',{text:'дашборд: рахунок Водоканалу, відхилення по будинках, перевірка даних + аркуші з загальнобудинковими'}))),
  el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
