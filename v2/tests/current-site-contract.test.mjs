import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {buildSite,root,safeURL,esc} from '../../scripts/build.mjs';
const files=buildSite();
const text=path=>readFileSync(resolve(root,path),'utf8');
const pagePaths=files.filter(f=>f.path.endsWith('.html'));
const decode=x=>x.replaceAll('&amp;','&').replaceAll('&quot;','"');

test('all published pages are reproducible from the canonical content and renderer',()=>{
 for(const f of files)assert.equal(text(f.path),f.content,f.path);
});
test('the current public selection has seven project routes and no retired projects',()=>{
 const projectPaths=files.filter(f=>f.path.startsWith('work/')).map(f=>f.path);
 assert.equal(projectPaths.length,7);
 for(const id of ['hey','personal-browser-operator','motion']){
  assert.ok(!projectPaths.includes('work/'+id+'/index.html'));
  assert.ok(!text('index.html').includes('work/'+id+'/'));
  assert.ok(!text('sitemap.xml').includes('work/'+id+'/'));
 }
});
test('each page has one main heading, native navigation, a skip target and current metadata',()=>{
 for(const {path,content} of pagePaths){
  assert.equal((content.match(/<h1(?:\s|>)/g)||[]).length,1,path);
  assert.equal((content.match(/<main(?:\s|>)/g)||[]).length,1,path);
  assert.match(content,/<html lang="en">/);
  assert.match(content,/id="main" tabindex="-1"/);
  assert.match(content,/href="#main">Skip to content/);
  assert.match(content,/name="viewport"/);
  assert.match(content,/rel="canonical"/);
  assert.match(content,/aria-label="Main navigation"/);
  assert.doesNotMatch(content,/data-explorer|ars-case-deck|data-rail=|ars-story\.js/);
 }
});
test('every local asset and page link resolves; all local fragment references exist',()=>{
 for(const {path,content} of pagePaths){
  const ids=[...content.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,path+' duplicate IDs');
  for(const [,raw] of content.matchAll(/\b(?:href|src)="([^"]+)"/g)){
   const value=decode(raw);
   if(/^(?:https?:|data:)/.test(value))continue;
   const url=new URL(value,'https://portfolio.test/'+path);
   let file=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
   file=resolve(root,'.'+file);
   assert.ok(existsSync(file),path+' → '+value);
   if(url.hash){const destination=text(file);assert.ok(destination.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),path+' → '+value);}
  }
 }
});
test('published case content preserves every reviewed paragraph, table and evidence asset',()=>{
 for(const id of ['tari-cookies','waai-id','sarafcare']){
  const record=JSON.parse(text('content/'+id+'.json')),html=text('work/'+id+'/index.html');
  for(const section of record.sections){
   assert.ok(html.includes('id="'+section.id+'"'));
   for(const paragraph of section.body)assert.ok(html.includes(esc(paragraph)),id+' paragraph');
   if(section.quote)assert.ok(html.includes(esc(section.quote.text)));
   for(const row of section.table?.rows??[])for(const cell of row)assert.ok(html.includes(esc(cell)));
  }
  for(const asset of record.mediaAssets){
   const bytes=readFileSync(resolve(root,asset.path));
   assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
   assert.ok(html.includes('../../'+asset.path));
  }
 }
});
test('source limits and historical labels are retained alongside reported results',()=>{
 const waai=text('work/waai-id/index.html'),saraf=text('work/sarafcare/index.html');
 assert.ok(waai.includes('23 August 2026'));assert.ok(waai.includes('Historical'));
 assert.ok(saraf.includes('not calculated profit'));assert.ok(saraf.includes('Planned budget'));
});
test('unsafe URL schemes and credential-bearing destinations are rejected',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,hello','http://example.com','https://secret@example.com','https://user:pass@example.com'])assert.equal(safeURL(url),null);
 assert.equal(safeURL('https://example.com/path'),'https://example.com/path');
 assert.equal(esc('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('new-tab destinations use isolation and every non-dialog image has dimensions and alternative text',()=>{
 for(const {content} of pagePaths){
  for(const [tag] of content.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))assert.match(tag,/rel="noopener noreferrer"/);
  for(const [tag] of content.matchAll(/<img\b[^>]*>/g)){
   assert.match(tag,/alt="[^"]*"/);
   if(!tag.includes('src='))continue;
   assert.match(tag,/width="\d+"/);assert.match(tag,/height="\d+"/);
  }
 }
});

test('sharing preview is a 1200 by 630 PNG and is used in published metadata',()=>{
 const bytes=readFileSync(resolve(root,'social.png'));
 assert.equal(bytes.subarray(1,4).toString(),'PNG');
 assert.equal(bytes.readUInt32BE(16),1200);assert.equal(bytes.readUInt32BE(20),630);
 for(const {content} of pagePaths)assert.ok(content.includes('property="og:image" content="https://arsafiqri-aybi.github.io/social.png"'));
});
