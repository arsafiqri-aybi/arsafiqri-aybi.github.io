/* ARS Mobile Story Carousel v45 — source-bound, progressive enhancement.
   The existing editorial pages remain intact for desktop and when fetch fails.
   Do not claim metrics, research, or deliverables beyond the source records. */
(()=>{
 'use strict';
 const body=document.body,caseId=body?.dataset.case;
 if(!caseId||!body.classList.contains('project-page'))return;
 const mobile=matchMedia('(max-width:680px)');
 let built=false;
 function node(tag,cls,text){
   const result=document.createElement(tag);
   if(cls)result.className=cls;
   if(text!==undefined)result.textContent=String(text);
   return result;
 }
 function paragraph(text,cls){
   if(!text)return null;
   return node('p',cls||'ars-case-description',text);
 }
 function safeExternalLink(url){
   try{
     const parsed=new URL(url,location.href);
     return ['https:','http:'].includes(parsed.protocol)?parsed.href:null;
   }catch{return null;}
 }
 function beats(p,isPreview){
   const status=p.status||'Documented project';
   const limitations=p.limitation||'No additional verification has been published.';
   const contributions=Array.isArray(p.contribution)?p.contribution.filter(Boolean):[];
   const caveat=isPreview?'This is a case preview. Individual contributions and supporting material have not yet been published.':'Contributions are described in the public project documentation.';
   return [
    {key:'Overview',title:p.name,eyebrow:status,description:p.summary||p.description,foot:p.category},
    {key:'The Challenge',title:'Why this work exists.',eyebrow:'PROBLEM & CONTEXT',description:p.problem||p.description,foot:'Problem statements describe the project context, not independently verified user outcomes.'},
    {key:'My Contribution',title:'The work behind it.',eyebrow:'ROLE & CONTRIBUTION',description:p.role||caveat,items:contributions,foot:caveat},
    {key:'Decisions',title:'Thinking into action.',eyebrow:'DECISIONS & TRADE-OFFS',description:p.decision||'The public overview describes the design direction. A verified decision log has not been published.',foot:'Only documented choices are described; no unsupported alternatives are invented.'},
    {key:'The Solution',title:'What was created.',eyebrow:'DESIGN & IMPLEMENTATION',description:p.intro||p.description||p.summary,foot:p.headline||'The released evidence limits what can be concluded about this work.'},
    {key:'Testing',title:'Checks & open questions.',eyebrow:'TESTING & ITERATION',description:isPreview?'Specific testing records and usability outcomes have not been released for this case preview.':limitations,foot:'A documented test scope must not be mistaken for proof of broader user or business impact.'},
    {key:'Results',title:'What can be shown.',eyebrow:'RESULTS & LEARNINGS',description:p.result||'The published summary describes the completed design scope, but does not establish measured outcome or business impact.',foot:limitations},
    {key:'Evidence',title:'Explore the evidence.',eyebrow:'SOURCES & NEXT STEPS',description:isPreview?'Research artefacts, visual evidence, and the complete academic case study are still in preparation.':'Open the original sources to inspect work, documentation, and the stated verification scope.',links:Array.isArray(p.links)?p.links:[],foot:isPreview?'No unpublished artefact is represented as a public result.':limitations}
   ];
 }
 function initFromProject(p,isPreview=false){
   if(built||!p)return;built=true;
   const slides=beats(p,isPreview);
   const deck=node('section','ars-case-deck');
   deck.setAttribute('aria-label',p.name+' case study — swipe chapters');
   const header=node('header','ars-case-deck-header');
   const back=node('a','ars-case-back','←  All Work');
   back.href='../../#work';back.setAttribute('data-return-to-work','');
   back.addEventListener('click',()=>{
     try{sessionStorage.setItem('ars-v2-work-return','1');sessionStorage.setItem('ars-section','1');}catch{}
   });
   const count=node('span','ars-case-count','01 / '+String(slides.length).padStart(2,'0'));
   header.append(back,count);
   const progress=node('nav','ars-case-progress');
   progress.setAttribute('aria-label','Story chapters');
   const track=node('div','ars-case-track');
   track.tabIndex=0;
   track.setAttribute('role','region');
   track.setAttribute('aria-roledescription','carousel');
   track.setAttribute('aria-label','Swipe left to read the next case study chapter, or select a chapter below.');
   const buttons=[];
   const frames=[];
   for(let index=0;index<slides.length;index++){
     const beat=slides[index];
     const slide=node('section','ars-case-slide');
     slide.setAttribute('role','group');
     slide.setAttribute('aria-roledescription','slide');
     slide.setAttribute('aria-label',String(index+1)+' of '+slides.length+': '+beat.key);
     slide.setAttribute('data-case-chapter',beat.key);
     slide.append(node('span','ars-case-eyebrow',beat.eyebrow));
     slide.append(node(index===0?'h1':'h2','ars-case-heading',beat.title));
     if(beat.description)slide.append(paragraph(beat.description));
     // Reuse the already-approved source-derived artwork. This is an
     // illustration, never presented as a verified product screenshot.
     if(index===0){
       const original=body.querySelector('.showcase-art .project-art, .showcase-art .curated-media');
       if(original){
         const visual=node('figure','ars-case-visual');
         visual.append(original.cloneNode(true));
         const caption=node('figcaption','ars-case-visual-note',
           original.getAttribute('aria-label')||'Source-derived project visual; see original evidence for details.');
         visual.append(caption);slide.append(visual);
       }
     }
     if(beat.items?.length){
       const list=node('ul','ars-case-contributions');
       for(const value of beat.items){const li=node('li','',value);list.append(li);}
       slide.append(list);
     }
     if(beat.links?.length){
       const wrap=node('div','ars-case-evidence-list');
       for(const item of beat.links){
         const safe=safeExternalLink(item.url);
         if(!safe)continue;
         const a=node('a','ars-case-evidence-link',item.label+' ↗');
         a.href=safe;a.target='_blank';a.rel='noopener noreferrer';
         wrap.append(a);
       }
       slide.append(wrap);
     }
     if(beat.foot)slide.append(node('p','ars-case-footnote',beat.foot));
     if(index===0)slide.append(node('span','ars-case-swipe-instruction','←  Swipe sideways to read the story'));
     track.append(slide);frames.push(slide);
     const button=node('button','ars-case-progress-button');
     button.type='button';
     button.setAttribute('aria-label',String(index+1)+': '+beat.key);
     button.title=beat.key;
     button.addEventListener('click',()=>go(index));
     progress.append(button);buttons.push(button);
   }
   const footer=node('footer','ars-case-deck-footer');
   footer.append(node('span','ars-case-footer-label','CASE STUDY / '+p.name.toUpperCase()),progress);
   deck.append(header,track,footer);
   body.querySelector('main#main')?.prepend(deck);
   const reduced=matchMedia('(prefers-reduced-motion:reduce)');
   function go(index){
     const slide=frames[index];
     if(!slide)return;
     track.scrollTo({left:slide.offsetLeft,behavior:reduced.matches?'instant':'smooth'});
   }
   let scrolling=0;
   function sync(){
     if(!frames.length)return;
     let chosen=0,least=Infinity;
     frames.forEach((slide,index)=>{
       const dist=Math.abs(track.scrollLeft-slide.offsetLeft);
       if(dist<least){least=dist;chosen=index;}
     });
     count.textContent=String(chosen+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
     buttons.forEach((button,index)=>{
       if(index===chosen)button.setAttribute('aria-current','step');
       else button.removeAttribute('aria-current');
     });
   }
   track.addEventListener('scroll',()=>{
     if(scrolling)return;
     scrolling=requestAnimationFrame(()=>{scrolling=0;sync()});
   },{passive:true});
   track.addEventListener('keydown',e=>{
     if(e.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
     e.preventDefault();
     let current=0,d=Infinity;
     frames.forEach((slide,index)=>{
       const distance=Math.abs(track.scrollLeft-slide.offsetLeft);
       if(distance<d){d=distance;current=index;}
     });
     go(e.key==='Home'?0:e.key==='End'?frames.length-1:Math.max(0,Math.min(frames.length-1,current+(e.key==='ArrowRight'?1:-1))));
   });
   window.addEventListener('resize',sync,{passive:true});
   sync();
   body.classList.add('ars-case-slide-ready');
 }
 async function start(){
   if(built||!mobile.matches)return;
   try{
     if(caseId==='tari-cookies'){
       const response=await fetch('../../v2/content/public-work-display.json');
       if(!response.ok)throw Error('Public preview source unavailable');
       const publicData=await response.json();
       const item=publicData.items?.find(p=>p.id==='tari-cookies');
       if(!item)throw Error('Tari preview data unavailable');
       initFromProject({
         id:item.id,name:item.name,status:item.status,category:item.category,
         headline:item.headline,
         summary:item.description,
         description:item.description,
         role:'Collaborative academic team project. Specific individual contributions require verification.',
         problem:'The academic project explored ways to make the Tari Cookies hamper browsing and order journey clearer.',
         decision:'High-fidelity designs were prepared for exploring hampers, reviewing an order, and continuing to WhatsApp for confirmation.',
         intro:'A customer-research-informed high-fidelity UX design concept for a hamper ordering journey.',
         limitation:'Detailed research, contribution records, final UX media, and any usability measurements have not yet been released.',
         result:'The publicly described output is a high-fidelity design concept. No measured customer or business improvement is claimed.',
         links:[]
       },true);
     }else{
       const response=await fetch('../../content/projects.json');
       if(!response.ok)throw Error('Project data unavailable');
       const collection=await response.json();
       const project=collection.find(p=>p.id===caseId);
       if(!project)throw Error('Case record missing: '+caseId);
       initFromProject(project,false);
     }
   }catch(err){
     // Never conceal available editorial case content when a source fails.
     console.warn('Mobile story unavailable; retaining editorial case study.',err);
   }
 }
 start();
 if(typeof mobile.addEventListener==='function')mobile.addEventListener('change',start);
})();
