/**
 * ARS v2 T2 bridge: the real site generator can select a safe public catalog.
 * It never certifies the authenticity of claimed owner approvals.
 */
import {readFileSync,realpathSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {planCandidate} from './release-gates.mjs';

export const PINNED_BASELINE='c2362592002839b765d8539efd0b912fad162070';
export const LEGACY_IDS=Object.freeze(['hey','personal-browser-operator','scale-governor','motion','skill-builder','copywriting','website-builder']);
export const LEGACY_SELECTED=Object.freeze(['hey','personal-browser-operator','motion']);
const legacyRoutes=LEGACY_IDS.map(id=>'/work/'+id+'/');
const legacySet=new Set(LEGACY_IDS);
const ident=id=>typeof id==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
const fail=code=>{throw new Error('ARS_V2_RELEASE_GATE:'+code)};

/** Pure catalog adapter. Held records cannot reach page or sitemap generation. */
export function resolveV2ReleaseView(catalog,manifest=null){
 if(!Array.isArray(catalog))fail('CATALOG_NOT_ARRAY');
 const ids=catalog.map(p=>p?.id);
 if(ids.some(id=>!ident(id))||new Set(ids).size!==ids.length)fail('INVALID_OR_DUPLICATE_PROJECT_ID');
 for(const id of LEGACY_IDS)if(!ids.includes(id))fail('MISSING_EXISTING_ROUTE_'+id);
 const extras=catalog.filter(p=>!legacySet.has(p.id));
 if(manifest===null){
  if(extras.length)fail('NEW_CATALOG_ITEMS_REQUIRE_RELEASE_MANIFEST');
  return {mode:'LEGACY_PRESERVED',items:catalog,selectedIds:[...LEGACY_SELECTED],heldIds:[],newRoutes:[],homeFeatureId:'hey',safeToDeploy:false};
 }
 if(!manifest||typeof manifest!=='object'||Array.isArray(manifest))fail('INVALID_MANIFEST');
 if(manifest.baseline?.commit!==PINNED_BASELINE)fail('BASELINE_MISMATCH');
 if(!Array.isArray(manifest.baseline.legacyRoutes)||new Set(manifest.baseline.legacyRoutes).size!==legacyRoutes.length||legacyRoutes.some(r=>!manifest.baseline.legacyRoutes.includes(r)))fail('LEGACY_ROUTE_MISMATCH');
 const plan=planCandidate(manifest);
 if(!plan.ok)fail('CANDIDATE_CONTRACT_INVALID');
 const eligibleExtras=new Set(plan.projects.filter(p=>p.kind==='candidate'&&p.eligible).map(p=>p.id));
 const candidateInManifest=new Set(manifest.projects.filter(p=>p.kind==='candidate').map(p=>p.id));
 if(extras.some(p=>!candidateInManifest.has(p.id)))fail('CATALOG_ENTRY_MISSING_FROM_MANIFEST');
 if([...eligibleExtras].some(id=>!ids.includes(id)))fail('APPROVED_PROJECT_MISSING_CONTENT');
 const allowed=new Set([...LEGACY_IDS,...eligibleExtras]);
 return {mode:'CANDIDATE_PREVIEW',items:catalog.filter(p=>allowed.has(p.id)),
  selectedIds:plan.publicSelectedIds.filter(id=>allowed.has(id)),
  heldIds:extras.filter(p=>!eligibleExtras.has(p.id)).map(p=>p.id),
  newRoutes:extras.filter(p=>eligibleExtras.has(p.id)).map(p=>'/work/'+p.id+'/'),
  homeFeatureId:plan.home.featureProjectId??null,safeToDeploy:false};
}

/** External manifest is NEVER allowed inside a public-repository checkout. */
export function loadV2ReleaseView({root,catalog,manifestPath=null}){
 if(!manifestPath)return resolveV2ReleaseView(catalog);
 const rootReal=realpathSync(root),pathReal=realpathSync(resolve(manifestPath));
 const rel=relative(rootReal,pathReal);
 if(rel===''||(!rel.startsWith('..')&&!isAbsolute(rel)))fail('MANIFEST_MUST_BE_OUTSIDE_PUBLIC_REPOSITORY');
 return resolveV2ReleaseView(catalog,JSON.parse(readFileSync(pathReal,'utf8')));
}
