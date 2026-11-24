// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Екстрені ситуації: email-сповіщення відповідальному

/* ---------- Екстрені ситуації: email-сповіщення відповідальному ---------- */
const SOS_MAIL={sent:['Лист надіслано','ok'],failed:['Лист не надіслано','law'],noemail:['Немає email відповідального','warn'],sim:['Лист сформовано (пошта недоступна)','info']};
function sosMail(x,kind){const c=sosCat(x.cat);const sv=SOS_SEV[x.sev]||SOS_SEV.mid;const st=SOS_ST[x.status||'open'];const who=staffById(x.sid);const resp=staffById(x.resp);
  const tag=x.sev==='crit'?'[CRITICAL]':'[EMERGENCY]';const where=[c.n.replace(/\u00ad/g,''),x.bld?'Будинок '+x.bld:''].filter(Boolean).join(' / ');
  const subject=tag+' Нова екстрена ситуація в Duck’s Lake — '+where;
  const rows=[['Що сталося',x.title],['Категорія',c.n.replace(/\u00ad/g,'')],['Будинок / зона',x.bld?'Будинок '+x.bld:'не вказано'],['Точне місце',x.place||'—'],['Терміновість',sv[0]+' — '+sv[2]],['Статус',st[0]],['Коли сталося',dm(ymd(new Date(sosT(x))))+' о '+hm(sosT(x))],['Повідомив',(who?who.name:'—')+', '+dm(ymd(new Date(x.at)))+' о '+hm(x.at)],['Відповідальний',resp?resp.name:'—']];
  const urg=x.sev==='crit'?'ПОТРІБНЕ НЕГАЙНЕ ВИРІШЕННЯ. Приступіть до усунення зараз і оновіть статус у застосунку.':'Ситуація потребує термінового вирішення. Візьміть її в роботу та оновіть статус у застосунку.';
  const body=(kind==='assign'?'Вас призначено відповідальним за екстрену ситуацію.\n\n':'Зафіксовано нову екстрену ситуацію, ви — відповідальний.\n\n')+rows.map(([a,b])=>a+': '+b).join('\n')+(x.desc?'\n\nОпис:\n'+x.desc:'')+'\n\n'+urg+'\n\nВідкрити: '+APP_URL;
  const col=x.sev==='crit'?'#B4232A':'#C9650C';
  const htmlBody='<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F2A33;max-width:560px"><p style="color:#1F6F78;font-weight:bold;letter-spacing:1px;margin:0 0 8px">DUCK’S LAKE · ЕКСТРЕНІ СИТУАЦІЇ</p>'+
    '<div style="background:'+col+';color:#fff;border-radius:10px;padding:12px 14px;margin:0 0 12px"><b style="font-size:13px;letter-spacing:1px">'+escH(tag)+'</b><div style="font-size:18px;font-weight:bold;margin-top:4px">'+escH(x.title)+'</div></div>'+
    '<table style="border-collapse:collapse;width:100%;margin:0 0 12px">'+rows.slice(1).map(([a,b])=>'<tr><td style="padding:6px 8px;color:#53686F;border-bottom:1px solid #E1E6E5;width:40%">'+escH(a)+'</td><td style="padding:6px 8px;border-bottom:1px solid #E1E6E5;font-weight:bold">'+escH(b)+'</td></tr>').join('')+'</table>'+
    (x.desc?'<p style="white-space:pre-wrap;background:#F4F8F7;border-radius:8px;padding:10px 12px;margin:0 0 12px">'+escH(x.desc)+'</p>':'')+
    '<p style="border-left:4px solid '+col+';padding:8px 12px;background:#FBEAEA;border-radius:6px;font-weight:bold;margin:0 0 14px">'+escH(urg)+'</p>'+
    '<p><a href="'+APP_URL+'" style="background:#1F6F78;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Відкрити ситуацію</a></p></div>';
  return {to:resp&&resp.email?resp.email.trim():'',subject,body,htmlBody};}
async function sosNotify(x,kind){if(!x||!x.resp)return;const resp=staffById(x.resp);const mail=sosMail(x,kind);const e={at:Date.now(),kind:kind||'new',to:mail.to,name:resp?resp.name:'',subject:mail.subject,status:'sim',err:''};
  if(!mail.to){e.status='noemail';}
  else{const mcp=await claude.use('mcp').catch(()=>null);
    if(mcp){try{await mcp.callTool('Gmail','send_message',{to:[mail.to],subject:mail.subject,body:mail.body,htmlBody:mail.htmlBody});e.status='sent';}catch(err){e.status='failed';e.err=String(err&&err.message||err).slice(0,200);}}}
  const cur=(S.sos||[]).find(i=>i.id===x.id);try{await S.db.doc('incidents/'+x.id).update({mail:[...((cur&&cur.mail)||x.mail||[]),e]});}catch(_){}
  toast(e.status==='sent'?'Лист надіслано: '+(resp?resp.name:mail.to):e.status==='noemail'?'У відповідального немає email — лист не надіслано':e.status==='failed'?'Не вдалося надіслати лист':'Лист сформовано, але пошта недоступна');}
function sosMailBadge(x){const l=(x.mail||[]).slice(-1)[0];if(!l)return null;const m=SOS_MAIL[l.status]||SOS_MAIL.sim;return el('span',{class:'sos-mb t-'+m[1],title:m[0]+(l.to?' · '+l.to:'')},'✉ '+(l.status==='sent'?'надіслано':l.status==='noemail'?'без email':l.status==='failed'?'помилка':'сформовано'));}
function sosMailLog(x){const L=x.mail||[];if(!x.resp&&!L.length)return null;
  return el('div',{class:'sos-mail'},el('span',{class:'flabel',text:'Сповіщення на пошту'}),
    L.length?L.slice().reverse().map(e=>{const m=SOS_MAIL[e.status]||SOS_MAIL.sim;return el('div',{class:'sos-ml'},el('span',{class:'pill t-'+m[1]},el('i'),m[0]),el('span',{class:'sos-mlt'},el('b',{text:e.subject}),el('small',{class:'muted',text:(e.name||'')+(e.to?' · '+e.to:'')+' · '+dm(ymd(new Date(e.at)))+' '+hm(e.at)+(e.err?' · '+e.err:'')})));}):el('p',{class:'muted small',style:'margin:0',text:'Листів ще не надсилали.'}),
    el('div',{class:'row',style:'gap:6px'},x.resp?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{closeSheet();sosNotify(x,'resend');}},L.length?'Надіслати ще раз':'Надіслати сповіщення'):null,
      el('button',{class:'btn ghost sm',type:'button',onclick:()=>{const m=sosMail(x,'new');openSheet(el('h2',{text:'Перегляд листа'}),el('p',{class:'muted small',style:'margin:0',text:'Кому: '+(m.to||'— email не вказано —')}),el('p',{style:'margin:0;font-weight:800',text:m.subject}),el('div',{class:'sos-mprev',html:''},(()=>{const d=el('div');d.innerHTML=m.htmlBody;return d;})()),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));}},'Переглянути лист')));}
