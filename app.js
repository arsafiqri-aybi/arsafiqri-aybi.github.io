
(()=>{'use strict';
const root=document.documentElement, body=document.body;
const themes=['contextual','dark','light'];
let theme='contextual';
try {const stored=localStorage.getItem('ars-theme');if(themes.includes(stored))theme=stored;}catch{}
function applyTheme(){root.dataset.theme=theme;document.querySelectorAll('[data-theme-label]').forEach(el=>el.textContent=theme[0].toUpperCase()+theme.slice(1));document.querySelectorAll('[data-theme-switch]').forEach(el=>el.setAttribute('aria-label','Appearance: '+theme+'. Activate to change theme.'));}
applyTheme();

 // Grid review is opt-in: ?grid=1. Normal public portfolio stays unchanged.
 if(new URLSearchParams(location.search).get('grid')==='1'){
   const definitions=[
     ['.topbar','H0 / HEADER','frame'],
     ['.topbar .brand','H1 / LOGO ARS','detail'],
     ['.explorer','01 / EXPLORER CANVAS','frame'],
     ['.explore-frame','01A / OUTER CONTAINER','frame'],
     ['.explore-layout','02 / TWO-COLUMN GRID','frame'],
     ['.section-rail','02A / NAVBAR','area'],
     ['.rail-window','02A.1 / NAV SCROLL AREA','detail'],
     ['.rail-leading-space','02A.0 / EMPTY SLOT','detail'],
     ['.preview-stage','02B / PREVIEW AREA','area'],
     ['[data-preview="home"] .home-composition','HOME / COLUMN GRID','area'],
     ['[data-preview="home"] .identity-copy','HOME A / TEXT','detail'],
     ['[data-preview="home"] .ars-portrait-stage','HOME B / PORTRAIT','detail'],
     ['[data-preview="work"] .work-composition','WORK / COLUMN GRID','area'],
     ['[data-preview="work"] .work-art-focus','WORK A / PROJECT VISUAL','detail'],
     ['[data-preview="work"] .preview-copy','WORK B / TEXT','detail'],
     ['[data-preview="expertise"] .type-composition','EXPERTISE / PREVIEW','area'],
     ['[data-preview="expertise"] .preview-capabilities','EXPERTISE / SKILL LIST','detail'],
     ['[data-preview="approach"] .type-composition','APPROACH / PREVIEW','area'],
     ['[data-preview="about"] .type-composition','ABOUT / PREVIEW','area'],
     ['[data-preview="connect"] .type-composition','CONNECT / PREVIEW','area'],
     ['.quiet-action','CTA / ARROW LINK','action'],
     ['.page','FULL PAGE','frame'],
     ['.page-inside','PAGE / CONTENT FRAME','area'],
     ['.page-heading','PAGE / HEADING','detail'],
     ['.editorial-gallery','WORK / GALLERY','area'],
     ['.curated-work','WORK / PROJECT ROW','area'],
     ['.curated-media','PROJECT / VISUAL','detail'],
     ['.curated-copy','PROJECT / DESCRIPTION','detail'],
     ['.editorial-stack','EXPERTISE / BLOCK LIST','area'],
     ['.capability','EXPERTISE / ITEM','area'],
     ['.capability-note','EXPERTISE / KEYWORDS','detail'],
     ['.capability-media','EXPERTISE / VISUAL','detail'],
     ['.principles','APPROACH / STEPS','area'],
     ['.principles article','APPROACH / STEP','detail'],
     ['.about-layout','ABOUT / TWO-COLUMN GRID','area'],
     ['.about-story','ABOUT / TEXT','detail'],
     ['.about-portrait','ABOUT / PHOTO','detail'],
     ['.contact-simple','CONTACT / MAIN COPY','area'],
     ['.contact-actions','CONTACT / LINKS','detail'],
     ['.showcase','CASE STUDY / HERO','frame'],
     ['.showcase-inside','CASE STUDY / HERO FRAME','area'],
     ['.showcase-title','CASE STUDY / TITLE','detail'],
     ['.showcase-art','CASE STUDY / VISUAL','detail'],
     ['.reader','CASE STUDY / READER','frame'],
     ['.story-nav','CASE STUDY / NAV','area'],
     ['.reading-section','CASE STUDY / SECTION','area'],
     ['.editorial-width','CASE STUDY / CONTENT','detail'],
     ['.context-grid','CASE STUDY / CONTEXT','detail'],
     ['.evidence-pair','CASE STUDY / EVIDENCE','detail'],
     ['.architecture-explorer','CASE STUDY / SYSTEM MAP','detail'],
     ['.next-work','CASE STUDY / NEXT','area']
   ];
   definitions.forEach(([selector,title,level])=>{
     const nodes=[...document.querySelectorAll(selector)];
     nodes.forEach((node,i)=>{
       node.classList.add('grid-inspect');
       node.dataset.gridLevel=level;
       const label=document.createElement('span');
       label.className='grid-box-label';
       label.setAttribute('aria-hidden','true');
       const identifier=node.dataset.page||node.dataset.preview||'';
       label.textContent=title+(identifier?' / '+identifier.toUpperCase():'')+(nodes.length>1?' '+String(i+1).padStart(2,'0'):'');
       node.appendChild(label);
     });
   });
   // Keep inspection mode when moving into individual project routes.
   document.querySelectorAll('a[href]').forEach(a=>{
     const source=a.getAttribute('href');
     if(!source||source.startsWith('#')||source.startsWith('mailto:')||source.startsWith('tel:'))return;
     try{
       const url=new URL(source,location.href);
       if(url.origin!==location.origin)return;
       url.searchParams.set('grid','1');
       a.href=url.pathname+url.search+url.hash;
     }catch{}
   });
   const controls=document.createElement('aside');
   controls.className='grid-review-controls';
   controls.setAttribute('aria-label','Grid review controls');
   const heading=document.createElement('strong');
   heading.className='grid-review-heading';
   heading.textContent='GRID REVIEW / Struktur';
   const description=document.createElement('span');
   description.className='grid-review-legend';
   description.textContent='Biru = area utama · Hijau = komponen · Ungu = tombol';
   const actions=document.createElement('div');
   actions.className='grid-review-actions';
   const toggle=document.createElement('button');
   toggle.type='button';
   toggle.className='grid-review-toggle';
   toggle.textContent='Sembunyikan garis';
   toggle.setAttribute('aria-pressed','true');
   toggle.addEventListener('click',()=>{
     const enabled=document.documentElement.classList.toggle('grid-review');
     toggle.textContent=enabled?'Sembunyikan garis':'Tampilkan garis';
     toggle.setAttribute('aria-pressed',String(enabled));
   });
   const normal=document.createElement('a');
   const cleanUrl=new URL(location.href);
   cleanUrl.searchParams.delete('grid');
   normal.href=cleanUrl.pathname+cleanUrl.search+cleanUrl.hash;
   normal.textContent='Mode normal ↗';
   actions.append(toggle,normal);
   controls.append(heading,description,actions);
   document.body.appendChild(controls);
   document.documentElement.classList.add('grid-review');
 }

document.querySelectorAll('[data-theme-switch]').forEach(b=>b.addEventListener('click',()=>{theme=themes[(themes.indexOf(theme)+1)%themes.length];try{localStorage.setItem('ars-theme',theme);}catch{}applyTheme();}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const names=['home','work','expertise','approach','about','connect'];
const choices=[...document.querySelectorAll('[data-rail]')],previews=[...document.querySelectorAll('[data-preview]')];
const explorer=document.querySelector('[data-explorer]');
const pages=[...document.querySelectorAll('[data-page]')];
let selected=0;
function choose(idx,moveFocus=false){
 if(!choices.length)return;
 const previous=selected;
 selected=Math.max(0,Math.min(choices.length-1,idx));
 const mobile=window.innerWidth<=680;
 const railNav=explorer?.querySelector('.section-rail');
 if(railNav){
   if(mobile&&selected!==previous)railNav.dataset.slideDirection=selected>previous?'next':'prev';
   else if(!mobile)delete railNav.dataset.slideDirection;
 }
 choices.forEach((c,i)=>{
   c.setAttribute('aria-current',String(i===selected));
   c.tabIndex=i===selected?0:-1;
   c.classList.remove('was-active');
   c.classList.toggle('is-next',mobile&&i===selected+1);
   c.classList.toggle('is-prev',mobile&&i===selected-1);
 });
 previews.forEach((p,i)=>p.classList.toggle('is-selected',i===selected));
 root.dataset.context=[0,1,5].includes(selected)?'dark':'light';
 try{sessionStorage.setItem('ars-section',String(selected));}catch{}
 const target=choices[selected];
 if(target){
   const viewport=target.closest('.rail-window');
   if(viewport&&mobile)viewport.scrollLeft=0;
   else if(viewport){
     const itemRect=target.getBoundingClientRect(),viewRect=viewport.getBoundingClientRect();
     viewport.scrollTo({top:Math.max(0,viewport.scrollTop+itemRect.top-viewRect.top-(viewRect.height-itemRect.height)/2),behavior:'instant'});
   }
   if(moveFocus)target.focus({preventScroll:true});
 }
}
function showFromLocation(){const section=location.hash.replace('#','').toLowerCase();const open=names.includes(section)&&section!=='home'?section:null;if(choices.length){if(open)choose(names.indexOf(open));else if(section==='home')choose(0);else {let stored=0;try{stored=Number(sessionStorage.getItem('ars-section')||0);}catch{}choose(stored);} explorer?.classList.toggle('is-away',Boolean(open));pages.forEach(p=>{const visible=p.dataset.page===open;if(visible)p.dataset.visible='';else {delete p.dataset.visible;p.querySelectorAll('video').forEach(v=>v.pause());}});root.dataset.context=open?(['work','connect'].includes(open)?'dark':'light'):[0,1,5].includes(selected)?'dark':'light';window.scrollTo({top:0,behavior:'instant'});}}
// ARS v2 return-to-context enhancement: optional, no effect on plain anchor navigation.
const workOriginKey='ars-v2-work-origin', workReturnKey='ars-v2-work-return';
function storeWorkOrigin(a,e){
 if(e&&((e.button!==undefined&&e.button!==0)||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey))return;
 const id=a.getAttribute('data-gallery-project');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id??''))return;
 const linkIndex=[...document.querySelectorAll('a[data-gallery-project]')].indexOf(a);
 try{sessionStorage.setItem(workOriginKey,JSON.stringify({path:location.pathname,id,linkIndex,scrollY:window.scrollY}));}catch{}
}
document.querySelectorAll('a[data-gallery-project]').forEach(a=>a.addEventListener('click',e=>storeWorkOrigin(a,e)));
document.querySelectorAll('a[data-return-to-work]').forEach(a=>a.addEventListener('click',e=>{
 if((e.button!==undefined&&e.button!==0)||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 try{sessionStorage.setItem(workReturnKey,'1');}catch{}
}));
let pendingWorkRestore=false;
function restoreWorkContext(){
 if(!choices.length||location.hash!=='#work'||pendingWorkRestore)return;
 let recorded,requested=false;
 try{
  const navType=performance.getEntriesByType('navigation')[0]?.type;
  requested=sessionStorage.getItem(workReturnKey)==='1'||navType==='back_forward';
  recorded=JSON.parse(sessionStorage.getItem(workOriginKey)||'null');
 }catch{return;}
 if(!requested||!recorded||recorded.path!==location.pathname||
    typeof recorded.id!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recorded.id)||
    !Number.isFinite(recorded.scrollY)||recorded.scrollY<0)return;
 pendingWorkRestore=true;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  pendingWorkRestore=false;
  if(location.hash!=='#work')return;
  const maxY=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
  window.scrollTo({top:Math.min(recorded.scrollY,maxY),behavior:'instant'});
  const candidates=[...document.querySelectorAll('a[data-gallery-project]')];
  const exact=Number.isSafeInteger(recorded.linkIndex)&&recorded.linkIndex>=0?candidates[recorded.linkIndex]:null;
  const target=exact?.getAttribute('data-gallery-project')===recorded.id?exact:candidates.find(a=>a.getAttribute('data-gallery-project')===recorded.id);
  target?.focus({preventScroll:true});
  try{sessionStorage.removeItem(workReturnKey)}catch{}
 }));
}
if(choices.length){choices.forEach((b,i)=>{b.addEventListener('click',()=>choose(i));b.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home','End','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();let n=i;if(e.key==='Home')n=0;else if(e.key==='End')n=choices.length-1;else n=i+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1);choose(n,true);});});const rail=document.querySelector('.rail-window');
const previewStage=explorer?.querySelector('.preview-stage');

