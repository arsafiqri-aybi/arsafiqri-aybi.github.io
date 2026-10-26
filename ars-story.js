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
   if(Array.isArray(p.chapters)&&p.chapters.length>=2&&p.chapters.length<=12)return p.chapters;
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
   const back=node('a','ars-case-back','All Work');
   back.href='../../#work';back.setAttribute('data-return-to-work','');
   back.addEventListener('click',()=>{
     try{sessionStorage.setItem('ars-v2-work-return','1');sessionStorage.setItem('ars-section','1');}catch{}
   });
   const count=node('span','ars-case-count',p.name);
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
     for(const text of beat.paragraphs??[])slide.append(paragraph(text));
     if(beat.media&&typeof beat.media==='object'&&/^assets\/(?:tari-cookies|waai-id|sarafcare)\/[a-z0-9-]+\.webp$/.test(beat.media.src)){
       const visual=node('figure','ars-case-visual case-mobile-figure case-mobile-figure--'+(beat.media.kind||'landscape'));
       const image=node('img');
       image.src='../../'+beat.media.src;image.alt=beat.media.alt;
       image.width=beat.media.width;image.height=beat.media.height;
       image.decoding='async';image.loading=index===0?'eager':'lazy';
       const open=node('a');open.href=image.src;open.target='_blank';open.rel='noopener';
       open.setAttribute('aria-label','Open full image: '+beat.media.alt);open.append(image);
       visual.append(open,node('figcaption','ars-case-visual-note',beat.media.caption));slide.append(visual);
     }else if(index===0){
       const original=body.querySelector('.showcase-art .project-art, .showcase-art .curated-media');
       if(original){const visual=node('figure','ars-case-visual');visual.append(original.cloneNode(true));slide.append(visual);}
     }
     if(beat.table){
       const wrap=node('div','case-table-scroll');wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',beat.table.caption||beat.key+' data');
       const table=node('table','case-table');
       if(beat.table.caption)table.append(node('caption','',beat.table.caption));
       const head=node('thead'),headRow=node('tr');
       for(const value of beat.table.headers){const th=node('th','',value);th.scope='col';headRow.append(th)}
       head.append(headRow);table.append(head);
       const tbody=node('tbody');
       for(const row of beat.table.rows){const tr=node('tr');row.forEach((value,i)=>{const cell=node(i===0?'th':'td','',value);if(i===0)cell.scope='row';tr.append(cell)});tbody.append(tr)}
       table.append(tbody);wrap.append(table);slide.append(wrap);
     }
     for(const card of beat.cards??[]){const item=node('div','case-mobile-card');item.append(node('h3','',card.title),paragraph(card.text));slide.append(item);}
     if(beat.quote){const quote=node('blockquote','case-quote');quote.append(paragraph('“'+beat.quote.text+'”'),node('footer','',beat.quote.by));slide.append(quote);}
     if(beat.stats?.length){const stats=node('dl','case-metrics');for(const m of beat.stats){const item=node('div');item.append(node('dt','',m.label),node('dd','',m.value));stats.append(item)}slide.append(stats);}
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
         const a=node('a','ars-case-evidence-link',item.label);
         a.href=safe;a.target='_blank';a.rel='noopener noreferrer';
         wrap.append(a);
       }
       slide.append(wrap);
     }
     if(beat.foot)slide.append(node('p','ars-case-footnote',beat.foot));
     if(index===0)slide.append(node('span','ars-case-swipe-instruction','Swipe between chapters or choose one below'));
     track.append(slide);frames.push(slide);
     const button=node('button','ars-case-progress-button',beat.key);
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
     count.textContent=p.name;
     frames.forEach((frame,index)=>{frame.inert=index!==chosen;frame.setAttribute('aria-hidden',String(index!==chosen));});
     buttons.forEach((button,index)=>{
       if(index===chosen){button.setAttribute('aria-current','step');
        if(progress.scrollWidth>progress.clientWidth)progress.scrollTo({left:button.offsetLeft-progress.clientWidth/2+button.offsetWidth/2,behavior:'instant'});
       }
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
     if(['tari-cookies','waai-id','sarafcare'].includes(caseId)){
       const embedded=document.getElementById('reviewed-case-data');
       if(!embedded)throw Error('Reviewed case data missing');
       const project=JSON.parse(embedded.textContent);
       if(project.id!==caseId||!project.chapters?.length)throw Error('Invalid reviewed case record');
       initFromProject(project,false);
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
