/* Progressive interactions. Navigation, content, media and reading work without JavaScript. */
(()=>{
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const header=document.querySelector('.site-header');
 if(header&&typeof ResizeObserver!=='undefined'){
  new ResizeObserver(()=>document.documentElement.style.setProperty('--header',Math.ceil(header.getBoundingClientRect().height)+'px')).observe(header);
 }
 const scopes=[{nav:document.querySelector('.main-nav'),sections:[...document.querySelectorAll('main>section[id]')]},{nav:document.querySelector('.case-nav'),sections:[...document.querySelectorAll('.case-section[id]')]}];
 scopes.forEach(({nav,sections})=>{
  if(!nav||!sections.length)return;
  const anchors=[...nav.querySelectorAll('a[href^="#"]')];
  let scheduled=false;
  function sync(){
   scheduled=false;
   const edge=(header?.getBoundingClientRect().height??0)+80;
   let current=null;
   for(const section of sections)if(section.getBoundingClientRect().top<=edge)current=section;
   if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4)current=sections.at(-1);
   anchors.forEach(a=>{if(current&&a.hash==='#'+current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(sync);}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});sync();
 });
 // Native anchors keep URL history, modified clicks and browser back/forward intact.
 document.querySelectorAll('a[href^="#"]').forEach(anchor=>anchor.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
  const target=document.getElementById(anchor.hash.slice(1));
  if(!target)return;
  const focusTarget=target.matches('section')?(target.querySelector('h2')??target):target;
  focusTarget.setAttribute('tabindex','-1');
  // No preventDefault: focus follows the browser's normal anchor navigation.
  requestAnimationFrame(()=>focusTarget.focus({preventScroll:true}));
 }));
 const dialog=document.getElementById('media-dialog');
 const image=dialog?.querySelector('img'),caption=dialog?.querySelector('.dialog-caption');
 let opener=null;
 if(dialog&&typeof dialog.showModal==='function'){
  document.querySelectorAll('[data-lightbox]').forEach(link=>link.addEventListener('click',event=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const original=link.querySelector('img');
   if(!original||!original.complete||!original.naturalWidth)return;
   event.preventDefault();opener=link;
   image.src=link.href;image.alt=original.alt;
   caption.textContent=link.closest('figure')?.querySelector('figcaption')?.textContent??original.alt;
   dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{image.removeAttribute('src');opener?.focus({preventScroll:true});});
 }
 document.querySelectorAll('img').forEach(img=>{
  if(img===image)return;
  const fail=()=>{
   const container=img.parentElement;
   if(!container)return;
   container.classList.add('is-missing');
   if(!container.querySelector('.media-fallback')){
    const fallback=document.createElement('span');fallback.className='media-fallback';
    fallback.textContent=img.alt||'Image unavailable';container.append(fallback);
   }
  };
  img.addEventListener('error',fail,{once:true});if(img.complete&&!img.naturalWidth)fail();
 });
 // A preference change also stops any in-progress native smooth anchor scroll.
 reduced.addEventListener?.('change',()=>{if(reduced.matches)window.scrollTo({top:window.scrollY,left:window.scrollX,behavior:'instant'});});
})();
