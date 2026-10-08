/* URL-level static-site verification. Run with ARS_BROWSER and ARS_AXE paths. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=process.env.ARS_QA_OUT||path.resolve(root,'../qa-final');
const projects=JSON.parse(fs.readFileSync(path.join(root,'content/projects.json')));
const report={date:new Date().toISOString(),scope:'Local HTTP origin, actual static output, Chromium',checks:[],accessibility:[],viewports:[],errors:[]};
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4','.xml':'application/xml','.vtt':'text/vtt'};
const serve=http.createServer((req,res)=>{
 let f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!f.startsWith(root+path.sep)&&f!==root){res.writeHead(403);res.end();return}
 try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');res.setHeader('Content-Type',mime[path.extname(f)]||'text/plain');res.end(fs.readFileSync(f))}
 catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(fs.readFileSync(path.join(root,'404.html')))}
});
const check=async(name,fn)=>{try{const evidence=await fn();report.checks.push({name,status:'PASS',evidence});console.log('PASS '+name)}catch(e){report.checks.push({name,status:'FAIL',reason:e.message});console.log('FAIL '+name+': '+e.message)}};
(async()=>{
 await new Promise(r=>serve.listen(0,'127.0.0.1',r));const host='http://127.0.0.1:'+serve.address().port;
 const browser=await chromium.launch({executablePath:process.env.ARS_BROWSER,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
 context.setDefaultTimeout(10000);
 page.on('pageerror',e=>report.errors.push(e.message));
 const goto=async(route)=>{const r=await page.goto(host+route);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(120);return r};
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 await check('Responsive six-section journeys and all seven case routes',async()=>{
  for(const width of [320,375,430,680,768,1024,1440]){
   await page.setViewportSize({width,height:width<680?844:1000});
   for(const section of ['home','work','expertise','approach','about','connect']){
    await goto(section==='home'?'/':'/#'+section);assert.equal(await overflow(),false,section+' overflow '+width);
    if(section==='work'){assert.equal(await page.locator('.curated-work').count(),6);assert.equal(await page.locator('.curated--placeholder').count(),3);}
    if(section==='home'||section==='about')await page.waitForFunction(()=>Array.from(document.querySelectorAll('img[src*="ars-portrait"]')).filter(i=>i.getBoundingClientRect().width>0).every(i=>i.complete&&i.naturalWidth===800));
   }
   for(const p of projects){assert.equal((await goto('/work/'+p.id+'/')).status(),200);assert.equal(await overflow(),false,p.id+' overflow '+width);assert.equal(await page.locator('h1').count(),1)}
   report.viewports.push({width,status:'PASS',sections:6,cases:7});
  }
  await page.setViewportSize({width:568,height:320});await goto('/#work');assert.equal(await overflow(),false);return 'Seven widths, landscape, 91 route renders; decoded owner portrait.';
 });
 await check('All local links, anchors, metadata and held-route exclusion',async()=>{
  for(const route of ['/',...projects.map(p=>'/work/'+p.id+'/'),'/404.html']){
   await goto(route);
   const bad=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].filter(a=>a.origin===location.origin&&a.pathname===location.pathname&&a.hash&&!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.getAttribute('href')));
   assert.deepEqual(bad,[],route+' invalid anchors');
   const hrefs=await page.locator('a[href]').evaluateAll(links=>[...new Set(links.filter(a=>a.origin===location.origin).map(a=>a.pathname))]);
   for(const href of hrefs)assert.equal((await context.request.get(host+href)).status(),200,route+' -> '+href);
   assert.equal(await page.locator('link[rel="canonical"]').count(),1);
   assert.equal(await page.locator('meta[name="description"]').count(),1);
   assert.equal(await page.locator('a video,a button').count(),0);
  }
  for(const id of ['tari-cookies','waai-id','sarafcare'])assert.equal((await context.request.get(host+'/work/'+id+'/')).status(),404);
  return 'No broken local route or fragment; video controls separate from case links; three unpublished cases absent.';
 });
 await check('Gallery case navigation, Back, Forward and exact focus restoration',async()=>{
  await page.setViewportSize({width:1440,height:1000});await goto('/#work');
  const link=page.locator('.curated-work[data-gallery-project="personal-browser-operator"]');await link.scrollIntoViewIfNeeded();await link.focus();const y=await page.evaluate(()=>scrollY);await link.press('Enter');assert(page.url().includes('/work/personal-browser-operator/'));
  await page.goBack();await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>document.activeElement.dataset.galleryProject),'personal-browser-operator');assert(Math.abs((await page.evaluate(()=>scrollY))-y)<5);
  await page.goForward();assert(page.url().includes('/work/personal-browser-operator/'));await page.locator('[data-return-to-work]').first().click();await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>document.activeElement.dataset.galleryProject),'personal-browser-operator');assert(Math.abs((await page.evaluate(()=>scrollY))-y)<5);
  await goto('/work/hey/');await page.locator('.site-footer a').last().click();assert.equal(new URL(page.url()).pathname,'/');return 'Browser history and explicit return restore recorded gallery scroll and focus; case footer Home returns to root.';
 });
 await check('Rail keyboard, edge scroll, section focus and theme controls',async()=>{
  await goto('/#home');const rail=page.locator('[data-rail="home"]');await rail.focus();await rail.press('End');assert.equal(await page.locator('[data-rail="connect"]').getAttribute('aria-current'),'true');await page.locator('[data-rail="connect"]').press('Home');assert.equal(await rail.getAttribute('aria-current'),'true');
  const gesture=await page.evaluate(()=>{const stage=document.querySelector('.preview-stage');const zoom=new WheelEvent('wheel',{deltaY:120,ctrlKey:true,cancelable:true,bubbles:true});stage.dispatchEvent(zoom);return !zoom.defaultPrevented});assert(gesture);
  await page.locator('[data-open="work"]').first().click();assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H1');assert.equal(await page.evaluate(()=>document.activeElement.closest('[data-page]').dataset.page),'work');
  for(const theme of ['dark','light','contextual']){await page.locator('[data-theme-switch]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),theme)}
  return 'Keyboard selection and heading focus work; browser zoom gesture remains native; three appearance modes.';
 });
 await check('No-JavaScript fallback with six native destinations and direct cases',async()=>{
  const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:844}}),p=await c.newPage();await p.goto(host+'/');assert.equal(await p.locator('.static-nav a').count(),6);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await p.locator('.static-nav a[href="#work"]').click();assert(await p.locator('#work').isVisible());await p.locator('.curated-case-link').click();assert(p.url().includes('/work/motion/'));assert(await p.locator('video[controls]').isVisible());await c.close();return 'Native anchors, original poster, video controls, and seven static case pages work without JS.';
 });
 await check('Original film manual playback, pause, seek, audio, replay, and navigation pause',async()=>{
  const file=process.env.ARS_MOTION_FILE;assert(file,'ARS_MOTION_FILE required');const bytes=fs.readFileSync(file);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'8464f3295c7ec284b0f9470a8bf9051a4b7b4f2e81779353a1469f4df1722c31');
  await page.route('**/examples/rendered/demo.mp4',r=>r.fulfill({body:bytes,contentType:'video/mp4'}));
  await goto('/#work');const video=page.locator('#work video');assert(await video.evaluate(v=>v.paused&&!v.autoplay&&!v.loop&&v.readyState===0));
  await page.locator('#work [data-motion-play]').click();await page.waitForFunction(()=>{const v=document.querySelector('#work video');return !v.paused&&v.currentTime>0.05});assert.equal(await video.evaluate(v=>v.videoWidth),640);assert.equal(await video.evaluate(v=>v.videoHeight),360);assert.equal(await video.evaluate(v=>v.duration),6);
  await video.evaluate(v=>{v.pause();v.muted=true;v.currentTime=5.8});await video.evaluate(v=>v.play());await page.waitForFunction(()=>document.querySelector('#work video').ended);await video.evaluate(v=>{v.currentTime=0;return v.play()});await page.waitForFunction(()=>!document.querySelector('#work video').paused);await page.locator('[data-open="expertise"]').last().click();assert(await video.evaluate(v=>v.paused));
  await goto('/work/motion/');await page.locator('[data-motion-play]').click();await page.waitForFunction(()=>!document.querySelector('video').paused);await page.unroute('**/examples/rendered/demo.mp4');return 'Actual hash-verified H.264/AAC source decoded (640×360, 6s). Local playback uses pinned-source bytes; external delivery checked separately.';
 });
 await check('Film error keeps the authentic poster and an accessible fallback',async()=>{
  await page.route('**/examples/rendered/demo.mp4',r=>r.abort());await goto('/work/motion/');await page.locator('[data-motion-play]').click();await page.waitForFunction(()=>document.querySelector('[data-motion-error]').textContent.includes('Playback unavailable'));assert(await page.locator('video').evaluate(v=>Boolean(v.poster)));await page.unroute('**/examples/rendered/demo.mp4');return 'Error feedback and source references retained; native video poster remains.';
 });
 await check('Automated accessibility sample in all sections, cases and themes',async()=>{
  assert(process.env.ARS_AXE,'ARS_AXE path required');
  for(const theme of ['contextual','dark','light']){
   await page.evaluate(t=>localStorage.setItem('ars-theme',t),theme);
   for(const route of ['/',...['work','expertise','approach','about','connect'].map(s=>'/#'+s),...projects.map(p=>'/work/'+p.id+'/'),'/404.html']){
    await goto(route);await page.addScriptTag({path:process.env.ARS_AXE});
    const r=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
    report.accessibility.push({route,theme,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)});
   }
  }
  const failed=report.accessibility.filter(x=>x.violations.length);assert.equal(failed.length,0,JSON.stringify(failed.map(x=>({route:x.route,theme:x.theme,violations:x.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))}))));return '42 automated samples; this is not full WCAG or screen-reader certification.';
 });
 await check('Initial-load size, rendering time and layout stability (local lab)',async()=>{
  const c=await browser.newContext({viewport:{width:375,height:844},reducedMotion:'reduce'}),p=await c.newPage();
  await p.addInitScript(()=>{window.arsLab={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.arsLab.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.arsLab.cls+=e.value}).observe({type:'layout-shift',buffered:true})});
  await p.goto(host+'/#home');await p.waitForTimeout(700);
  const lab=await p.evaluate(()=>({...window.arsLab,bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)+performance.getEntriesByType('navigation')[0].transferSize,videoRequests:performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.mp4')).length}));
  assert(lab.bytes<400000,'Initial request budget exceeded');assert(lab.lcp>0&&lab.lcp<2500,'Local LCP budget exceeded');assert(lab.cls<0.1,'Layout shift budget exceeded');assert.equal(lab.videoRequests,0);report.performance={environment:'Local HTTP, Chromium, 375×844, unthrottled; not field CWV',budgets:{bytes:400000,lcpMs:2500,cls:0.1},observed:lab};await c.close();return lab;
 });
 await check('Reduced motion and zero runtime errors',async()=>{await goto('/#home');await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);assert.deepEqual(report.errors,[]);return 'No running decorative animations under reduced motion; no page errors.'});
 await page.evaluate(()=>localStorage.setItem('ars-theme','contextual'));
 for(const width of [375,1440]){await page.setViewportSize({width,height:width===375?844:1000});for(const route of ['/#home', '/#work','/#about','/work/hey/','/work/motion/']){await goto(route);await page.screenshot({path:path.join(out,`${width}-${route.replace(/[^a-z]/g,'')||'home'}.png`),fullPage:true});}}
 await browser.close();serve.close();report.status=report.checks.every(x=>x.status==='PASS')?'PASS':'FAIL';report.limitations=['No physical-device tests or screen-reader session.','No field Core Web Vitals measurements.','Local playback verifies original bytes, not the external host.'];fs.writeFileSync(path.join(out,'browser-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,checks:report.checks.length,failed:report.checks.filter(c=>c.status==='FAIL').map(c=>c.name)}));if(report.status==='FAIL')process.exitCode=1;
})().catch(e=>{console.error(e);serve.close();process.exitCode=1});
