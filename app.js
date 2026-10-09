
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
     ['.rail-list','02A.2 / THREE-SLOT GRID','area'],
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

   // Review-only guide layer: use live element rectangles WITHOUT adding
   // children to navbar buttons (which would change their measured text).
   const guideLayer=document.createElement('div');
   guideLayer.className='ars-grid-guides';
   guideLayer.setAttribute('aria-hidden','true');
   document.body.appendChild(guideLayer);
   const measurements=document.createElement('div');
   measurements.className='ars-grid-metrics';
   measurements.setAttribute('aria-live','off');
   controls.insertBefore(measurements,actions);
   const whitespaceLabel=document.createElement('div');
   whitespaceLabel.className='ars-grid-whitespace';
   whitespaceLabel.setAttribute('aria-live','off');
   controls.insertBefore(whitespaceLabel,actions);
   const railTrack=document.querySelector('.home-site .section-rail .rail-list');
   const railWindow=document.querySelector('.home-site .section-rail .rail-window');
   const railButtons=[...document.querySelectorAll('.home-site [data-rail]')];
   const railSpacer=document.querySelector('.home-site .rail-leading-space');
   let guidePending=false;
   const bounded=(rect)=>rect&&Number.isFinite(rect.left)&&Number.isFinite(rect.top)&&rect.width>0&&rect.height>0;
   const makeGuide=(kind,rect,label,role='')=>{
     if(!bounded(rect))return;
     const element=document.createElement('div');
     element.className='ars-guide '+kind+(role?' '+role:'');
     element.style.left=rect.left+'px';
     element.style.top=rect.top+'px';
     element.style.width=rect.width+'px';
     element.style.height=rect.height+'px';
     if(label){
       const badge=document.createElement('span');
       badge.className='ars-guide-caption';
       badge.textContent=label;
       element.appendChild(badge);
     }
     guideLayer.appendChild(element);
   };
   const makeLine=(x,top,height,name,role='')=>{
     if(!Number.isFinite(x)||!Number.isFinite(top)||height<=0)return;
     const line=document.createElement('div');
     line.className='ars-guide-line'+(role?' '+role:'');
     line.style.left=x+'px';
     line.style.top=top+'px';
     line.style.height=height+'px';
     if(name){
       const textNode=document.createElement('span');
       textNode.textContent=name;
       line.appendChild(textNode);
     }
     guideLayer.appendChild(line);
   };
   const wordRect=button=>{
     if(!button)return null;
     const node=[...button.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
     if(!node)return button.getBoundingClientRect();
     const range=document.createRange();
     range.selectNodeContents(node);
     return range.getBoundingClientRect();
   };
   const paintGridGuides=()=>{
     guidePending=false;
     guideLayer.replaceChildren();
     const visible=document.documentElement.classList.contains('grid-review');
     const explorer=document.querySelector('.home-site [data-explorer]');
     if(!visible||!explorer||explorer.classList.contains('is-away')||!railWindow||!railTrack){
       measurements.textContent='Panduan detail tampil pada halaman preview dengan garis diaktifkan.';
       return;
     }
     const railRect=railWindow.getBoundingClientRect();
     const trackRect=railTrack.getBoundingClientRect();
     if(!bounded(railRect)||!bounded(trackRect))return;
     const mobile=window.innerWidth<=680;
     const visual=window.visualViewport;
     const viewportCenter=visual?(visual.offsetLeft+visual.width/2):document.documentElement.clientWidth/2;
     makeLine(viewportCenter,0,window.innerHeight,'VIEWPORT CENTER','viewport');
     makeLine(railRect.left+railRect.width/2,railRect.top,railRect.height,'NAV CENTER','nav');
     makeGuide('frame',railRect,'02A.1 / NAV WINDOW · '+Math.round(railRect.width)+'px');
     if(mobile){
       // Actual CSS grid is repeat(3,1fr); draw ALL cells, including its
       // transparent/untappable left placeholder on the Home preview.
       const cellWidth=trackRect.width/3;
       const names=['LEFT','CENTER','RIGHT'];
       for(let i=0;i<3;i++){
         const rect={left:trackRect.left+i*cellWidth,top:trackRect.top,width:cellWidth,height:trackRect.height};
         const role=i===1?'active':i===0?'previous':'next';
         const btn=i===0?railButtons.find(b=>b.classList.contains('is-prev')):i===1?railButtons.find(b=>b.getAttribute('aria-current')==='true'):railButtons.find(b=>b.classList.contains('is-next'));
         const name=btn?.textContent.trim().toUpperCase()||(i===0?'EMPTY / INERT':i===2?'EMPTY / END':'ACTIVE');
         makeGuide('slot',rect,'02A.'+(i+3)+' / '+names[i]+' · '+name+' · '+cellWidth.toFixed(1)+'px',role);
       }
       if(railSpacer&&railSpacer.getBoundingClientRect().width>0){
         // Its DOM box occupies the same left-column position as a prev item.
         const placeholder=railSpacer.getBoundingClientRect();
         makeGuide('spacer',placeholder,'PLACEHOLDER / NON-INTERACTIVE');
       }
     }else{
       // Desktop retains its real vertical rail. Outline each visible row.
       if(railSpacer)makeGuide('slot',railSpacer.getBoundingClientRect(),'02A.0 / EMPTY DESKTOP SLOT','previous');
     }
     let activeWord=null,activeButton=null;
     railButtons.forEach((button,i)=>{
       const bounds=button.getBoundingClientRect();
       if(!bounded(bounds)||getComputedStyle(button).display==='none')return;
       const current=button.getAttribute('aria-current')==='true';
       const side=mobile?(current?'active':button.classList.contains('is-prev')?'previous':button.classList.contains('is-next')?'next':'other'):(current?'active':'other');
       if(mobile&&side==='other')return;
       const word=wordRect(button);
       makeGuide('item',bounds,'ITEM '+String(i+1).padStart(2,'0')+' / '+button.textContent.trim().toUpperCase(),side);
       if(bounded(word))makeGuide('glyph',word,'TEXT '+word.width.toFixed(1)+'px',side);
       if(current){activeButton=bounds;activeWord=word;}
     });
     if(bounded(activeWord)){
       const mid=activeWord.left+activeWord.width/2;
       makeLine(mid,railRect.top,railRect.height,'TEXT CENTER','word');
       const delta=mid-viewportCenter;
       measurements.textContent='VIEWPORT '+viewportCenter.toFixed(1)+'px  ·  TEXT '+mid.toFixed(1)+'px  ·  Δ '+(delta>=0?'+':'')+delta.toFixed(1)+'px'+(mobile?'  ·  3 equal slots: '+(trackRect.width/3).toFixed(1)+'px':'');
     }else if(bounded(activeButton)){
       measurements.textContent='Active navbar: '+(activeButton.left+activeButton.width/2).toFixed(1)+'px';
     }
     const activePreview=document.querySelector('.home-site .section-preview.is-selected');
     if(activePreview?.dataset.preview==='home'&&window.innerWidth<=680){
       const whitespaceLabel=document.querySelector('.ars-grid-whitespace');
       const navBox=railWindow.getBoundingClientRect();
       const copyNode=activePreview.querySelector('.identity-copy');
       const portraitNode=activePreview.querySelector('.ars-portrait-stage');
       const canvasNode=activePreview.closest('.explorer');
       if(whitespaceLabel&&copyNode&&portraitNode&&canvasNode){
         const upper=copyNode.getBoundingClientRect().top-navBox.bottom;
         const lower=canvasNode.getBoundingClientRect().bottom-portraitNode.getBoundingClientRect().bottom;
         whitespaceLabel.textContent='HOME SPACE · after navbar '+upper.toFixed(0)+'px / after photo '+lower.toFixed(0)+'px';
       }

       const copy=activePreview.querySelector('.identity-copy');
       const photo=activePreview.querySelector('.ars-portrait-stage');
       const image=photo?.querySelector('img');
       if(copy&&photo){
         const copyRect=copy.getBoundingClientRect();
         const photoRect=photo.getBoundingClientRect();
         makeGuide('content',copyRect,'HOME / EDITORIAL COPY · FULL WIDTH');
         makeGuide('content',photoRect,'HOME / ADAPTIVE PHOTO FRAME');
         if(image)makeGuide('glyph',image.getBoundingClientRect(),'PHOTO / VISIBLE CROP');
         const leftDelta=Math.abs(copyRect.left-photoRect.left);
         const rightDelta=Math.abs(copyRect.right-photoRect.right);
         measurements.textContent+=' · ALIGN L '+leftDelta.toFixed(1)+'px / R '+rightDelta.toFixed(1)+'px';
       }
     }
     if(activePreview){
       const headline=activePreview.querySelector('h1,h2');
       const description=activePreview.querySelector('.identity-copy p,.preview-copy p,.lead');
       const art=activePreview.querySelector('.ars-portrait-stage,.work-art-focus,.side-artwork');
       if(headline)makeGuide('content',headline.getBoundingClientRect(),'03 / PREVIEW HEADING');
       if(description)makeGuide('content',description.getBoundingClientRect(),'03A / PREVIEW DESCRIPTION');
       if(art)makeGuide('content',art.getBoundingClientRect(),'04 / PREVIEW IMAGE');
     }
   };
   const scheduleGuides=()=>{
     if(guidePending)return;
     guidePending=true;
     requestAnimationFrame(paintGridGuides);
   };
   window.addEventListener('resize',scheduleGuides,{passive:true});
   window.addEventListener('scroll',scheduleGuides,{passive:true});
   window.visualViewport?.addEventListener('resize',scheduleGuides,{passive:true});
   window.visualViewport?.addEventListener('scroll',scheduleGuides,{passive:true});
   document.fonts?.ready?.then(scheduleGuides);
   const observer=new MutationObserver(scheduleGuides);
   railButtons.forEach(button=>observer.observe(button,{attributes:true,attributeFilter:['aria-current','class']}));
   const explorerNode=document.querySelector('.home-site [data-explorer]');
   if(explorerNode)observer.observe(explorerNode,{attributes:true,attributeFilter:['class']});
   document.querySelector('.home-site .section-rail')?.addEventListener('animationend',scheduleGuides);
   // Let the guide settle after the section transition as well.
   document.addEventListener('animationend',e=>{
     if(e.target?.closest?.('.section-rail'))scheduleGuides();
   },{passive:true});
   toggle.addEventListener('click',scheduleGuides);
   scheduleGuides();
 }

