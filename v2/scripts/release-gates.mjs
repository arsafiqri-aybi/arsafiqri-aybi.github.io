/**
 * ARS v2 T1: pure release gate candidate planner.
 * This module NEVER writes source/HTML or publishes anything.
 * Caller must independently verify authenticity of owner authorization.
 */
export const REQUIRED_GATES = Object.freeze(['editorial','evidence','attribution','rights','privacy','media']);
const routeRE=/^\/work\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;
const slugRE=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const unique=a=>new Set(a).size===a.length;
const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const error=(code,value)=>({code,...(value===undefined?{}:{value})});

export function validateCandidate(data){
 const problems=[];
 if(!record(data))return [error('INVALID_CANDIDATE')];
 const {baseline,projects,selectedOrder,claims,assets,release}=data;
 if(!record(baseline)||!nonempty(baseline.commit)||!Array.isArray(baseline.legacyRoutes))problems.push(error('INVALID_BASELINE'));
 else{
  if(!unique(baseline.legacyRoutes))problems.push(error('DUPLICATE_LEGACY_ROUTE'));
  for(const route of baseline.legacyRoutes)if(!routeRE.test(route))problems.push(error('INVALID_LEGACY_ROUTE',route));
 }
 if(!Array.isArray(projects))problems.push(error('INVALID_PROJECTS'));
 if(!Array.isArray(selectedOrder)||!unique(selectedOrder))problems.push(error('INVALID_SELECTED_ORDER'));
 if(!Array.isArray(claims))problems.push(error('INVALID_CLAIMS'));
 if(!Array.isArray(assets))problems.push(error('INVALID_ASSETS'));
 if(!record(release)||!Array.isArray(release.approvedProjectIds)||!unique(release.approvedProjectIds)||typeof release.exactCandidateApproved!=='boolean'||release.publicationState!=='DRAFT')problems.push(error('INVALID_RELEASE'));
 if(problems.length)return problems;
 const ids=projects.map(p=>p?.id),routes=projects.map(p=>p?.route);
 if(!unique(ids))problems.push(error('DUPLICATE_PROJECT_ID'));
 if(!unique(routes))problems.push(error('DUPLICATE_PROJECT_ROUTE'));
 for(const p of projects){
  if(!record(p)||!slugRE.test(p.id)||p.route!=='/work/'+p.id+'/'||!routeRE.test(p.route)){
   problems.push(error('INVALID_PROJECT_ID_ROUTE',p?.id));continue;
  }
  if(!['legacy','candidate'].includes(p.kind))problems.push(error('INVALID_PROJECT_KIND',p.id));
  if(!record(p.gates))problems.push(error('INVALID_PROJECT_GATES',p.id));
  else for(const gate of REQUIRED_GATES)if(!['PASS','HOLD','FAIL','NOT_RUN'].includes(p.gates[gate]))problems.push(error('INVALID_GATE',p.id+':'+gate));
  if(typeof p.ownerProjectApproved!=='boolean')problems.push(error('INVALID_PROJECT_APPROVAL',p.id));
  if(p.kind==='legacy'&&!baseline.legacyRoutes.includes(p.route))problems.push(error('UNPINNED_LEGACY_ROUTE',p.id));
  if(p.kind==='candidate'&&baseline.legacyRoutes.includes(p.route))problems.push(error('CANDIDATE_OVERLAPS_LEGACY',p.id));
 }
 for(const id of selectedOrder)if(!ids.includes(id))problems.push(error('UNKNOWN_SELECTED_PROJECT',id));
 for(const id of release.approvedProjectIds)if(!ids.includes(id))problems.push(error('APPROVAL_UNKNOWN_PROJECT',id));
 if(!unique(claims.map(c=>c?.id)))problems.push(error('DUPLICATE_CLAIM'));
 for(const c of claims){
  if(!record(c)||!nonempty(c.id)||!ids.includes(c.projectId)||!['SUPPORTED','LIMITED','NOT_SUPPORTED'].includes(c.evidenceStatus)||!['PASS','HOLD','REJECT'].includes(c.publicUse)||(c.publicUse==='PASS'&&(c.evidenceStatus!=='SUPPORTED'||!nonempty(c.sourceRef))))problems.push(error('INVALID_CLAIM',c?.id));
 }
 if(!unique(assets.map(a=>a?.id)))problems.push(error('DUPLICATE_ASSET'));
 for(const a of assets){
  if(!record(a)||!nonempty(a.id)||!ids.includes(a.projectId)||!nonempty(a.provenance)||!['PASS','HOLD','REJECT'].includes(a.distribution))problems.push(error('INVALID_ASSET',a?.id));
 }
 return problems;
}

export function planCandidate(data){
 const problems=validateCandidate(data);
 if(problems.length)return {ok:false,errors:problems,safeToDeploy:false};
 const {baseline,projects,selectedOrder,claims,assets,release}=data;
 const details=projects.map(p=>{
  const blockers=[];
  for(const gate of REQUIRED_GATES)if(p.gates[gate]!=='PASS')blockers.push('GATE_'+gate.toUpperCase()+'_'+p.gates[gate]);
  if(!p.ownerProjectApproved||!release.approvedProjectIds.includes(p.id))blockers.push('PROJECT_APPROVAL_MISSING');
  if(!release.exactCandidateApproved)blockers.push('EXACT_RELEASE_APPROVAL_MISSING');
  if(claims.some(c=>c.projectId===p.id&&c.publicUse!=='PASS'))blockers.push('UNAPPROVED_CLAIM_PRESENT');
  if(assets.some(a=>a.projectId===p.id&&a.distribution!=='PASS'))blockers.push('UNCLEARED_ASSET_PRESENT');
  return {id:p.id,route:p.route,kind:p.kind,eligible:blockers.length===0,blockers};
 });
 const eligible=new Set(details.filter(d=>d.eligible).map(d=>d.id));
 const publicSelectedIds=selectedOrder.filter(id=>eligible.has(id));
 const newRouteProposals=details.filter(d=>d.kind==='candidate'&&d.eligible).map(d=>d.route);
 const nextWork=Object.fromEntries(publicSelectedIds.map((id,i)=>[id,publicSelectedIds[(i+1)%publicSelectedIds.length]]));
 const featureProjectId=eligible.has(release.intendedHomeFeature)?release.intendedHomeFeature:null;
 return {
  ok:true,mode:'T1_PURE_DRY_RUN',baselineCommit:baseline.commit,
  releaseState:'DRAFT',projects:details,publicSelectedIds,newRouteProposals,
  retainedLegacyRoutes:[...baseline.legacyRoutes],
  sitemapProposals:['/',...baseline.legacyRoutes,...newRouteProposals],
  nextWork,home:{featureProjectId,composition:featureProjectId?'CLEARED_WORK_FEATURE':'IDENTITY_FIRST_NO_UNAPPROVED_REPLACEMENT'},
  writesFiles:false,safeToDeploy:false
 };
}
