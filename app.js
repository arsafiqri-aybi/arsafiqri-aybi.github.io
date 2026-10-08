(function(){var cs=[].slice.call(document.querySelectorAll('.card')),ul=document.getElementById('chips');if(!ul)return;
var L=[['semua','Semua'],['rencana','Merencanakan'],['bertindak','Bertindak'],['tampil','Menampilkan'],['bicara','Berkomunikasi']];
L.forEach(function(x){var li=document.createElement('li'),b=document.createElement('button');b.type='button';b.textContent=x[1];b.setAttribute('aria-pressed',x[0]==='semua');
b.onclick=function(){[].forEach.call(ul.querySelectorAll('button'),function(y){y.setAttribute('aria-pressed',y===b)});cs.forEach(function(c){c.hidden=x[0]!=='semua'&&c.dataset.l!==x[0]})};li.appendChild(b);ul.appendChild(li)})})();
