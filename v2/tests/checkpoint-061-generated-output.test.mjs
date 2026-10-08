import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const file=p=>readFileSync(resolve(root,p),'utf8');
const home=file('index.html'),motion=file('work/motion/index.html'),social=file('social.svg');
import {createHash} from 'node:crypto';
const media=JSON.parse(file('v2/content/approved-media.json'));
const legacy=['hey','personal-browser-operator','scale-governor','motion','skill-builder','copywriting','website-builder'];
test('generated Home reflects approved identity, not old Home',()=>{
 assert.match(home,/Digital Builder × Business Strategist/);
 assert.doesNotMatch(home,/Integrated Digital Builder|Featured: Hey by Ars/);
});
test('portrait is referenced only by Home/About composition',()=>{
 assert.equal((home.match(/src="\.\/assets\/ars-portrait-800\.webp"/g)||[]).length,2);
 for(const id of legacy)assert.doesNotMatch(file('work/'+id+'/index.html'),/ars-portrait-800\.webp/);
});
test('portrait usage scopes exclude social and project galleries',()=>{
 const portrait=media.items.find(x=>x.id==='ars-portrait');
 assert.deepEqual(portrait.scope,['home','about']);
 assert.doesNotMatch(social,/ars-portrait|<image|<img/);
});
test('authentic source motion preview is paired with user-triggered controls',()=>{
 assert.match(motion,/data-motion-play/);
 assert.match(motion,/motion-original-contact-sheet\.png/);
 assert.match(motion,/ac73856a159587db1aa936409fd718bd5115ae5b/);
 assert.match(motion,/<video controls preload="none" playsinline/);
 assert.doesNotMatch(motion,/<video[^>]*\s(?:autoplay|loop)\b/);
});
test('held projects do not leak into generated public routes or sitemap',()=>{
 for(const id of ['tari-cookies','waai-id','sarafcare']){
  assert.equal(existsSync(resolve(root,'work',id,'index.html')),false);
  assert.doesNotMatch(file('sitemap.xml'),new RegExp('/work/'+id+'/'));
 }
});
test('all seven legacy case studies retain deep link anchors and return navigation',()=>{
 const sitemap=file('sitemap.xml');
 for(const id of legacy){
  const c=file('work/'+id+'/index.html');
  for(const anchor of ['story','process','outcome','technical'])assert.match(c,new RegExp('id="'+anchor+'"'));
  assert.match(c,/data-return-to-work/);
  assert.match(sitemap,new RegExp('/work/'+id+'/'));
 }
});
test('all local media references exist in current branch checkout',()=>{
 assert.equal(existsSync(resolve(root,'assets/ars-portrait-800.webp')),true);
 assert.equal(existsSync(resolve(root,'assets/motion-original-contact-sheet.png')),true);
});

test('portrait 800 binary matches declared provenance',()=>{
 const p=media.items.find(x=>x.id==='ars-portrait');
 const bytes=readFileSync(resolve(root,p.path));
 assert.equal(bytes.length,9888);
 assert.equal(p.width,800);assert.equal(p.height,800);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'d2578b49531b52d247eedb83064cb43b4bb0a84d65932e1abe410f3c03daf0b8');
 assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex'),'4a46765f2a93d57fdf30b23498b656b0aebc8113');
});
