import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const css=read('styles.css');
const template=read('scripts/build.mjs');
const home=read('index.html');

test('Mobile scroll containment fixes flex min-content expansion',()=>{
 assert.match(css,/\/\* CP07B: mobile horizontal rail scroll stays inside viewport \*\//);
 assert.match(css,/@media\(max-width:680px\)\{\.explore-layout,\.section-rail,\.rail-window,\.preview-stage\{min-width:0;max-width:100%\}/);
 assert.match(css,/\.rail-window\{width:100%\}\.rail-list\{width:max-content\}/);
});
test('Mobile navigation remains a horizontal scroller',()=>{
 assert.match(css,/\.rail-window\{height:auto;overflow-x:auto;overflow-y:hidden/);
 assert.match(css,/\.rail-list\{flex-direction:row;gap:25px;min-width:max-content\}/);
});
test('Connect has one primary heading both template and generated HTML',()=>{
 assert.match(template,/<div class="contact-simple"><h1>Let's talk about what you're building\.<\/h1>/);
 assert.match(home,/<section class="page" id="connect"[\s\S]*?<div class="contact-simple"><h1>Let's talk about what you're building\.<\/h1>/);
 assert.doesNotMatch(home,/<div class="contact-simple"><h2>/);
});
test('Connect heading inherits original responsive typography',()=>{
 assert.equal((css.match(/\.contact-simple h1\{/g)||[]).length,2);
 assert.doesNotMatch(css,/\.contact-simple h2\{/);
});
test('All destination headings remain reachable for keyboard focus',()=>{
 for(const id of ['work','expertise','approach','about','connect']){
  const p=home.match(new RegExp('<section class="page" id="'+id+'"[\\s\\S]*?<\\/section>'));
  assert.ok(p,'page '+id+' exists');
  assert.match(p[0],/<h1\b/);
 }
 assert.match(read('app.js'),/function focusLocationTarget\(/);
});
