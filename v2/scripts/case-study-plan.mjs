/**
 * ARS v2 Checkpoint 05: adaptive case-study planner.
 * Pure data transformation, no clearance decision and no side effects.
 * Caller MUST pass only release-gated project records.
 */
export const CASE_TYPES=Object.freeze(['research-ux','engineering','creative-editorial','business-campaign','motion','ai-workflow','communication','web-experience']);
const DEFAULT_TYPES=Object.freeze({
 'tari-cookies':'research-ux','hey':'engineering','waai-id':'creative-editorial',
 'personal-browser-operator':'engineering','sarafcare':'business-campaign',
 'motion':'motion','scale-governor':'ai-workflow','skill-builder':'ai-workflow',
 'copywriting':'communication','website-builder':'web-experience'
});
const HEADINGS={
 'research-ux':['From customer questions to design decisions.','Research & prototype evidence.'],
 'engineering':['Making system behavior observable.','Architecture, constraints & sources.'],
 'creative-editorial':['Shaping a story for real people.','Creative decisions & original sources.'],
 'business-campaign':['Connecting offers to conversations.','Campaign journey & observed scope.'],
 'motion':['Working with form, timing & movement.','Rendering & audiovisual evidence.'],
 'ai-workflow':['Defining boundaries before execution.','Workflow & source evidence.'],
 'communication':['Deciding what a message should say.','Message architecture & evidence.'],
 'web-experience':['Designing an experience that behaves clearly.','Frontend structure & decisions.']
};
const text=x=>typeof x==='string'&&x.trim().length>0;
const fail=k=>{throw new Error('ARS_V2_CASE:'+k)};
const secureUrl=u=>typeof u==='string'&&/^https:\/\/[a-zA-Z0-9.-]+(?::[0-9]{1,5})?(?:[/?#]|$)/.test(u)&&!/\s/.test(u)&&!u.includes('..');
export function planCaseStudy(p,nodes=[]){
 if(!p||typeof p!=='object'||Array.isArray(p)||!text(p.id)||!text(p.name))fail('PROJECT_REQUIRED');
 const detail=p.caseStudy??{};
 if(!detail||typeof detail!=='object'||Array.isArray(detail))fail('INVALID_DETAIL');
 if('media' in detail||'video' in detail||'image' in detail)fail('MEDIA_REQUIRES_SEPARATE_CLEARANCE');
 const kind=detail.type??DEFAULT_TYPES[p.id]??'web-experience';
 if(!CASE_TYPES.includes(kind))fail('UNSUPPORTED_KIND');
 if(!Array.isArray(nodes))fail('INVALID_NODES');
 const links=p.links??[];
 if(!Array.isArray(links))fail('INVALID_LINKS');
 for(const link of links)if(!link||!text(link.label)||!secureUrl(link.url))fail('UNSAFE_OR_MISSING_SOURCE_LINK');
 for(const node of nodes)if(!Array.isArray(node)||node.length<3||!node.slice(0,2).every(text)||!secureUrl(node[2]))fail('INVALID_ARCHITECTURE_NODE');
 for(const field of ['problem','intro','decision','result','limitation','role'])if(p[field]!==undefined&&typeof p[field]!=='string')fail('INVALID_FIELD_'+field);
 const contribution=detail.contribution??p.role??'';
 if(typeof contribution!=='string')fail('INVALID_CONTRIBUTION');
 const sections=[
  {id:'story',nav:'Context',heading:'Why this work exists.',kind:'context'},
  {id:'process',nav:'Decisions',heading:HEADINGS[kind][0],kind:'decision'},
  {id:'outcome',nav:'Outcome',heading:'What the evidence can support.',kind:'outcome'}
 ];
 const explorer=nodes.length>0&&['engineering','ai-workflow','motion','web-experience'].includes(kind);
 if(links.length||explorer)sections.push({id:'technical',nav:'Evidence',heading:HEADINGS[kind][1],kind:explorer?'architecture':'sources'});
 return {
  id:p.id,type:kind,title:p.name,
  hero:{category:p.category??'',status:p.status??'',headline:p.headline??p.name},
  contribution,sections,sources:links,architecture:explorer?nodes:[],
  context:{problem:p.problem??'',intro:p.intro??''},
  decision:{text:p.decision??'',headline:p.headline??p.name},
  outcome:{result:p.result??'',limitation:p.limitation??'',status:p.status??''},
  noPublicSources:links.length===0,
  mediaPolicy:'SEPARATE_CLEARED_MANIFEST_REQUIRED',
  evidencePolicy:'CLAIMS_ARE_SCOPE_LIMITED'
 };
}
