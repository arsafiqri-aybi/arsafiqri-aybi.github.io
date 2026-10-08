
(()=>{'use strict';
const root=document.documentElement, body=document.body;
const themes=['contextual','dark','light'];
let theme='contextual';
try {const stored=localStorage.getItem('ars-theme');if(themes.includes(stored))theme=stored;}catch{}
function applyTheme(){root.dataset.theme=theme;document.querySelectorAll('[data-theme-label]').forEach(el=>el.textContent=theme[0].toUpperCase()+theme.slice(1));document.querySelectorAll('[data-theme-switch]').forEach(el=>el.setAttribute('aria-label','Appearance: '+theme+'. Activate to change theme.'));}
applyTheme();
document.querySelectorAll('[data-theme-switch]').forEach(b=>b.addEventListener('click',()=>{theme=themes[(themes.indexOf(theme)+1)%themes.length];try{localStorage.setItem('ars-theme',theme);}catch{}applyTheme();}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const names=['home','work','expertise','approach','about','connect'];
const choices=[...document.querySelectorAll('[data-rail]')],previews=[...document.querySelectorAll('[data-preview]')];
const explorer=document.querySelector('[data-explorer]');
const pages=[...document.querySelectorAll('[data-page]')];
let selected=0;
function choose(idx,moveFocus=false){if(!choices.length)return;selected=Math.max(0,Math.min(choices.length-1,idx));choices.forEach((c,i)=>{c.setAttribute('aria-current',String(i===selected));c.tabIndex=i===selected?0:-1;});previews.forEach((p,i)=>p.classList.toggle('is-selected',i===selected));root.dataset.context=[0,1,5].includes(selected)?'dark':'light';try{sessionStorage.setItem('ars-section',String(selected));}catch{}const target=choices[selected];if(target){target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});if(moveFocus)target.focus({preventScroll:true});}document.querySelectorAll('[data-rail-step]').forEach(b=>b.disabled=selected===0&&b.dataset.railStep==='-1'||selected===5&&b.dataset.railStep==='1');}
function showFromLocation(){const section=location.hash.replace('#','').toLowerCase();const open=names.includes(section)&&section!=='home'?section:null;if(choices.length){if(open)choose(names.indexOf(open));else if(section==='home')choose(0);else {let stored=0;try{stored=Number(sessionStorage.getItem('ars-section')||0);}catch{}choose(stored);} explorer?.classList.toggle('is-away',Boolean(open));pages.forEach(p=>{const visible=p.dataset.page===open;if(visible)p.dataset.visible='';else delete p.dataset.visible;});root.dataset.context=open?(['work','connect'].includes(open)?'dark':'light'):[0,1,5].includes(selected)?'dark':'light';window.scrollTo({top:0,behavior:'instant'});}}
if(choices.length){choices.forEach((b,i)=>{b.addEventListener('click',()=>choose(i));b.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home','End','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();let n=i;if(e.key==='Home')n=0;else if(e.key==='End')n=choices.length-1;else n=i+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1);choose(n,true);});});document.querySelectorAll('[data-rail-step]').forEach(b=>b.addEventListener('click',()=>choose(selected+Number(b.dataset.railStep),true)));const rail=document.querySelector('.rail-window');
const previewStage=explorer?.querySelector('.preview-stage');
let wheelDistance=0, wheelLastAt=0, wheelLockUntil=0;
const selectWithWheel=e=>{
  // Keep browser zoom, horizontal gestures, and mobile page scrolling native.
  if(window.innerWidth<681||e.ctrlKey||e.metaKey||e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);
  if(Math.abs(delta)<1)return;
  const direction=Math.sign(delta);
  // At either edge, pass the wheel through to the surrounding page.
  if((selected===0&&direction<0)||(selected===choices.length-1&&direction>0)){
    wheelDistance=0;
    return;
  }
  e.preventDefault();
  const now=performance.now();
  if(now-wheelLastAt>180||Math.sign(wheelDistance)!==direction)wheelDistance=0;
  wheelLastAt=now;
  if(now<wheelLockUntil)return;
  wheelDistance+=delta;
  if(Math.abs(wheelDistance)<42)return;
  wheelDistance=0;
  wheelLockUntil=now+240;
  choose(selected+direction);
};
for(const surface of [rail,previewStage])surface?.addEventListener('wheel',selectWithWheel,{passive:false});root.classList.add('is-enhanced');showFromLocation();window.addEventListener('hashchange',showFromLocation);window.addEventListener('popstate',showFromLocation);document.querySelectorAll('[data-open]').forEach(a=>a.addEventListener('click',e=>{const dest=a.dataset.open;if(!names.includes(dest))return;e.preventDefault();if(dest==='home')history.pushState(null,'',location.pathname);else history.pushState(null,'','#'+dest);showFromLocation();}));document.querySelectorAll('[data-back]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState(null,'',location.pathname);showFromLocation();}));}else{root.dataset.context='dark';}
const reader=document.querySelector('[data-reader]');
if(reader){const storyNav=[...document.querySelectorAll('.story-nav a')];const sections=[...document.querySelectorAll('.reading-section')];let requested=false;
const refresh=()=>{requested=false;const reading=reader.getBoundingClientRect().top<=125;root.classList.toggle('reading',reading);root.dataset.context=reading?'light':'dark';let active=sections[0]?.id;for(const s of sections)if(s.getBoundingClientRect().top<180)active=s.id;storyNav.forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+active)));};const schedule=()=>{if(!requested){requested=true;requestAnimationFrame(refresh)}};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);refresh();
}
document.querySelectorAll('.architecture-explorer').forEach(exp=>{const buttons=[...exp.querySelectorAll('[data-node]')],title=exp.querySelector('[data-node-name]'),role=exp.querySelector('[data-node-role]'),link=exp.querySelector('[data-node-link]');buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));title.textContent=button.textContent;role.textContent=button.dataset.role;link.href=button.dataset.source;}));});
if(reduced.matches)root.classList.add('no-motion');
})();