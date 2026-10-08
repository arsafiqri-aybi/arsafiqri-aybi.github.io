/**
 * ARS Gallery v2 — pure, release-gated editorial layout planner.
 * Inputs MUST already be filtered through resolveV2ReleaseView().
 * Never infers media clearance or authorizes publication.
 */
export const GALLERY_VARIANTS = Object.freeze(['primary','feature','editorial']);
const LEGACY_VARIANTS = Object.freeze({hey:'feature','personal-browser-operator':'editorial',motion:'primary'});
const text = value=>typeof value==='string'&&value.trim().length>0;
const slug = value=>typeof value==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const fail = code=>{throw new Error('ARS_V2_GALLERY:'+code)};

export function planEditorialGallery(catalog,selectedIds){
 if(!Array.isArray(catalog)||!Array.isArray(selectedIds))fail('INVALID_INPUT');
 if(new Set(selectedIds).size!==selectedIds.length)fail('DUPLICATE_SELECTED_ID');
 const byId=new Map();
 for(const p of catalog){
  if(!p||!slug(p.id)||byId.has(p.id))fail('INVALID_OR_DUPLICATE_CATALOG');
  byId.set(p.id,p);
 }
 const selected=selectedIds.map((id,index)=>{
  const p=byId.get(id);
  if(!p)fail('SELECTED_PROJECT_NOT_IN_RELEASE_CATALOG');
  const g=p.gallery??{};
  if(g===null||typeof g!=='object'||Array.isArray(g))fail('INVALID_GALLERY_ENTRY');
  const variant=g.variant??LEGACY_VARIANTS[p.id]??GALLERY_VARIANTS[index%GALLERY_VARIANTS.length];
  if(!GALLERY_VARIANTS.includes(variant))fail('INVALID_VARIANT');
  for(const name of ['headline','description','category','statusLabel'])if(g[name]!==undefined&&!text(g[name]))fail('INVALID_COPY_'+name);
  if(g.media!==undefined)fail('MEDIA_MANIFEST_REQUIRED');
  return {
   id:p.id,route:'/work/'+p.id+'/',name:p.name,
   variant,number:String(index+1).padStart(2,'0'),
   headline:g.headline??p.headline??p.name,
   description:g.description??p.summary??'',
   category:g.category??p.category??'',
   status:g.statusLabel??p.status??'',
   mediaLabel:'Editorial illustration — not a product screenshot'
  };
 });
 // Full index retains all released routes, never duplicates selected work.
 const allWork=catalog.map(p=>({id:p.id,name:p.name,route:'/work/'+p.id+'/',category:p.category??'',status:p.status??''}));
 const readingOrder=[...selected.map(x=>x.id),...allWork.map(x=>x.id).filter(id=>!selectedIds.includes(id))];
 const nextWork=Object.fromEntries(readingOrder.map((id,index)=>[id,readingOrder[(index+1)%readingOrder.length]]));
 return {selected,allWork,readingOrder,nextWork,hasSelected:selected.length>0};
}
