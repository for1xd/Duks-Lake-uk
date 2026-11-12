// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Excel: завантаження й оновлення (спільне)

/* ---------- Excel: завантаження й оновлення (спільне) ---------- */
const IC_DL='<path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M5 19h14"/>',IC_UP='<path d="M12 15V4m0 0-4 4m4-4 4 4"/><path d="M5 19h14"/>';
function ioBtns(exp,imp){return [el('button',{class:'btn ghost sm',type:'button',onclick:exp},svg(IC_DL),' Excel'),imp?el('button',{class:'btn ghost sm',type:'button',title:'Завантажити оновлений Excel-файл',onclick:imp},svg(IC_UP),' Оновити'):null];}
function numP(v,dp){if(v==null||v==='')return null;const k=Math.pow(10,dp==null?2:dp);if(typeof v==='number')return Math.round(v*k)/k;const t=String(v).replace(/[\s ]/g,'').replace(',','.');if(t===''||t==='-'||t==='—')return null;const n=parseFloat(t);return isNaN(n)?null:Math.round(n*k)/k;}
function strP(v){if(v==null)return '';if(v instanceof Date)return ymd(new Date(v.getTime()+12*36e5));return String(v).replace(/\s+/g,' ').trim();}
function dateP(v){if(v==null||v==='')return null;if(v instanceof Date)return ymd(new Date(v.getTime()+12*36e5));if(typeof v==='number'&&v>20000&&v<80000){const d=new Date(Math.round((v-25569)*864e5)+12*36e5);return ymd(d);}
  const s=String(v).trim();let m=s.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{2,4})/);if(m){const y=m[3].length===2?'20'+m[3]:m[3];return y+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');}m=s.match(/^\d{4}-\d{2}-\d{2}/);return m?m[0]:null;}
function lc(s){return String(s||'').toLowerCase().replace(/[\s ]+/g,' ').replace(/[«»"'’`]/g,'').trim();}
async function xlsxPick(){let X;try{X=await loadXlsx();}catch(e){toast('Не вдалося завантажити модуль Excel');return null;}
  return new Promise(res=>{const i=el('input',{type:'file',accept:'.xlsx,.xls,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',style:'position:fixed;left:-9999px;top:0;opacity:0'});document.body.append(i);
    i.addEventListener('change',async()=>{const f=i.files&&i.files[0];i.remove();if(!f){res(null);return;}toast('Читаю файл…');try{const wb=X.read(await f.arrayBuffer(),{cellDates:true});res({wb,X,name:f.name});}catch(e){toast('Не вдалося прочитати файл');res(null);}});
    i.click();});}
function sheetAoa(X,ws){return X.utils.sheet_to_json(ws,{header:1,raw:true,defval:null,blankrows:true});}
function impPreview(title,file,lines,warn,apply){openSheet(el('h2',{text:title}),el('p',{class:'muted',style:'margin:0',text:'Файл: '+file}),
  el('div',{class:'imp-list'},lines.map(([k,v,c])=>el('div',{class:'imp-r'+(c?' '+c:'')},el('span',{text:k}),el('b',{text:v})))),
  warn&&warn.length?el('div',{class:'imp-warn'},warn.slice(0,8).map(w=>el('div',{text:w})),warn.length>8?el('div',{text:'…і ще '+(warn.length-8)}):null):null,
  el('p',{class:'muted small',style:'margin:0',text:'Дані розділу будуть замінені даними з файлу. Щоб повернути попередні — завантажте старий файл.'}),
  el('button',{class:'btn',type:'button',onclick:()=>{closeSheet();write(apply,'Дані оновлено ✓');}},'Оновити дані'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function chg(a){return [a.nw?'+'+a.nw+' нових':'',a.ch?a.ch+' змінено':'',a.del?a.del+' прибрано':''].filter(Boolean).join(' · ')||'без змін';}

/* імпорт: дебіторка */
