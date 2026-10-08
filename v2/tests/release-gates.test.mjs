import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {REQUIRED_GATES,validateCandidate,planCandidate} from '../scripts/release-gates.mjs';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(readFileSync(join(root,'examples/SYNTHETIC_ONLY.json'),'utf8'));
const copy=()=>structuredClone(source);
const invalid=change=>{const d=copy();change(d);return validateCandidate(d).map(x=>x.code)};
const cleared=()=>{
 const d=copy(),p=d.projects[1];
 for(const gate of REQUIRED_GATES)p.gates[gate]='PASS';
 p.ownerProjectApproved=true;
 d.release.approvedProjectIds=['pending-example'];
 d.release.exactCandidateApproved=true;
 d.claims[0].evidenceStatus='SUPPORTED';
 d.claims[0].publicUse='PASS';
 d.claims[0].sourceRef='FAKE_SOURCE';
 d.assets[0].distribution='PASS';
 return d;
};
test('synthetic baseline valid',()=>{assert.match(source._warning,/SYNTHETIC/);assert.deepEqual(validateCandidate(source),[])});
test('pending route, selected work and media held by default',()=>{
 const out=planCandidate(copy());assert.equal(out.ok,true);
 assert.deepEqual(out.publicSelectedIds,[]);assert.deepEqual(out.newRouteProposals,[]);
 assert.deepEqual(out.sitemapProposals,['/','/work/existing-example/']);
 assert.equal(out.home.featureProjectId,null);assert.equal(out.safeToDeploy,false);
});
test('legacy route preserved during staged release',()=>assert.deepEqual(planCandidate(copy()).retainedLegacyRoutes,['/work/existing-example/']));
test('duplicate selection rejected',()=>assert.ok(invalid(d=>d.selectedOrder.push('pending-example')).includes('INVALID_SELECTED_ORDER')));
test('missing project reference rejected',()=>assert.ok(invalid(d=>d.selectedOrder.push('unknown')).includes('UNKNOWN_SELECTED_PROJECT')));
test('unknown approval rejected',()=>assert.ok(invalid(d=>d.release.approvedProjectIds.push('unknown')).includes('APPROVAL_UNKNOWN_PROJECT')));
test('path traversal rejected',()=>assert.ok(invalid(d=>d.projects[1].route='/work/../private/').includes('INVALID_PROJECT_ID_ROUTE')));
test('duplicate route rejected',()=>assert.ok(invalid(d=>d.projects[1].route='/work/existing-example/').includes('DUPLICATE_PROJECT_ROUTE')));
test('duplicate id rejected',()=>assert.ok(invalid(d=>d.projects[1].id='existing-example').includes('DUPLICATE_PROJECT_ID')));
test('published flag cannot be used at candidate planning',()=>assert.ok(invalid(d=>d.release.publicationState='PUBLISHED').includes('INVALID_RELEASE')));
test('invented gate cannot pass',()=>assert.ok(invalid(d=>d.projects[1].gates.rights='AUTO_PASS').includes('INVALID_GATE')));
test('unsupported claim cannot be approved',()=>assert.ok(invalid(d=>d.claims[0].publicUse='PASS').includes('INVALID_CLAIM')));
test('approved claim requires source',()=>assert.ok(invalid(d=>{d.claims[0].publicUse='PASS';d.claims[0].evidenceStatus='SUPPORTED'}).includes('INVALID_CLAIM')));
test('media provenance required',()=>assert.ok(invalid(d=>d.assets[0].provenance='').includes('INVALID_ASSET')));
test('owner project approval alone insufficient',()=>{
 const d=copy();d.projects[1].ownerProjectApproved=true;d.release.approvedProjectIds=['pending-example'];
 assert.deepEqual(planCandidate(d).newRouteProposals,[]);
});
test('exact candidate approval is independently required',()=>{
 const d=cleared();d.release.exactCandidateApproved=false;
 assert.deepEqual(planCandidate(d).newRouteProposals,[]);
});
test('per-project owner approval required',()=>{
 const d=cleared();d.projects[1].ownerProjectApproved=false;
 assert.deepEqual(planCandidate(d).newRouteProposals,[]);
});
test('only fully synthetic cleared candidate proposes route',()=>{
 const out=planCandidate(cleared());
 assert.deepEqual(out.newRouteProposals,['/work/pending-example/']);
 assert.deepEqual(out.publicSelectedIds,['pending-example']);
 assert.equal(out.home.featureProjectId,'pending-example');
 assert.equal(out.writesFiles,false);assert.equal(out.safeToDeploy,false);
});
test('uncleared media keeps route held',()=>{
 const d=cleared();d.assets[0].distribution='HOLD';assert.deepEqual(planCandidate(d).newRouteProposals,[]);
});
test('uncleared claim keeps route held',()=>{
 const d=cleared();d.claims[0].publicUse='REJECT';assert.deepEqual(planCandidate(d).newRouteProposals,[]);
});
test('invalid candidate fails closed',()=>{
 const d=copy();d.projects[0].route='/private';
 const out=planCandidate(d);assert.equal(out.ok,false);assert.equal(out.safeToDeploy,false);
});
