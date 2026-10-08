/**
 * ARS v2 media registry — allowlisted placements only.
 * Register assets only after source, scope and owner rights have been reviewed.
 * Content on public GitHub branches is itself public.
 */
const required=(v)=>typeof v==='string'&&v.trim().length>0;
const fail=code=>{throw new Error('ARS_V2_MEDIA:'+code)};
const imagePath=/^assets\/[a-z0-9-]+\.webp$/;
const motionURL=/^https:\/\/raw\.githubusercontent\.com\/arsafiqri-aybi\/motion-render-video\/[a-f0-9]{40}\/examples\/rendered\/demo\.mp4$/;
const scopeMap=Object.freeze({'ars-portrait':['home','about'],'motion-original-demo':['motion-case'],'motion-original-contact-sheet':['motion-case']});
const rightsMap=Object.freeze({'ars-portrait':'OWNER_APPROVED_HOME_ABOUT','motion-original-demo':'PUBLIC_REPOSITORY_ORIGINAL_WITH_SCOPED_USAGE','motion-original-contact-sheet':'PUBLIC_REPOSITORY_ORIGINAL_WITH_SCOPED_USAGE'});
const safeHash=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);

export function validateMediaRegistry(registry){
 const issues=[];
 if(!registry||registry.schemaVersion!==1||!Array.isArray(registry.items))return ['INVALID_REGISTRY'];
 const ids=new Set();
 for(const item of registry.items){
  if(!item||typeof item!=='object'||!required(item.id)){issues.push('INVALID_RECORD');continue}
  if(ids.has(item.id))issues.push('DUPLICATE_ID:'+item.id);
  ids.add(item.id);
  if(!Object.prototype.hasOwnProperty.call(scopeMap,item.id)){issues.push('UNREGISTERED_ASSET:'+item.id);continue}
  if(!Array.isArray(item.scope)||item.scope.length!==scopeMap[item.id].length||!scopeMap[item.id].every(slot=>item.scope.includes(slot)))issues.push('INVALID_SCOPE:'+item.id);
  if(item.rights!==rightsMap[item.id])issues.push('RIGHTS_SCOPE_MISMATCH:'+item.id);
  if(!(safeHash(item.sha256)||(item.id==='motion-original-contact-sheet'&&/^[a-f0-9]{40}$/.test(item.sourceGitBlobSha)))||!required(item.source)||!required(item.alt))issues.push('INVALID_PROVENANCE:'+item.id);
  if(!Number.isInteger(item.width)||item.width<=0||!Number.isInteger(item.height)||item.height<=0)issues.push('INVALID_DIMENSIONS:'+item.id);
  if(item.id==='ars-portrait'){
   if(item.kind!=='image'||!imagePath.test(item.path)||item.url!==undefined||!Number.isInteger(item.bytes)||item.bytes<=0)issues.push('INVALID_PORTRAIT:'+item.id);
  }else if(item.id==='motion-original-contact-sheet'){
   if(item.kind!=='image'||item.path!=='assets/motion-original-contact-sheet.png'||item.bytes!==76029||item.sourceGitBlobSha!=='1b259487f736970eeb8db34b05642ab48cac0ddb'||item.sourceCommit!=='ac73856a159587db1aa936409fd718bd5115ae5b')issues.push('INVALID_POSTER_SOURCE:'+item.id);
  }else if(item.id==='motion-original-demo'){
   if(item.kind!=='video'||!motionURL.test(item.url)||item.path!==undefined||item.durationSeconds!==6)issues.push('INVALID_MOTION:'+item.id);
  }
 }
 for(const requiredId of Object.keys(scopeMap))if(!ids.has(requiredId))issues.push('MISSING_ASSET:'+requiredId);
 return issues;
}

export function resolveApprovedMedia(registry,id,slot){
 const errors=validateMediaRegistry(registry);
 if(errors.length)fail('REGISTRY_INVALID:'+errors.join(','));
 if(!Object.prototype.hasOwnProperty.call(scopeMap,id))fail('ASSET_NOT_REGISTERED');
 if(!scopeMap[id].includes(slot))fail('SLOT_NOT_APPROVED');
 const item=registry.items.find(x=>x.id===id);
 if(!item)fail('ASSET_NOT_FOUND');
 return {...item,scope:[...item.scope]};
}
