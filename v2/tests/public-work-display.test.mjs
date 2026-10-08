import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {planPublicWorkDisplay} from '../scripts/public-work-display.mjs';
import {resolveV2ReleaseView} from '../scripts/generator-bridge.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const manifest=JSON.parse(read('v2/content/public-work-display.json'));
const released=resolveV2ReleaseView(JSON.parse(read('content/projects.json')));
const home=read('index.html');
test('exact six curated cards and ordered labels',()=>{
 const names=manifest.items.map(i=>i.name);
 const indices=names.map(n=>home.indexOf('class="curated-title">'+n+'</span>'));
 assert.ok(indices.every((x,i)=>x>=0&&(i===0||x>indices[i-1])));
 assert.equal((home.match(/class="curated-work /g)||[]).length,6);
});
test('three placeholders cannot navigate to unpublished case studies',()=>{
 const plans=planPublicWorkDisplay(manifest,released.items);
 assert.deepEqual(plans.filter(p=>p.href===null).map(p=>p.id),['tari-cookies','waai-id','sarafcare']);
 for(const id of ['tari-cookies','waai-id','sarafcare']){
  assert.doesNotMatch(home,new RegExp('href="\\./work/'+id+'/'));
  assert.doesNotMatch(home,new RegExp('data-gallery-project="'+id+'"'));
  assert.doesNotMatch(read('sitemap.xml'),new RegExp('/work/'+id+'/'));
 }
});
test('exact released projects have active routes',()=>{
 const plans=planPublicWorkDisplay(manifest,released.items).filter(p=>p.href);
 assert.deepEqual(plans.map(p=>p.id),['hey','personal-browser-operator','motion']);
 for(const p of plans)assert.match(home,new RegExp('data-gallery-project="'+p.id+'"'));
});
test('legacy published route index and sitemap remain unchanged',()=>{
 for(const id of ['hey','personal-browser-operator','scale-governor','motion','skill-builder','copywriting','website-builder']){
  assert.match(home,new RegExp('class="index-row" href="\\./work/'+id+'/'));
  assert.match(read('sitemap.xml'),new RegExp('/work/'+id+'/'));
 }
});
test('fail closed on changed order, media, route, or promoted held record',()=>{
 for(const fn of [m=>m.items.reverse(),m=>m.items[0].media='file.png',m=>m.items[0].href='work/tari-cookies/',m=>m.items[0].display='released',m=>m.items[0].description='<script>']){const copy=structuredClone(manifest);fn(copy);assert.throws(()=>planPublicWorkDisplay(copy,released.items),/PUBLIC_WORK_DISPLAY/)}
});
test('media scopes remain sealed',()=>{
 assert.equal(released.safeToDeploy,false);
 const media=JSON.parse(read('v2/content/approved-media.json'));
 assert.deepEqual(media.items.find(x=>x.id==='ars-portrait').scope,['home','about']);
 assert.equal((home.match(/src="\.\/assets\/ars-portrait-800\.webp"/g)||[]).length,2);
 assert.doesNotMatch(home,/Rp59k|83,089|67,328|10,380/);
});
