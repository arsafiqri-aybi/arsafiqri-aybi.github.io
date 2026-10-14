import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const text=path=>readFileSync(resolve(root,path),'utf8');
const home=text('index.html'),css=text('styles.css'),js=text('app.js');
const caseIds=['tari-cookies','hey','personal-browser-operator','scale-governor','motion','skill-builder','copywriting','website-builder'];

test('published mobile navigation and Home remain intact',()=>{
 for(const marker of ['ars-mobile-header','ars-mobile-menu','ars-work-mobile','ars-about-deck','ars-role-mobile','ars-main-swipe-cue','data-explore-work']){
  assert.ok(home.includes(marker),'missing '+marker);
 }
 assert.match(js,/function choose\(/);
 assert.match(js,/function mobileVerticalStep\(/);
 assert.match(js,/function syncBalancedMobileMenu\(/);
});
test('eight public work pages retain scripts and live styles',()=>{
 for(const id of caseIds){
  const path='work/'+id+'/index.html';
  assert.ok(existsSync(resolve(root,path)),path);
  const page=text(path);
  assert.match(page,/<main\b/);
  assert.match(page,/styles\.css\?/);
  assert.match(page,/ars-story\.js\?/);
 }
});
test('active portrait/media assets still exist; obsolete thumbnail is gone',()=>{
 for(const path of ['assets/ars-portrait-800.webp','assets/core.svg','assets/motion-captions.vtt','assets/motion-original-contact-sheet.png'])assert.ok(existsSync(resolve(root,path)),path);
 assert.equal(existsSync(resolve(root,'assets/ars-portrait.webp')),false);
});
test('unused opt-in layout diagnosis no longer ships',()=>{
 assert.doesNotMatch(js,/grid-review|grid-inspect|grid-review-controls/);
 assert.doesNotMatch(css,/\.grid-review|\.ars-grid-guides|\.ars-guide/);
});
test('generator refuses to overwrite a diverged published page by default',()=>{
 const generator=text('scripts/build.mjs');
 assert.match(generator,/const drift=generatedFiles\.filter/);
 assert.match(generator,/Refusing to overwrite published markup/);
 assert.match(generator,/--allow-layout-overwrite/);
});
test('sitemap preserves seven documented legacy cases',()=>{
 const sitemap=text('sitemap.xml');
 for(const id of caseIds.slice(1))assert.ok(sitemap.includes('/work/'+id+'/'),id);
});