function arrangeMobileRail(){
 if(!rail)return;
 // The one-word rail stays stationary; only the selected label changes.
 rail.scrollLeft=0;
 const nav=rail.closest('.section-rail');
 if(nav)nav.setAttribute('aria-label',window.innerWidth<=680
   ?'Portfolio sections. Swipe left for next and right for previous section.'
   :'Portfolio sections');
 if(window.innerWidth>680){
   choices.forEach(c=>c.classList.remove('was-active'));
 }
}
// Horizontal swipes from anywhere on a mobile preview; page vertical scroll is native.
let mobileTouchStart=null,lastMobileSwipeAt=-Infinity;
const canSwipePreview=()=>window.innerWidth<=680&&
  root.classList.contains('is-enhanced')&&
  explorer&&!explorer.classList.contains('is-away');
document.addEventListener('touchstart',e=>{
  if(!canSwipePreview()||e.touches.length!==1){mobileTouchStart=null;return;}
  const finger=e.touches[0];
  mobileTouchStart={identifier:finger.identifier,x:finger.clientX,y:finger.clientY};
},{passive:true});
document.addEventListener('touchend',e=>{
  if(!mobileTouchStart)return;
  const start=mobileTouchStart;
  mobileTouchStart=null;
  if(!canSwipePreview()||e.touches.length!==0)return;
  const finger=[...e.changedTouches].find(t=>t.identifier===start.identifier);
  if(!finger)return;
  const dx=finger.clientX-start.x,dy=finger.clientY-start.y;
  if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.5)return;
  // LEFT -> next (Home to Work); RIGHT -> previous (Work to Home).
  const next=Math.max(0,Math.min(choices.length-1,selected+(dx<0?1:-1)));
  if(next===selected)return;
  lastMobileSwipeAt=performance.now();
  choose(next);
},{passive:true});
document.addEventListener('touchcancel',()=>{mobileTouchStart=null},{passive:true});
document.addEventListener('click',e=>{
  if(canSwipePreview()&&performance.now()-lastMobileSwipeAt<360){
    e.preventDefault();
    e.stopImmediatePropagation();
  }
},true);
window.addEventListener('resize',()=>requestAnimationFrame(arrangeMobileRail),{passive:true});
requestAnimationFrame(arrangeMobileRail);

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
for(const surface of [rail,previewStage])surface?.addEventListener('wheel',selectWithWheel,{passive:false});// Move focus to the newly shown destination, never leave it on a hidden preview link.
function focusLocationTarget(){
 const section=location.hash.replace('#','').toLowerCase();
 if(names.includes(section)&&section!=='home'){
  const h=pages.find(p=>p.dataset.page===section)?.querySelector('h1');
  if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
 }else choices[selected]?.focus({preventScroll:true});
}
root.classList.add('is-enhanced');showFromLocation();restoreWorkContext();


