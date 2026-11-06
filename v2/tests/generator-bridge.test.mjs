import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {REQUIRED_GATES} from '../scripts/release-gates.mjs';
import {PINNED_BASELINE,LEGACY_IDS,LEGACY_SELECTED,resolveV2ReleaseView,loadV2ReleaseView} from '../scripts/generator-bridge.mjs';
const legacy=()=>LEGACY_IDS.map(id=>({id,name:id}));
const extra=()=>[...legacy(),{id:'cleared-example',name:'Synthetic Example'}];
const gates=()=>Object.fromEntries(REQUIRED_GATES.map(k=>[k,'PASS']));
const proposal=()=>({baseline:{commit:PINNED_BASELINE,legacyRoutes:LEGACY_IDS.map(id=>'/work/'+id+'/')},
 projects:[{id:'cleared-example',route:'/work/cleared-example/',kind:'candidate',gates:gates(),ownerProjectApproved:true}],
 selectedOrder:['cleared-example'],claims:[],assets:[],
 release:{approvedProjectIds:['cleared-example'],exactCandidateApproved:true,publicationState:'DRAFT',intendedHomeFeature:'cleared-example'}});
test('default build retains seven legacy records and current selected three',()=>{
 const v=resolveV2ReleaseView(legacy());assert.equal(v.mode,'LEGACY_PRESERVED');
 assert.deepEqual(v.items.map(x=>x.id),LEGACY_IDS);assert.deepEqual(v.selectedIds,LEGACY_SELECTED);
 assert.equal(v.safeToDeploy,false);
});
test('new catalog item without manifest fails closed',()=>assert.throws(()=>resolveV2ReleaseView(extra()),/REQUIRE_RELEASE_MANIFEST/));
test('missing legacy record fails closed',()=>assert.throws(()=>resolveV2ReleaseView(legacy().slice(1)),/MISSING_EXISTING_ROUTE/));
test('duplicate project rejected',()=>assert.throws(()=>resolveV2ReleaseView([...legacy(),legacy()[0]]),/DUPLICATE_PROJECT_ID/));
test('invalid id rejected',()=>assert.throws(()=>resolveV2ReleaseView([...legacy(),{id:'..'}]),/INVALID_OR_DUPLICATE/));
test('baseline mismatch rejected',()=>{const m=proposal();m.baseline.commit='wrong';assert.throws(()=>resolveV2ReleaseView(extra(),m),/BASELINE_MISMATCH/)});
test('legacy route removal rejected',()=>{const m=proposal();m.baseline.legacyRoutes.pop();assert.throws(()=>resolveV2ReleaseView(extra(),m),/LEGACY_ROUTE_MISMATCH/)});
test('synthetic cleared candidate can enter preview but cannot deploy',()=>{
 const v=resolveV2ReleaseView(extra(),proposal());assert.deepEqual(v.newRoutes,['/work/cleared-example/']);
 assert.deepEqual(v.selectedIds,['cleared-example']);assert.equal(v.safeToDeploy,false);
});
test('uncleared rights block route, gallery and feature',()=>{
 const m=proposal();m.projects[0].gates.rights='HOLD';const v=resolveV2ReleaseView(extra(),m);
 assert.deepEqual(v.newRoutes,[]);assert.deepEqual(v.selectedIds,[]);assert.deepEqual(v.heldIds,['cleared-example']);
 assert.equal(v.homeFeatureId,null);
});
test('missing owner approval blocks route',()=>{const m=proposal();m.projects[0].ownerProjectApproved=false;assert.deepEqual(resolveV2ReleaseView(extra(),m).newRoutes,[])});
test('missing exact-candidate approval blocks route',()=>{const m=proposal();m.release.exactCandidateApproved=false;assert.deepEqual(resolveV2ReleaseView(extra(),m).newRoutes,[])});
test('phantom approved candidate fails closed',()=>assert.throws(()=>resolveV2ReleaseView(legacy(),proposal()),/APPROVED_PROJECT_MISSING_CONTENT/));
test('unlisted new catalog record fails closed',()=>assert.throws(()=>resolveV2ReleaseView([...extra(),{id:'unlisted'}],proposal()),/CATALOG_ENTRY_MISSING/));
test('invalid publication state is rejected',()=>{const m=proposal();m.release.publicationState='PUBLISHED';assert.throws(()=>resolveV2ReleaseView(extra(),m),/CONTRACT_INVALID/)});
test('external manifest loads in preview mode only',()=>{
 const p=mkdtempSync(join(tmpdir(),'ars-v2-'));const root=join(p,'public');mkdirSync(root);
 const file=join(p,'release.json');writeFileSync(file,JSON.stringify(proposal()));
 try{assert.equal(loadV2ReleaseView({root,catalog:extra(),manifestPath:file}).safeToDeploy,false)}finally{rmSync(p,{recursive:true,force:true})}
});
test('manifest inside checkout is rejected',()=>{
 const p=mkdtempSync(join(tmpdir(),'ars-v2-'));const root=join(p,'public');mkdirSync(root);
 const file=join(root,'release.json');writeFileSync(file,JSON.stringify(proposal()));
 try{assert.throws(()=>loadV2ReleaseView({root,catalog:extra(),manifestPath:file}),/OUTSIDE_PUBLIC_REPOSITORY/)}finally{rmSync(p,{recursive:true,force:true})}
});
test('symlink to checkout cannot evade manifest boundary',()=>{
 const p=mkdtempSync(join(tmpdir(),'ars-v2-'));const root=join(p,'public');mkdirSync(root);
 const inside=join(root,'release.json'),outside=join(p,'alias.json');
 writeFileSync(inside,JSON.stringify(proposal()));symlinkSync(inside,outside);
 try{assert.throws(()=>loadV2ReleaseView({root,catalog:extra(),manifestPath:outside}),/OUTSIDE_PUBLIC_REPOSITORY/)}finally{rmSync(p,{recursive:true,force:true})}
});
