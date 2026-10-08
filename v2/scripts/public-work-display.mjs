/**
 * Public-facing *presentation* plan only. Does not grant case route, media,
 * rights or evidence release. Unreleased items stay explicitly unlinked.
 */
export const PUBLIC_DISPLAY_ORDER=Object.freeze(['tari-cookies','hey','waai-id','personal-browser-operator','sarafcare','motion']);
const PLACEHOLDER_NAMES=Object.freeze({'tari-cookies':'Tari Cookies','waai-id':'waai.id',sarafcare:'SarafCare'});
const RELEASED_NAMES=Object.freeze({hey:'Hey by Ars','personal-browser-operator':'Personal Browser Operator',motion:'Motion Render Video'});
const VARIANTS=new Set(['primary','feature','editorial']);
const safeText=s=>typeof s==='string'&&s.trim().length>0&&s.length<900&&!/[<>]/.test(s);
const fail=reason=>{throw new Error('PUBLIC_WORK_DISPLAY:'+reason)};

export function planPublicWorkDisplay(manifest, releasedCatalog){
 if(!manifest||manifest.schemaVersion!==1||!Array.isArray(manifest.items)||!Array.isArray(releasedCatalog))fail('INVALID_INPUT');
 if(manifest.items.length!==6 || manifest.items.some((e,i)=>e?.id!==PUBLIC_DISPLAY_ORDER[i]))fail('UNAPPROVED_ORDER');
 const released=new Map(releasedCatalog.map(p=>[p.id,p]));
 return manifest.items.map((e,i)=>{
  if(!e||!VARIANTS.has(e.variant)||!['released','placeholder'].includes(e.display))fail('INVALID_ENTRY');
  for(const k of ['name','category','headline','description','status'])if(!safeText(e[k]))fail('INVALID_COPY_'+k);
  if(Object.keys(e).some(k=>!['id','name','display','variant','category','headline','description','status','visualLabel'].includes(k)))fail('UNAPPROVED_FIELDS');
  const documented=Object.prototype.hasOwnProperty.call(RELEASED_NAMES,e.id);
  if(documented){
   if(e.display!=='released'||e.name!==RELEASED_NAMES[e.id]||!released.has(e.id)||e.visualLabel!==undefined)fail('RELEASED_NOT_IN_CATALOG');
  }else{
   if(e.display!=='placeholder'||e.name!==PLACEHOLDER_NAMES[e.id]||released.has(e.id)||!safeText(e.visualLabel))fail('PLACEHOLDER_NOT_SAFE');
  }
  // An unapproved placeholder NEVER receives a route, href, media ref, or an evidence claim.
  return Object.freeze({...e,number:String(i+1).padStart(2,'0'),href:documented?'./work/'+e.id+'/':null});
 });
}

/** Markup renderer only for fixed public preview metadata; HTML always escaped. */
export function renderPublicWorkDisplayCards(displayed,items,art,esc,artEl,artCaption=()=>"Editorial illustration — not a product screenshot",motion=null){
 return displayed.map(entry=>{
  const p=entry.href?items.find(x=>x.id===entry.id):null;
  const playable=entry.id==='motion'&&motion;
  const pending=entry.display==='placeholder';
  const picture=p&&art[p.id]?'<span class="curated-media">'+artEl(p)+'<span class="curated-media-caption">'+esc(artCaption(p))+'</span></span>':null;
  const film=playable?'<div class="curated-media curated-film"><div class="motion-player" data-motion-player><video controls preload="none" playsinline poster="'+esc(motion.poster.dataUrl)+'" aria-label="Original six-second motion study"><source src="'+esc(motion.video.url)+'" type="video/mp4"><track kind="captions" src="./assets/motion-captions.vtt" srclang="en" label="English"></video><button class="motion-play-cover" type="button" data-motion-play aria-label="Play original six-second motion study"><span class="motion-direct-frame" aria-hidden="true"><img src="'+esc(motion.poster.dataUrl)+'" width="640" height="360" alt="" loading="lazy"></span><span class="motion-play-label" aria-hidden="true">Play film <span>▶</span></span></button></div><span class="motion-play-error" role="status" data-motion-error></span><span class="curated-media-caption">Original render · Six seconds · Sound on play</span><details class="film-description"><summary>Film description</summary><p>A red circle follows a curved path, changes into a square, and settles. Labels introduce Form, Time, and Sound with four sound cues.</p></details></div>':null;
  const visual=film??(pending?
   '<span class="curated-media curated-media--pending pending--'+esc(entry.id)+'" role="img" aria-label="'+esc(entry.visualLabel)+'">'+
   '<span class="pending-index" aria-hidden="true">'+esc(entry.number)+'</span>'+
   '<span class="pending-art" aria-hidden="true"><i></i><i></i><i></i></span>'+
   '<span class="pending-label" aria-hidden="true">'+esc(entry.name)+'</span>'+
   '<span class="pending-visual-caption">'+esc(entry.visualLabel)+'</span></span>':picture);
  if(!visual)throw new Error('PUBLIC_WORK_DISPLAY:MISSING_APPROVED_ILLUSTRATION_'+entry.id);
  const tag=pending||playable?'article':'a';
  const attributes=pending||playable?'':' href="'+esc(entry.href)+'" data-gallery-project="'+esc(entry.id)+'"';
  const cue=pending?'Detailed case study in preparation':'Explore project <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const destination=playable?'<a class="curated-case-link" href="'+esc(entry.href)+'" data-gallery-project="'+esc(entry.id)+'">'+cue+'</a>':cue;
  const inner='<span class="curated-index"><span>'+esc(entry.number)+'</span><span>'+esc(entry.category)+'</span></span>'+visual+
   '<div class="curated-copy"><span class="curated-category">'+esc(entry.category)+'</span><span class="curated-title">'+esc(entry.name)+'</span>'+
   '<h2 class="curated-headline">'+esc(entry.headline)+'</h2><span class="curated-description">'+esc(entry.description)+'</span>'+
   '<span class="curated-footer"><span>'+esc(entry.status)+'</span><span class="curated-explore">'+destination+'</span></span></div>';
  return '<'+tag+' class="curated-work curated--'+esc(entry.variant)+(pending?' curated--placeholder':'')+'"'+attributes+'>'+inner+'</'+tag+'>';
 }).join('');
}
