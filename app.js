
(()=>{'use strict';
const root=document.documentElement, body=document.body;
const themes=['contextual','dark','light'];
let theme='contextual';
try {const stored=localStorage.getItem('ars-theme');if(themes.includes(stored))theme=stored;}catch{}
function applyTheme(){root.dataset.theme=theme;document.querySelectorAll('[data-theme-label]').forEach(el=>el.textContent=theme[0].toUpperCase()+theme.slice(1));document.querySelectorAll('[data-theme-switch]').forEach(el=>el.setAttribute('aria-label','Appearance: '+theme+'. Activate to change theme.'));}
applyTheme();

document.querySelectorAll('[data-theme-switch]').forEach(b=>b.addEventListener('click',()=>{theme=themes[(themes.indexOf(theme)+1)%themes.length];try{localStorage.setItem('ars-theme',theme);}catch{}applyTheme();}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Shared runtime mobile breakpoint; matches CSS @media(max-width:680px).
const MOBILE_BREAKPOINT=680;
const names=['home','work','expertise','approach','about','connect'];
// Android's top-level chapters; deeper desktop topics live under About.
const mobileChapters=[0,1,4,5];
const mobileParent=index=>mobileChapters.includes(index)?index:4;
const choices=[...document.querySelectorAll('[data-rail]')],previews=[...document.querySelectorAll('[data-preview]')];
const explorer=document.querySelector('[data-explorer]');
const pages=[...document.querySelectorAll('[data-page]')];
let selected=0;
let locationInitialized=false;
let firstMobileLanding=false;
let mobileSnapTimer=0;
let verticalStoryRunning=false;
let verticalStoryCleanup=null;
let lastVerticalWheelAt=-Infinity;
let railMotionReady=false;
let railHintTimer=0;
function scheduleRailDiscovery(){
  const nav=explorer?.querySelector('.section-rail');
  if(!nav||window.innerWidth>MOBILE_BREAKPOINT||selected!==0||
     matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  // A small motion hint only once per browser tab session.
  try{if(sessionStorage.getItem('ars-arc-hint-seen')==='1')return;}catch{}
  window.clearTimeout(railHintTimer);
  railHintTimer=window.setTimeout(()=>{
    if(window.innerWidth>MOBILE_BREAKPOINT||selected!==0||explorer?.classList.contains('is-away')||
       document.visibilityState==='hidden')return;
    nav.classList.add('ars-wheel-hint');
    try{sessionStorage.setItem('ars-arc-hint-seen','1');}catch{}
  },850);
}
// Optical indicator: one linear progress value across ALL six sections.
function syncWheelIndicator(){
  if(window.innerWidth>MOBILE_BREAKPOINT||!explorer||!choices.length)return;
  const track=explorer.querySelector('.section-rail .rail-list');
  if(!track||track.clientWidth<=0)return;
  const sideInset=18, markerWidth=25;
  const travel=Math.max(0,track.clientWidth-2*sideInset-markerWidth);
  const index=Math.max(0,Math.min(choices.length-1,selected));
  const progress=index/Math.max(1,choices.length-1);
  const x=sideInset+travel*progress;
  const value=x.toFixed(2)+'px';
  if(track.style.getPropertyValue('--ars-wheel-indicator-x')!==value)
    track.style.setProperty('--ars-wheel-indicator-x',value);
}
function centerMobileRail(){
  if(window.innerWidth>MOBILE_BREAKPOINT||!explorer||!choices.length)return;
  const track=explorer.querySelector('.section-rail .rail-list');
  if(!track||track.clientWidth<=0)return;
  // There are THREE equal physical columns; the first column is an actual
  // aria-hidden, non-interactive placeholder whenever Home is active.
  // CSS Grid guarantees the active (middle) column shares the screen center.
  const cellWidth=track.clientWidth/3;
  const active=choices[selected];
  const computed=getComputedStyle(active);
  const probe=document.createElement('span');
  Object.assign(probe.style,{
    position:'absolute',left:'-9999px',top:'-9999px',
    display:'inline-block',whiteSpace:'nowrap',
    visibility:'hidden',pointerEvents:'none',width:'max-content',
    fontFamily:computed.fontFamily,fontWeight:computed.fontWeight,
    letterSpacing:computed.letterSpacing,fontSize:'clamp(22px,6.6vw,28px)',
    lineHeight:computed.lineHeight,fontFeatureSettings:computed.fontFeatureSettings
  });
  document.body.appendChild(probe);
  let widest=0;
  for(const choice of choices){
    probe.textContent=choice.textContent.trim();
    widest=Math.max(widest,probe.getBoundingClientRect().width);
  }
  probe.remove();
  if(!widest)return;
  // Fit the LONGEST active word inside any of the identical responsive cells.
  const fit=Math.min(1,Math.max(.75,(cellWidth-6)/widest));
  const nextFit=fit.toFixed(3);
  if(track.style.getPropertyValue('--ars-mobile-active-fit')!==nextFit)
    track.style.setProperty('--ars-mobile-active-fit',nextFit);
  syncWheelIndicator();
}

/* ARS Soft Arc Wheel Spacious. The track is intentionally invisible.
   Position and preview share a 460ms ease; mobile header is unchanged. */
let softArcPosition=0,softArcFrom=0,softArcTarget=0;
let softArcStarted=0,softArcFrameId=0;
const softArcEase=t=>1-Math.pow(1-t,3);
function paintSoftArc(position){
  if(window.innerWidth<=MOBILE_BREAKPOINT||!choices.length)return;
  const view=explorer?.querySelector('.section-rail .rail-window');
  if(!view)return;
  const h=view.clientHeight||198,w=view.clientWidth||142;
  const radius=Math.min(31,w*.23),baseX=Math.max(3,w*.035);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  choices.forEach((item,i)=>{
    const d=i-position,distance=Math.abs(d);
    const x=baseX+radius*Math.cos(d*.78);
    const y=h/2+Math.sin(d*.68)*h*.43;
    const near=Math.max(0,1-distance);
    const scale=reduced?1:1+near*.045;
    item.style.transform='translate3d('+x.toFixed(2)+'px,'+(y-19).toFixed(2)+'px,0) scale('+scale.toFixed(3)+')';
    item.style.opacity=String(Math.max(0,Math.min(1,.58+.42*near)));
    item.style.visibility=distance<=1.58?'visible':'hidden';
    item.style.pointerEvents=distance<=1.35?'auto':'none';
    item.style.zIndex=String(10-Math.round(distance));
  });
}
function animateSoftArc(now){
  const t=Math.min(1,(now-softArcStarted)/460);
  softArcPosition=softArcFrom+(softArcTarget-softArcFrom)*softArcEase(t);
  paintSoftArc(softArcPosition);
  if(t<1)softArcFrameId=requestAnimationFrame(animateSoftArc);
  else{softArcPosition=softArcTarget;softArcFrameId=0;}
}
function syncSoftArc(index){
  if(window.innerWidth<=MOBILE_BREAKPOINT||!choices.length)return;
  if(softArcFrameId)cancelAnimationFrame(softArcFrameId);
  softArcFrameId=0;
  const next=Math.max(0,Math.min(choices.length-1,index));
  if(!root.classList.contains('is-enhanced')||matchMedia('(prefers-reduced-motion: reduce)').matches){
    softArcPosition=next;
    softArcTarget=next;
    paintSoftArc(next);
    return;
  }
  softArcFrom=softArcPosition;
  softArcTarget=next;
  softArcStarted=performance.now();
  if(Math.abs(softArcTarget-softArcFrom)<.001){paintSoftArc(next);return;}
  softArcFrameId=requestAnimationFrame(animateSoftArc);
}

function choose(idx,moveFocus=false,fromMobileScroll=false){
 if(!choices.length)return;
 if(verticalStoryCleanup&&!fromMobileScroll)verticalStoryCleanup();
 const previous=selected;
 selected=Math.max(0,Math.min(choices.length-1,idx));
 // Keep the Home card mounted and measured when another chapter is active.
 const mobile=window.innerWidth<=MOBILE_BREAKPOINT;
 explorer?.classList.toggle('is-home-preview',mobile||selected===0);
 const moved=mobile&&railMotionReady&&selected!==previous;
 const railNav=explorer?.querySelector('.section-rail');
 if(railNav){
   window.clearTimeout(railHintTimer);
   railNav.classList.remove('ars-wheel-hint');
   railNav.classList.toggle('ars-wheel-ready',mobile);
   if(moved)railNav.dataset.slideDirection=selected>previous?'next':'prev';
   else delete railNav.dataset.slideDirection;
 }
 choices.forEach((c,i)=>{
   c.setAttribute('aria-current',String(i===selected));
   c.tabIndex=i===selected?0:-1;
   c.classList.toggle('was-active',moved&&i===previous);
   c.classList.toggle('is-next',mobile&&i===selected+1);
   c.classList.toggle('is-prev',mobile&&i===selected-1);
 });
 previews.forEach((p,i)=>p.classList.toggle('is-selected',i===selected));
  syncSoftArc(selected);
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
 if(mobile){
   if(!fromMobileScroll&&!explorer?.classList.contains('is-away')){
     const stage=explorer?.querySelector('.preview-stage');
     const pane=previews[mobileParent(selected)];
     if(stage&&pane&&Math.abs(stage.scrollLeft-pane.offsetLeft)>2){
       stage.scrollTo({left:pane.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
     }
   }
   requestAnimationFrame(centerMobileRail);
 }
}
function showFromLocation(){
 const firstLoad=!locationInitialized;
 locationInitialized=true;
 let section=location.hash.replace('#','').toLowerCase();
 let resumingFromCase=false;
 firstMobileLanding=firstLoad&&window.innerWidth<=MOBILE_BREAKPOINT&&!section;
 // A return from a case-study on Android resumes the Work carousel,
 // rather than opening the legacy desktop Work detail page.
 if(window.innerWidth<=MOBILE_BREAKPOINT&&section==='work'){
   let cameFromCase=false;
   try{cameFromCase=sessionStorage.getItem(workReturnKey)==='1';}catch{}
   if(cameFromCase){
     resumingFromCase=true;
     firstMobileLanding=false;
     try{sessionStorage.removeItem(workReturnKey);sessionStorage.setItem('ars-section','1');}catch{}
     history.replaceState(null,'',location.pathname+location.search);
     section='';
   }
 }
const open=names.includes(section)&&section!=='home'?section:null;
 if(choices.length){
  if(open)choose(names.indexOf(open));
  else if(section==='home'||firstMobileLanding)choose(0);
  else if(resumingFromCase)choose(1);
  else {
   let stored=0;
   try{stored=Number(sessionStorage.getItem('ars-section')||0);}catch{}
   choose(stored);
  }
  explorer?.classList.toggle('is-away',Boolean(open));
  pages.forEach(p=>{
   const visible=p.dataset.page===open;
   if(visible)p.dataset.visible='';
   else {
    delete p.dataset.visible;
    p.querySelectorAll('video').forEach(v=>v.pause());
   }
  });
  root.dataset.context=open?(['work','connect'].includes(open)?'dark':'light'):[0,1,5].includes(selected)?'dark':'light';
  window.scrollTo({top:0,behavior:'instant'});
 }
}
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
/* Two gestures, one destination: native horizontal CSS carousel for finger-follow
   swipes; vertical touch/wheel animates the SAME neighbor on the Y axis.
   Inner sections are allowed to scroll their own content before stepping. */
function mobileVisiblePane(){
 return previews[mobileParent(selected)]||null;
}
function canStepVerticallyFrom(target,direction){
 const pane=mobileVisiblePane();
 if(!pane)return false;
 let element=target instanceof Element?target:target?.parentElement;
 while(element&&element!==previewStage){
   if(element.scrollHeight>element.clientHeight+4){
     const overflow=getComputedStyle(element).overflowY;
     if(['auto','scroll','overlay'].includes(overflow)){
       const remaining=element.scrollHeight-element.clientHeight-element.scrollTop;
       if(direction>0&&remaining>5)return false;
       if(direction<0&&element.scrollTop>5)return false;
     }
   }
   if(element===pane)break;
   element=element.parentElement;
 }
 return true;
}
function mobileVerticalStep(direction){
 if(window.innerWidth>MOBILE_BREAKPOINT||!explorer||explorer.classList.contains('is-away')||
    verticalStoryRunning||!previewStage)return false;
 const fromIndex=mobileChapters.indexOf(mobileParent(selected));
 const toIndex=fromIndex+direction;
 if(toIndex<0||toIndex>=mobileChapters.length)return false;
 const current=previews[mobileChapters[fromIndex]];
 const destination=previews[mobileChapters[toIndex]];
 if(!current||!destination)return false;
 const targetIndex=mobileChapters[toIndex];
 if(reduced.matches){choose(targetIndex);return true;}
 const layout=explorer.querySelector('.explore-layout');
 if(!layout)return false;
 // Clone presentation only: copies are inert, hidden from assistive technology,
 // and have their ids removed to avoid ambiguous document references.
 const layer=document.createElement('div');
 layer.className='ars-vertical-story';
 layer.setAttribute('aria-hidden','true');
 layer.inert=true;
 function makePanel(source,kind,tokens){
   const shell=document.createElement('div');
   shell.className='ars-vertical-story-panel ars-vertical-story-'+kind;
   const copy=source.cloneNode(true);
   [copy,...copy.querySelectorAll('[id]')].forEach(node=>node.removeAttribute('id'));
   shell.append(copy);
   for(const [name,value] of Object.entries(tokens))shell.style.setProperty(name,value);
   shell.style.backgroundColor=tokens['--bg']||'#151719';
   return shell;
 }
 function tokens(){
   const style=getComputedStyle(root);
   const result={};
   ['--bg','--fg','--sub','--rule','--accent'].forEach(name=>{
     result[name]=style.getPropertyValue(name).trim();
   });
   // The computed --bg token resolves immediately to the destination
   // color. html.backgroundColor is transitioning and may still be OLD.
   return result;
 }
 const departing=makePanel(current,'out',tokens());
 verticalStoryRunning=true;
 choose(targetIndex,false,true);
 const arriving=makePanel(destination,'in',tokens());
 layer.append(departing,arriving);
 layout.append(layer);
 // Reposition the underlying native carousel in one frame while it is covered.
 // Do not replace native horizontal dragging with JavaScript swipe detection.
 const oldBehavior=previewStage.style.scrollBehavior;
 const oldSnap=previewStage.style.scrollSnapType;
 previewStage.style.scrollBehavior='auto';
 previewStage.style.scrollSnapType='none';
 previewStage.scrollLeft=destination.offsetLeft;
 previewStage.style.scrollBehavior=oldBehavior;
 previewStage.style.scrollSnapType=oldSnap;
 let cleaned=false;
 const cleanup=()=>{
   if(cleaned)return;
   cleaned=true;
   layer.remove();
   verticalStoryRunning=false;
   if(verticalStoryCleanup===cleanup)verticalStoryCleanup=null;
   // A CSS snap can be interrupted when we briefly disable it for the Y
   // transition. Always leave the underlying native X carousel precisely
   // aligned to the destination before exposing it again.
   if(previewStage&&selected===targetIndex){
     previewStage.scrollTo({left:destination.offsetLeft,behavior:'instant'});
     requestAnimationFrame(finalizeMobileSnap);
   }
 };
 verticalStoryCleanup=cleanup;
 const duration=490;
 const opts={duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
 const leave=departing.animate([
   {transform:'translate3d(0,0,0)',opacity:1},
   {transform:'translate3d(0,'+(direction>0?'-100%':'100%')+',0)',opacity:.88}
 ],opts);
 const enter=arriving.animate([
   {transform:'translate3d(0,'+(direction>0?'100%':'-100%')+',0)',opacity:.9},
   {transform:'translate3d(0,0,0)',opacity:1}
 ],opts);
 Promise.allSettled([leave.finished,enter.finished]).then(cleanup);
 return true;
}
let verticalTouchStart=null;
previewStage?.addEventListener('touchstart',event=>{
 if(window.innerWidth>MOBILE_BREAKPOINT||verticalStoryRunning||event.touches.length!==1){
   verticalTouchStart=null;return;
 }
 const finger=event.touches[0];
 verticalTouchStart={
   id:finger.identifier,x:finger.clientX,y:finger.clientY,
   down:canStepVerticallyFrom(event.target,1),
   up:canStepVerticallyFrom(event.target,-1)
 };
},{passive:true});
previewStage?.addEventListener('touchend',event=>{
 if(!verticalTouchStart||window.innerWidth>MOBILE_BREAKPOINT||verticalStoryRunning)return;
 const start=verticalTouchStart;
 verticalTouchStart=null;
 const finger=[...event.changedTouches].find(t=>t.identifier===start.id);
 if(!finger)return;
 const dy=start.y-finger.clientY,dx=start.x-finger.clientX;
 if(Math.abs(dy)<55||Math.abs(dy)<Math.abs(dx)*1.4)return;
 const dir=dy>0?1:-1;
 if((dir>0&&start.down)||(dir<0&&start.up))mobileVerticalStep(dir);
},{passive:true});
previewStage?.addEventListener('touchcancel',()=>{verticalTouchStart=null;},{passive:true});
previewStage?.addEventListener('wheel',event=>{
 if(window.innerWidth>MOBILE_BREAKPOINT||verticalStoryRunning||event.ctrlKey||event.metaKey||
    event.shiftKey||Math.abs(event.deltaY)<7||
    Math.abs(event.deltaX)>Math.abs(event.deltaY)*.8)return;
 const direction=Math.sign(event.deltaY);
 if(!canStepVerticallyFrom(event.target,direction))return;
 // Prevent the body from fighting the vertical chapter animation at an edge.
 if(event.cancelable)event.preventDefault();
 const now=performance.now();
 if(now-lastVerticalWheelAt<710)return;
 if(mobileVerticalStep(direction))lastVerticalWheelAt=now;
},{passive:false});
/* Native horizontal scroll-snap owns the drag, but interrupted smooth
   transitions must NOT leave the viewport between two chapters.
   On scrollend (with a timer fallback), align exactly to the nearest slide.
   Direct fresh visits begin at Home, while case-study returns reopen Work. */
let storyScrollFrame=0;
function closestMobileChapter(){
 if(!previewStage||!previewStage.clientWidth)return null;
 let index=0,dist=Infinity,left=0;
 for(const id of mobileChapters){
   const pane=previews[id];if(!pane)continue;
   const target=pane.offsetLeft;
   const distance=Math.abs(previewStage.scrollLeft-target);
   if(distance<dist){dist=distance;index=id;left=target;}
 }
 return {index,left,dist};
}
function finalizeMobileSnap(){
 if(window.innerWidth>MOBILE_BREAKPOINT||verticalStoryRunning||explorer?.classList.contains('is-away'))return;
 const nearest=closestMobileChapter();
 if(!nearest)return;
 if(nearest.index!==selected)choose(nearest.index,false,true);
 if(nearest.dist>2){
   // Never animate a correction: mid-slide states must not persist.
   previewStage?.scrollTo({left:nearest.left,behavior:'instant'});
 }
}
previewStage?.addEventListener('scroll',()=>{
 if(window.innerWidth>MOBILE_BREAKPOINT||explorer?.classList.contains('is-away')||verticalStoryRunning)return;
 window.clearTimeout(mobileSnapTimer);
 mobileSnapTimer=window.setTimeout(finalizeMobileSnap,200);
 if(storyScrollFrame)return;
 storyScrollFrame=requestAnimationFrame(()=>{
   storyScrollFrame=0;
   const nearest=closestMobileChapter();
   if(nearest&&nearest.index!==selected)choose(nearest.index,false,true);
 });
},{passive:true});
previewStage?.addEventListener('scrollend',()=>{
 window.clearTimeout(mobileSnapTimer);
 finalizeMobileSnap();
},{passive:true});
function alignInitialHome(){
 if(!firstMobileLanding||window.innerWidth>MOBILE_BREAKPOINT||!previewStage||
    explorer?.classList.contains('is-away'))return;
 firstMobileLanding=false;
 const pane=previews[0];
 if(!pane)return;
 // Browser reload / restoration may happen AFTER initial DOM hydration.
 // Reposition once after paint, rather than restoring stale Work/half-slide.
 previewStage.scrollTo({left:pane.offsetLeft,behavior:'instant'});
 if(selected!==0)choose(0,false,true);
}
requestAnimationFrame(()=>requestAnimationFrame(alignInitialHome));
window.addEventListener('pageshow',event=>{
 if(event.persisted||window.innerWidth>MOBILE_BREAKPOINT||location.hash)return;
 // A fresh load or reload is Home; bfcache restoration keeps its context.
 if(!locationInitialized||selected!==0)return;
 const navigation=performance.getEntriesByType('navigation')[0];
 if(navigation?.type==='navigate'||navigation?.type==='reload'){
   const pane=previews[0];
   if(pane&&!explorer?.classList.contains('is-away')){
     previewStage?.scrollTo({left:pane.offsetLeft,behavior:'instant'});
   }
 }
},{passive:true});
previewStage?.addEventListener('keydown',e=>{
 if(window.innerWidth>MOBILE_BREAKPOINT||e.target!==previewStage)return;
 if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','PageDown','PageUp'].includes(e.key))return;
 e.preventDefault();
 if(e.key==='ArrowDown'||e.key==='ArrowUp'||e.key==='PageDown'||e.key==='PageUp'){
   mobileVerticalStep(['ArrowDown','PageDown'].includes(e.key)?1:-1);
   return;
 }
 const at=mobileChapters.indexOf(mobileParent(selected));
 choose(mobileChapters[Math.max(0,Math.min(3,at+(e.key==='ArrowRight'?1:-1)))]);
});

function arrangeMobileRail(){
 if(!rail)return;
 requestAnimationFrame(centerMobileRail);
 rail.scrollLeft=0;
 const nav=rail.closest('.section-rail');
 if(nav){
   const mobile=window.innerWidth<=MOBILE_BREAKPOINT;
   nav.classList.toggle('ars-wheel-ready',mobile);
   nav.setAttribute('aria-label',mobile
     ?'Portfolio sections. Swipe left for next and right for previous section.'
     :'Portfolio sections');
   if(!mobile){
     nav.classList.remove('ars-wheel-hint');
     delete nav.dataset.slideDirection;
   }else{
     choices.forEach((c,i)=>{
       c.classList.toggle('is-next',i===selected+1);
       c.classList.toggle('is-prev',i===selected-1);
     });
   }
 }
 if(window.innerWidth>MOBILE_BREAKPOINT){
   choices.forEach(c=>c.classList.remove('was-active'));
   softArcPosition=selected;
   syncSoftArc(selected);
 }
}
// Native touch-action:pan-x and scroll-snap own horizontal swipes.
// No touchend click interception: links and nested carousels remain tappable.
window.addEventListener('resize',()=>requestAnimationFrame(arrangeMobileRail),{passive:true});
window.addEventListener('orientationchange',()=>requestAnimationFrame(centerMobileRail),{passive:true});
if(window.visualViewport){
  window.visualViewport.addEventListener('resize',()=>requestAnimationFrame(centerMobileRail),{passive:true});
  window.visualViewport.addEventListener('scroll',()=>requestAnimationFrame(centerMobileRail),{passive:true});
}
if(document.fonts?.ready)document.fonts.ready.then(()=>requestAnimationFrame(centerMobileRail));
// A sliding label has a transient scale/position. Recalibrate once its motion ends.
rail?.addEventListener('animationend',e=>{
  if(e.target.matches?.('.rail-choice')){
    e.target.classList.remove('was-active');
    if(e.animationName==='ars-wheel-discovery')
      rail.closest('.section-rail')?.classList.remove('ars-wheel-hint');
    requestAnimationFrame(centerMobileRail);
  }
});
// Text widths can change from late font swaps or accessibility font settings.
if(typeof ResizeObserver!=='undefined'){
  const railResize=new ResizeObserver(()=>requestAnimationFrame(centerMobileRail));
  const track=explorer?.querySelector('.section-rail .rail-list');
  if(track)railResize.observe(track);
  choices.forEach(choice=>railResize.observe(choice));
}
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
railMotionReady=true;
scheduleRailDiscovery();


// History events use the same ordered section/focus/work-context restoration.
function handleHistoryNavigation(){showFromLocation();focusLocationTarget();restoreWorkContext();}
window.addEventListener('hashchange',handleHistoryNavigation);
window.addEventListener('popstate',handleHistoryNavigation);
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


/* About's second-level horizontal carousel is a separate swipe surface.
   Each About chapter owns its real content and an accessible local tab. */
const aboutTrack=document.querySelector('.ars-about-track');
const aboutButtons=[...document.querySelectorAll('[data-about-step]')];
const aboutPanels=[...document.querySelectorAll('.ars-about-page')];
let aboutFrame=0;
function syncAboutCarousel(){
 if(!aboutTrack||!aboutPanels.length)return;
 let current=0,closest=Infinity;
 aboutPanels.forEach((panel,index)=>{
   const gap=Math.abs(aboutTrack.scrollLeft-panel.offsetLeft);
   if(gap<closest){closest=gap;current=index;}
 });
 aboutButtons.forEach((button,index)=>{
   if(index===current)button.setAttribute('aria-current','step');
   else button.removeAttribute('aria-current');
 });
 const counter=document.querySelector('[data-about-counter]');
 if(counter)counter.textContent=String(current+1).padStart(2,'0')+' / 04';
 const progress=document.querySelector('[data-about-progress]');
 if(progress)progress.style.transform='scaleX('+((current+1)/aboutPanels.length)+')';
 const hint=document.querySelector('.ars-about-swipe-hint');
 if(hint)hint.textContent=current===aboutPanels.length-1
   ?'← Swipe once more for Connect'
   :current===0?'← Swipe to explore chapters':'← Swipe between chapters';
}
aboutButtons.forEach((button,index)=>button.addEventListener('click',()=>{
 const panel=aboutPanels[index];
 if(panel&&aboutTrack)aboutTrack.scrollTo({left:panel.offsetLeft,behavior:reduced.matches?'instant':'smooth'});
}));
aboutTrack?.addEventListener('scroll',()=>{
 if(aboutFrame)return;
 aboutFrame=requestAnimationFrame(()=>{aboutFrame=0;syncAboutCarousel();});
},{passive:true});
aboutTrack?.addEventListener('keydown',event=>{
 if(event.target!==aboutTrack||!['ArrowLeft','ArrowRight'].includes(event.key))return;
 event.preventDefault();
 let current=0,d=Infinity;
 aboutPanels.forEach((panel,index)=>{const gap=Math.abs(panel.offsetLeft-aboutTrack.scrollLeft);if(gap<d){d=gap;current=index;}});
 if(current===0&&event.key==='ArrowLeft'){choose(1);return;}
 if(current===aboutPanels.length-1&&event.key==='ArrowRight'){choose(5);return;}
 const next=Math.max(0,Math.min(aboutPanels.length-1,current+(event.key==='ArrowRight'?1:-1)));
 aboutTrack.scrollTo({left:aboutPanels[next].offsetLeft,behavior:reduced.matches?'instant':'smooth'});
});
// Edge hand-off: nested About stops at four chapters, but a subsequent
// horizontal swipe continues the portfolio to Work or Connect.
let aboutBoundaryStart=null;
aboutTrack?.addEventListener('touchstart',event=>{
 if(window.innerWidth>MOBILE_BREAKPOINT||event.touches.length!==1){aboutBoundaryStart=null;return;}
 const finger=event.touches[0];
 aboutBoundaryStart={id:finger.identifier,x:finger.clientX,y:finger.clientY};
},{passive:true});
aboutTrack?.addEventListener('touchend',event=>{
 if(!aboutBoundaryStart||window.innerWidth>MOBILE_BREAKPOINT)return;
 const initial=aboutBoundaryStart;aboutBoundaryStart=null;
 const finger=[...event.changedTouches].find(t=>t.identifier===initial.id);
 if(!finger)return;
 const dx=finger.clientX-initial.x,dy=finger.clientY-initial.y;
 if(Math.abs(dx)<65||Math.abs(dx)<Math.abs(dy)*1.5)return;
 const atStart=aboutTrack.scrollLeft<=5;
 const atEnd=aboutTrack.scrollLeft>=aboutTrack.scrollWidth-aboutTrack.clientWidth-5;
 if(atStart&&dx>0)choose(1);
 else if(atEnd&&dx<0)choose(5);
},{passive:true});
aboutTrack?.addEventListener('touchcancel',()=>aboutBoundaryStart=null,{passive:true});
window.addEventListener('resize',syncAboutCarousel,{passive:true});
syncAboutCarousel();

// Compact mobile navigation preserves existing preview and swipe behavior.
document.querySelector('[data-explore-work]')?.addEventListener('click',()=>choose(1));
const mobileMenu=document.querySelector('.ars-mobile-menu');
function syncBalancedMobileMenu(){
  if(!mobileMenu||window.innerWidth>MOBILE_BREAKPOINT)return;
  const current=names[mobileParent(selected)];
  mobileMenu.querySelectorAll('[data-mobile-rail]').forEach(button=>{
    const active=button.dataset.mobileRail===current;
    button.setAttribute('aria-current',String(active));
    if(active){
      const x=button.offsetLeft-mobileMenu.offsetLeft;
      if(x<mobileMenu.scrollLeft||x+button.offsetWidth>mobileMenu.scrollLeft+mobileMenu.clientWidth) mobileMenu.scrollTo({left:Math.max(0,x-12),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
    }
  });
  // Active indication belongs directly to the selected word or Connect icon.
}
mobileMenu?.querySelectorAll('[data-mobile-rail]').forEach(button=>button.addEventListener('click',()=>choose(names.indexOf(button.dataset.mobileRail))));
if(explorer){new MutationObserver(syncBalancedMobileMenu).observe(explorer,{attributes:true,attributeFilter:['class']});}
if(mobileMenu){new MutationObserver(syncBalancedMobileMenu).observe(document.querySelector('.rail-list'),{subtree:true,attributes:true,attributeFilter:['aria-current']});}
window.addEventListener('resize',syncBalancedMobileMenu);
syncBalancedMobileMenu();

})();
