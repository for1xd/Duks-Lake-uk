// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Інлайн-скрипти з <head>/<body>: логотип, екран завантаження.

/* ЛОГОТИП-ІКОНКА Duck's Lake — єдине джерело геометрії (еталонний SVG). Не змінювати пропорції. */
window.DL_LOGO_SVG='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dlg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A6576"/><stop offset="1" stop-color="#044F5E"/></linearGradient></defs><rect width="100" height="100" fill="url(#dlg)"/><g stroke="#FFFFFF" stroke-width="6.4" fill="none" stroke-linecap="butt" stroke-linejoin="miter"><path d="M34 30 L90 89"/><path d="M90.7 13 L90.7 93 L14 93"/></g></svg>';
/* екземпляр: унікальний id градієнта; стилі ліній продубльовано інлайн, щоб CSS застосунку (stroke-width, linecap для svg) їх не перебив;
   draw:true — класи для промальовування (діагональ, потім плечі від кута назовні) */
window.dlLogoHTML=function(o){o=o||{};var id='dlg'+(++dlLogoHTML.n);var h=DL_LOGO_SVG.replace('id="dlg"','id="'+id+'"').replace('url(#dlg)','url(#'+id+')')
  .replace('<svg ','<svg class="dl-logo'+(o.cls?' '+o.cls:'')+'" '+(o.label?'role="img" aria-label="'+o.label+'" ':'aria-hidden="true" focusable="false" '))
  .replace('<g ','<g style="stroke:#FFFFFF;stroke-width:6.4;fill:none;stroke-linecap:butt;stroke-linejoin:miter" ');
  if(o.draw)h=h.replace('<path d="M34 30 L90 89"/>','<path class="dl-d" pathLength="1" d="M34 30 L90 89"/>').replace('<path d="M90.7 13 L90.7 93 L14 93"/>','<path class="dl-a" pathLength="156.7" d="M90.7 13 L90.7 93 L14 93"/>');
  return h;};dlLogoHTML.n=0;
(function(){var l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.href='data:image/svg+xml,'+encodeURIComponent(DL_LOGO_SVG);document.head.appendChild(l);})();
/* Екран завантаження: етапи приходять із boot() (реальні події бази), мінімум ~700 мс показу, плавний вихід */
window.DLS=(function(){var t0=performance.now(),root=document.getElementById('dlSplash'),$=function(i){return document.getElementById(i);};
  var ic=$('dlsIc');ic.insertAdjacentHTML('beforeend',dlLogoHTML({draw:true}));
  var arm=ic.querySelector('.dl-a');if(arm)arm.addEventListener('animationend',function(){ic.querySelectorAll('.dl-d,.dl-a').forEach(function(p){p.removeAttribute('class');p.removeAttribute('pathLength');});});
  try{if(document.fonts&&document.fonts.check('700 15px Unbounded'))root.classList.add('uf');}catch(e){}
  var st=$('dlsSt'),bar=$('dlsBar'),fin=false,failed=false,greet=false,ft=null,cur=st.textContent;
  function txt(t,hi){if(t===cur)return;cur=t;clearTimeout(ft);st.style.opacity='0';ft=setTimeout(function(){st.textContent=t;st.classList.toggle('hi',!!hi);st.style.opacity='1';},200);}
  function prog(p){bar.firstChild.style.setProperty('--p',String(Math.max(.06,Math.min(1,p))));}
  var slow=setTimeout(function(){if(!fin&&!failed)$('dlsSlow').hidden=false;},8000);
  return {
    stage:function(t,p){if(fin||failed)return;if(p!=null){prog(p);if(p>=.6)$('dlsSlow').hidden=true;}if(!greet&&t)txt(t);},
    hi:function(name){if(fin||failed||greet||!name)return;greet=true;var h=new Date().getHours();txt((h>=5&&h<12?'Доброго ранку':h<18&&h>=12?'Доброго дня':h>=18&&h<23?'Доброго вечора':'Доброї ночі')+', '+name,true);},
    fail:function(title,msg){if(fin)return;failed=true;clearTimeout(slow);bar.hidden=true;st.hidden=true;$('dlsSlow').hidden=true;$('dlsErrT').textContent=title||'Не вдалося завантажити';$('dlsErrM').textContent=msg||'';$('dlsErr').hidden=false;},
    done:function(){if(fin||failed)return;fin=true;clearTimeout(slow);prog(1);var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
      var wait=Math.max(0,(rm?300:700)-(performance.now()-t0))+(greet?450:0);if(/splash/.test(location.hash+location.search))wait=Math.max(wait,6000);/* перегляд: …#splash */
      setTimeout(function(){root.classList.add('out');setTimeout(function(){root.remove();},rm?220:330);},wait);},
    get active(){return !fin&&!!root.isConnected;}};})();
