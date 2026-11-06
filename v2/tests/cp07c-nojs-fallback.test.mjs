import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const css=readFileSync(resolve(root,'styles.css'),'utf8');
const html=readFileSync(resolve(root,'index.html'),'utf8');

test('No-JavaScript fallback hides offscreen section previews',()=>{
 assert.match(css,/html:not\(\.is-enhanced\) \.section-preview:not\(\.is-selected\)\{display:none\}/);
});
test('Fallback rule does not suppress selected identity preview',()=>{
 assert.doesNotMatch(css,/html:not\(\.is-enhanced\) \.section-preview\{display:none\}/);
 assert.match(html,/class="section-preview is-selected"/);
});
test('All five full destinations remain in static HTML',()=>{
 for(const id of ['work','expertise','approach','about','connect']){
  assert.match(html,new RegExp('data-page="'+id+'"'));
 }
});
test('Mobile rail scroll containment remains independent of fallback',()=>{
 assert.match(css,/\.rail-window\{width:100%\}\.rail-list\{width:max-content\}/);
 assert.match(css,/html:not\(\.is-enhanced\) \.section-preview:not/);
});
test('Enabled JavaScript uses original selected-preview hiding rule',()=>{
 assert.match(css,/\.is-enhanced \.section-preview:not\(\.is-selected\)\{display:none\}/);
});