document.querySelectorAll('[data-theme-switch]').forEach(b=>b.addEventListener('click',()=>{theme=themes[(themes.indexOf(theme)+1)%themes.length];try{localStorage.setItem('ars-theme',theme);}catch{}applyTheme();}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const names=['home','work','expertise','approach','about','connect'];
const choices=[...document.querySelectorAll('[data-rail]')],previews=[...document.querySelectorAll('[data-preview]')];
const explorer=document.querySelector('[data-explorer]');
const pages=[...document.querySelectorAll('[data-page]')];
let selected=0;
let railMotionReady=false;
let railHintTimer=0;
function scheduleRailDiscovery(){
  const nav=explorer?.querySelector('.section-rail');
  if(!nav||window.innerWidth>680||selected!==0||
     matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  // A small motion hint only once per browser tab session.
  try{if(sessionStorage.getItem('ars-arc-hint-seen')==='1')return;}catch{}
  window.clearTimeout(railHintTimer);
  railHintTimer=window.setTimeout(()=>{
    if(window.innerWidth>680||selected!==0||explorer?.classList.contains('is-away')||
       document.visibilityState==='hidden')return;
    nav.classList.add('ars-wheel-hint');
    try{sessionStorage.setItem('ars-arc-hint-seen','1');}catch{}
  },850);
}
// Optical indicator: one linear progress value across ALL six sections.
function syncWheelIndicator(){
  if(window.innerWidth>680||!explorer||!choices.length)return;
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
  if(window.innerWidth>680||!explorer||!choices.length)return;
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

/* ARS Soft Arc Wheel Compact. The track is intentionally invisible.
   Position and preview share a 460ms ease; mobile header is unchanged. */
let softArcPosition=0,softArcFrom=0,softArcTarget=0;
let softArcStarted=0,softArcFrameId=0;
const softArcEase=t=>1-Math.pow(1-t,3);
function paintSoftArc(position){
  if(window.innerWidth<=680||!choices.length)return;
  const view=explorer?.querySelector('.section-rail .rail-window');
  if(!view)return;
  const h=view.clientHeight||172,w=view.clientWidth||142;
  const radius=Math.min(31,w*.23),baseX=Math.max(3,w*.035);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  choices.forEach((item,i)=>{
    const d=i-position,distance=Math.abs(d);
    const x=baseX+radius*Math.cos(d*.78);
    const y=h/2+Math.sin(d*.68)*h*.40;
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
  if(window.innerWidth<=680||!choices.length)return;
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

function choose(idx,moveFocus=false){
 if(!choices.length)return;
 const previous=selected;
 selected=Math.max(0,Math.min(choices.length-1,idx));
 // Scope viewport-fit styling only to the current Home preview.
 explorer?.classList.toggle('is-home-preview',selected===0);
 const mobile=window.innerWidth<=680;
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
 if(mobile)requestAnimationFrame(centerMobileRail);
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
 requestAnimationFrame(centerMobileRail);
 rail.scrollLeft=0;
 const nav=rail.closest('.section-rail');
 if(nav){
   const mobile=window.innerWidth<=680;
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
 if(window.innerWidth>680){
   choices.forEach(c=>c.classList.remove('was-active'));
   softArcPosition=selected;
   syncSoftArc(selected);
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

// Compact mobile navigation preserves existing preview and swipe behavior.
const mobileMenu=document.querySelector('.ars-mobile-menu');
const mobileHeader=document.querySelector('.ars-mobile-header');
function syncBalancedMobileMenu(){
  if(!mobileMenu||window.innerWidth>680)return;
  const current=names[selected];
  mobileMenu.querySelectorAll('[data-mobile-rail]').forEach(button=>{
    const active=button.dataset.mobileRail===current;
    button.setAttribute('aria-current',String(active));
    if(active){
      const x=button.offsetLeft-mobileMenu.offsetLeft;
      if(x<mobileMenu.scrollLeft||x+button.offsetWidth>mobileMenu.scrollLeft+mobileMenu.clientWidth) mobileMenu.scrollTo({left:Math.max(0,x-12),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
    }
  });
  mobileHeader.style.setProperty('--ars-mobile-progress',`calc(${selected/Math.max(1,names.length-1)*100}% - ${selected/Math.max(1,names.length-1)*25}px)`);
}
mobileMenu?.querySelectorAll('[data-mobile-rail]').forEach(button=>button.addEventListener('click',()=>choose(names.indexOf(button.dataset.mobileRail))));
if(explorer){new MutationObserver(syncBalancedMobileMenu).observe(explorer,{attributes:true,attributeFilter:['class']});}
if(mobileMenu){new MutationObserver(syncBalancedMobileMenu).observe(document.querySelector('.rail-list'),{subtree:true,attributes:true,attributeFilter:['aria-current']});}
window.addEventListener('resize',syncBalancedMobileMenu);
syncBalancedMobileMenu();

})();
