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
export function renderPublicWorkDisplayCards(displayed,items,art,esc,artEl){
 return displayed.map(entry=>{
  const p=entry.href?items.find(x=>x.id===entry.id):null;
  const pending=entry.display==='placeholder';
  const picture=p&&art[p.id]?'<span class="curated-media">'+artEl(p)+'<span class="curated-media-caption">Editorial illustration — not a product screenshot</span></span>':null;
  const visual=pending?
   '<span class="curated-media curated-media--pending pending--'+esc(entry.id)+'" role="img" aria-label="'+esc(entry.visualLabel)+'">'+
   '<span class="pending-index" aria-hidden="true">'+esc(entry.number)+'</span>'+
   '<span class="pending-art" aria-hidden="true"><i></i><i></i><i></i></span>'+
   '<span class="pending-label" aria-hidden="true">'+esc(entry.name)+'</span>'+
   '<span class="pending-visual-caption">'+esc(entry.visualLabel)+'</span></span>':picture;
  if(!visual)throw new Error('PUBLIC_WORK_DISPLAY:MISSING_APPROVED_ILLUSTRATION_'+entry.id);
  const tag=pending?'article':'a';
  const attributes=pending?'':' href="'+esc(entry.href)+'" data-gallery-project="'+esc(entry.id)+'"';
  const cue=pending?'Detailed case study in preparation':'Explore project <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const inner='<span class="curated-index"><span>'+esc(entry.number)+'</span><span>'+esc(entry.category)+'</span></span>'+visual+
   '<span class="curated-copy"><span class="curated-category">'+esc(entry.category)+'</span><span class="curated-title">'+esc(entry.name)+'</span>'+
   '<span class="curated-headline">'+esc(entry.headline)+'</span><span class="curated-description">'+esc(entry.description)+'</span>'+
   '<span class="curated-footer"><span>'+esc(entry.status)+'</span><span class="curated-explore">'+cue+'</span></span></span>';
  return '<'+tag+' class="curated-work curated--'+esc(entry.variant)+(pending?' curated--placeholder':'')+'"'+attributes+'>'+inner+'</'+tag+'>';
 }).join('');
}
