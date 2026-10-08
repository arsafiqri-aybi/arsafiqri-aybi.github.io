import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const js=readFileSync(resolve(root,'app.js'),'utf8');

test('focus moves to new section heading',()=>{
 assert.match(js,/function focusLocationTarget\(/);
 assert.match(js,/pages\.find\(p=>p\.dataset\.page===section\)\?\.querySelector\('h1'\)/);
 assert.match(js,/h\.setAttribute\('tabindex','-1'\)/);
 assert.match(js,/h\.focus\(\{preventScroll:true\}\)/);
});
test('user route clicks and history invoke focus',()=>{
 assert.match(js,/hashchange'[^\n]*focusLocationTarget\(\)/);
 assert.match(js,/popstate'[^\n]*focusLocationTarget\(\)/);
 assert.match(js,/data-open[^\n]*focusLocationTarget\(\)/);
 assert.match(js,/data-back[^\n]*focusLocationTarget\(\)/);
});
test('return origin records the exact duplicate link index',()=>{
 assert.match(js,/const linkIndex=\[\.\.\.document\.querySelectorAll\('a\[data-gallery-project\]'\)\]\.indexOf\(a\)/);
 assert.match(js,/JSON\.stringify\(\{path:location\.pathname,id,linkIndex,scrollY:window\.scrollY\}\)/);
});
test('recorded index is validated and falls back safely to matching id',()=>{
 assert.match(js,/Number\.isSafeInteger\(recorded\.linkIndex\)/);
 assert.match(js,/recorded\.linkIndex>=0/);
 assert.match(js,/exact\?\.getAttribute\('data-gallery-project'\)===recorded\.id/);
});
test('native document scroll remains and exact work link is focused',()=>{
 assert.match(js,/Math\.min\(recorded\.scrollY,maxY\)/);
 assert.match(js,/target\?\.focus\(\{preventScroll:true\}\)/);
 assert.match(js,/for\(const surface of \[rail,previewStage\]\)/);
});
test('motion and reduced-motion controls remain intact',()=>{
 assert.match(js,/cover\.addEventListener\('click'/);
 assert.match(js,/if\(reduced\.matches\)root\.classList\.add\('no-motion'\)/);
});