window.addEventListener('hashchange',()=>{showFromLocation();focusLocationTarget();restoreWorkContext()});
window.addEventListener('popstate',()=>{showFromLocation();focusLocationTarget();restoreWorkContext()});
window.addEventListener('pageshow',e=>{if(e.persisted)restoreWorkContext()});
document.querySelectorAll('.brand').forEach(a=>a.addEventListener('click',e=>{if(!choices.length||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();history.pushState(null,'',location.pathname+location.search+'#home');showFromLocation();focusLocationTarget();}));
 document.querySelectorAll('[data-open]').forEach(a=>a.addEventListener('click',e=>{const dest=a.dataset.open;if(!names.includes(dest))return;e.preventDefault();if(dest==='home')history.pushState(null,'',location.pathname+location.search);else history.pushState(null,'','#'+dest);showFromLocation();focusLocationTarget();}));
document.querySelectorAll('[data-back]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState(null,'',location.pathname+location.search);showFromLocation();focusLocationTarget();}));}else{root.dataset.context='dark';}
const reader=document.querySelector('[data-reader]');
if(reader){const storyNav=[...document.querySelectorAll('.story-nav a')];const sections=[...document.querySelectorAll('.reading-section')];let requested=false;
const refresh=()=>{requested=false;const reading=reader.getBoundingClientRect().top<=125;root.classList.toggle('reading',reading);root.dataset.context=reading?'light':'dark';let active=sections[0]?.id;for(const s of sections)if(s.getBoundingClientRect().top<180)active=s.id;storyNav.forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+active)));};const schedule=()=>{if(!requested){requested=true;requestAnimationFrame(refresh)}};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);refresh();
}
document.querySelectorAll('.architecture-explorer').forEach(exp=>{const buttons=[...exp.querySelectorAll('[data-node]')],title=exp.querySelector('[data-node-name]'),role=exp.querySelector('[data-node-role]'),link=exp.querySelector('[data-node-link]');buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));title.textContent=button.textContent;role.textContent=button.dataset.role;link.href=button.dataset.source;}));});
document.querySelectorAll('[data-motion-player]').forEach(stage=>{
 const video=stage.querySelector('video'),cover=stage.querySelector('[data-motion-play]');
 const error=stage.parentElement?.querySelector('[data-motion-error]');
 if(!video||!cover)return;
 cover.addEventListener('click',()=>{
  const started=video.play();
  if(started&&typeof started.then==='function'){
   started.then(()=>{cover.hidden=true;video.focus({preventScroll:true});if(error)error.textContent='';}).catch(()=>{
    cover.hidden=true;
    if(error)error.textContent='Playback unavailable here. Use the project source link to view the original file.';
   });
  }else{cover.hidden=true}
 });
 video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()}));
 const mediaFailed=()=>{cover.hidden=true;if(error)error.textContent='Playback unavailable here. Use the project source link to view the original file.';};
 video.addEventListener('error',mediaFailed);
 video.querySelectorAll('source').forEach(source=>source.addEventListener('error',mediaFailed));
 root.classList.add('motion-enhanced');
});
if(reduced.matches)root.classList.add('no-motion');
})();
