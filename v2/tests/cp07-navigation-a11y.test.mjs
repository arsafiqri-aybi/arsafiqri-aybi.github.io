import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {root} from '../../scripts/build.mjs';
import {resolve} from 'node:path';
const home=readFileSync(resolve(root,'index.html'),'utf8');
const css=readFileSync(resolve(root,'styles.css'),'utf8');
const js=readFileSync(resolve(root,'app.js'),'utf8');
test('primary destinations are ordinary links to visible semantic sections',()=>{
 for(const id of ['work','about','approach','connect']){
  assert.ok(home.includes('href="#'+id+'"'));
  assert.match(home,new RegExp('<section[^>]+id="'+id+'"[^>]+aria-labelledby='));
 }
 assert.doesNotMatch(home,/data-rail|data-mobile-rail|data-preview/);
});
test('media enlargement uses a native dialog and retains original image links',()=>{
 assert.match(home,/<dialog[^>]+aria-label="Full image"/);
 assert.match(home,/<button[^>]+aria-label="Close image"/);
 assert.match(js,/typeof dialog.showModal==='function'/);
 assert.match(js,/dialog.addEventListener\('close'/);
 assert.match(js,/opener\?\.focus/);
});
test('focus, motion reduction, forced colors and print have explicit presentation',()=>{
 assert.match(css,/:focus-visible/);assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/@media\(forced-colors:active\)/);assert.match(css,/@media print/);
 assert.doesNotMatch(js,/history\.pushState|touchmove|wheel'/);
});
