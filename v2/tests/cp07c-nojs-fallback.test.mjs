import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {root} from '../../scripts/build.mjs';
import {resolve} from 'node:path';
const home=readFileSync(resolve(root,'index.html'),'utf8');
const cases=['tari-cookies','waai-id','sarafcare'].map(id=>readFileSync(resolve(root,'work/'+id+'/index.html'),'utf8'));
test('home content is rendered statically without an enhancement gate',()=>{
 assert.doesNotMatch(home,/is-enhanced|<noscript| hidden|\sinert/);
 for(const text of ['Curiosity','Universitas Cakrawala','Tari Cookies','waai.id','SarafCare'])assert.ok(home.includes(text));
});
test('reviewed case evidence and full-size image destinations exist without runtime generation',()=>{
 for(const html of cases){
  assert.match(html,/class="case-story"/);assert.match(html,/class="image-link" href="\.\.\/\.\.\/assets\//);
  assert.doesNotMatch(html,/reviewed-case-data|ars-case-slide-ready/);
 }
});
