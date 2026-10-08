import test from 'node:test';
import assert from 'node:assert/strict';
import {planEditorialGallery} from '../scripts/gallery-plan.mjs';
const catalog=()=>[
 {id:'hey',name:'Hey by Ars',headline:'AI acts. You stay in control.',summary:'Scoped',category:'Android × AI',status:'Development'},
 {id:'personal-browser-operator',name:'Browser Operator',headline:'Verified actions',summary:'Real Chromium',category:'Browser',status:'CI'},
 {id:'motion',name:'Motion',headline:'Motion through code',summary:'Video rendering',category:'Motion',status:'Study'},
 {id:'scale-governor',name:'Scale & Governor',category:'AI'}
];
const ids=['hey','personal-browser-operator','motion'];
const fail=(source,chosen,pattern)=>assert.throws(()=>planEditorialGallery(source,chosen),pattern);
test('release-filtered selected layout uses feature/editorial/primary rhythm',()=>assert.deepEqual(planEditorialGallery(catalog(),ids).selected.map(x=>x.variant),['feature','editorial','primary']));
test('safe gallery rows have one destination',()=>assert.deepEqual(planEditorialGallery(catalog(),ids).selected.map(x=>x.route),['/work/hey/','/work/personal-browser-operator/','/work/motion/']));
test('selected order stable',()=>assert.deepEqual(planEditorialGallery(catalog(),ids).selected.map(x=>x.id),ids));
test('six work compositions supported without public real project drafts',()=>{const d=catalog();for(const id of ['sample-a','sample-b','sample-c'])d.push({id,name:id});const s=[...ids,'sample-a','sample-b','sample-c'];assert.deepEqual(planEditorialGallery(d,s).selected.map(x=>x.variant),['feature','editorial','primary','primary','feature','editorial'])});
test('gallery only accepts released catalog ids',()=>fail(catalog(),['unapproved'],/NOT_IN_RELEASE_CATALOG/));
test('duplicate selected id rejected',()=>fail(catalog(),['hey','hey'],/DUPLICATE_SELECTED_ID/));
test('duplicate catalog id rejected',()=>fail([...catalog(),catalog()[0]],ids,/INVALID_OR_DUPLICATE_CATALOG/));
test('path-invalid record rejected',()=>fail([...catalog(),{id:'../private'}],ids,/INVALID_OR_DUPLICATE_CATALOG/));
test('unknown visual variant rejected',()=>{const d=catalog();d[0].gallery={variant:'hero-verified'};fail(d,ids,/INVALID_VARIANT/)});
test('empty editorial override rejected',()=>{const d=catalog();d[0].gallery={description:''};fail(d,ids,/INVALID_COPY_description/)});
test('nested arbitrary media injection rejected',()=>{const d=catalog();d[0].gallery={media:{src:'unapproved'}};fail(d,ids,/MEDIA_MANIFEST_REQUIRED/)});
test('empty selected work yields clean absence, not synthetic placeholder',()=>{const x=planEditorialGallery(catalog(),[]);assert.equal(x.hasSelected,false);assert.equal(x.selected.length,0)});
test('all work index contains unique released projects',()=>{const x=planEditorialGallery(catalog(),ids);assert.equal(x.allWork.length,4);assert.equal(new Set(x.allWork.map(p=>p.id)).size,4)});
test('next-work follows selected ordering then remaining archive',()=>{const x=planEditorialGallery(catalog(),['motion','hey']);assert.deepEqual(x.readingOrder,['motion','hey','personal-browser-operator','scale-governor']);assert.equal(x.nextWork.motion,'hey');assert.equal(x.nextWork['scale-governor'],'motion')});
test('missing catalog id rejected',()=>fail([{name:'none'}],[],/INVALID_OR_DUPLICATE_CATALOG/));
test('content copy overrides are allowed with cleared source',()=>{const d=catalog();d[0].gallery={variant:'primary',headline:'One browser. Two modes of control.',description:'Documented work',category:'Android',statusLabel:'In Development'};const x=planEditorialGallery(d,['hey']);assert.equal(x.selected[0].headline,'One browser. Two modes of control.');assert.equal(x.selected[0].variant,'primary')});
test('media label remains explicitly editorial',()=>assert.match(planEditorialGallery(catalog(),ids).selected[0].mediaLabel,/not a product screenshot/));
