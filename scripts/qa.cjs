/* Real-browser checks. Test dependencies are external; no runtime dependency is shipped. */
const fs=require('fs'),path=require('path'),http=require('http'),zlib=require('zlib'),assert=require('assert');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.resolve(process.env.QA_OUT_DIR||path.join(root,'..','qa-output'));
fs.mkdirSync(out,{recursive:true});
const projects=JSON.parse(fs.readFileSync(path.join(root,'content/projects.json'),'utf8'));
const report={date:'2026-10-08',environment:{url:'http://127.0.0.1:4173/',browser:null,headless:true,physical_device:false},checks:[],responsive:[],accessibility:[],consoleErrors:[],performance:[]};
const server=http.createServer((req,res)=>{
  let f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)&&f!==root){res.statusCode=403;return res.end();}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.statusCode=404;f=path.join(root,'404.html');}
  const type=({'html':'text/html;charset=utf-8','css':'text/css','js':'text/javascript','svg':'image/svg+xml'})[f.split('.').pop()]||'text/plain';
  res.setHeader('Content-Type',type);const body=fs.readFileSync(f);
  if(/gzip/.test(req.headers['accept-encoding']||'')){res.setHeader('Content-Encoding','gzip');res.end(zlib.gzipSync(body));}else res.end(body);
});
const check=async(name,fn)=>{try{const detail=await fn();report.checks.push({name,status:'PASS',detail});console.log('PASS',name);}catch(error){report.checks.push({name,status:'FAIL',detail:error.message});console.log('FAIL',name,error.message)}};
const layout=async page=>page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,offenders:[...document.querySelectorAll('body *')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&getComputedStyle(x).position!=='fixed'&&!x.closest('[hidden]')}).map(x=>({tag:x.tagName,class:x.className,right:Math.round(x.getBoundingClientRect().right),left:Math.round(x.getBoundingClientRect().left)})).slice(0,12)}));
async function main(){
 await new Promise(resolve=>server.listen(4173,resolve));
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote','--disable-gpu']});
 report.environment.browser=await browser.version();
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.on('pageerror',error=>report.consoleErrors.push(error.message));
 await check('Responsive home and all six direct case routes',async()=>{
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:width<768?844:1000});
   for(const route of ['/',...projects.map(p=>`/work/${p.id}/`)]){
    const response=await page.goto('http://127.0.0.1:4173'+route);assert.equal(response.status(),200);
    await page.evaluate(()=>document.fonts.ready);const result=await layout(page);report.responsive.push({route,...result});
   }
  }
  const failures=report.responsive.filter(x=>x.overflow);assert.equal(failures.length,0,JSON.stringify(failures));return{renders:report.responsive.length};
 });
 await check('Short landscape and effective 200% zoom layout',async()=>{
  for(const viewport of [{width:844,height:390},{width:720,height:500},{width:320,height:568}]){
   await page.setViewportSize(viewport);await page.goto('http://127.0.0.1:4173/');assert.equal((await layout(page)).overflow,false,JSON.stringify(viewport));
  }
  return '720px layout represents 1440px desktop at 200% effective CSS viewport; real browser chrome zoom not exercised.';
 });
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4173/');
 await check('Rapid selection, hidden focus exclusion, local list controls',async()=>{
  await page.evaluate(()=>{const buttons=[...document.querySelectorAll('.work-choice')];for(let i=0;i<24;i++)buttons[i%6].click();});
  assert.equal(await page.locator('.work-panel:visible').count(),1);assert.equal(await page.locator('[aria-pressed=true]').getAttribute('data-project'),'website-builder');
  assert.equal(await page.locator('.work-panel:visible').getAttribute('data-id'),'website-builder');
  await page.locator('[data-step="1"]').click();assert.equal(await page.locator('.work-panel:visible').getAttribute('data-id'),'hey');
  const hiddenLinks=await page.evaluate(()=>[...document.querySelectorAll('.work-panel[hidden] a')].filter(a=>a.getClientRects().length).length);assert.equal(hiddenLinks,0);return{rapidClicks:24,visiblePanels:1,hiddenFocusableRects:0};
 });
 await check('Keyboard selector and focus-visible',async()=>{
  await page.locator('.work-choice').first().focus();await page.keyboard.press('End');assert.equal(await page.locator('.work-choice:focus').getAttribute('data-project'),'website-builder');
  await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');assert.equal(await page.locator('.work-panel:visible').getAttribute('data-id'),'scale-governor');
  const outline=await page.locator('.work-choice:focus').evaluate(x=>getComputedStyle(x).outlineStyle);assert.notEqual(outline,'none');return 'End / Home / ArrowDown update preview and preserve focus; outline visible.';
 });
 await check('Preview to detail, refresh, Back and Forward',async()=>{
  await page.locator('[data-project="hey"]').click();await page.locator('#preview-hey .project-art').click();await page.waitForURL('**/work/hey/');assert.equal(await page.locator('h1').innerText(),'Hey by Ars');
  await page.reload();assert.equal(await page.locator('h1').innerText(),'Hey by Ars');await page.goBack();
  if(page.url().includes('/work/'))await page.goBack();
  assert.equal(await page.locator('.work-panel:visible').getAttribute('data-id'),'hey');await page.goForward();assert(page.url().includes('/work/hey/'));return 'Native route / reload / history work; selected preview restored.';
 });
 await check('No-JavaScript identity, six works, detail and contact',async()=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await context.newPage();await p.goto('http://127.0.0.1:4173/');
  assert.equal(await p.locator('.work-panel:visible').count(),6);assert((await p.locator('h1').innerText()).includes('Dari ide'));
  assert.equal(await p.locator('.work-navigation:visible').count(),0);await p.locator('#preview-motion .project-title a').click();assert(p.url().includes('/work/motion/'));assert.equal(await p.locator('h1').innerText(),'Motion');assert(await p.locator('#kontak a').getAttribute('href'));await context.close();return 'All core content and direct links remain static.';
 });
 await check('Motion runtime reduction, resize interruption and reverse scrolling',async()=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:4173/');
  await page.locator('[data-project="motion"]').click();await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(80);
  assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
  assert.equal(await page.locator('.work-panel:visible').getAttribute('data-id'),'motion');
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.evaluate(()=>scrollTo(0,0));assert.equal((await layout(page)).overflow,false);return 'Reduced motion cancels active animation and preserves selected state; resize and reverse scroll preserve content.';
 });
 await check('Blocked image/font resources retain content and navigation',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844}});const p=await context.newPage();await p.route('**/core.svg',route=>route.abort());await p.route('**/fonts.css',route=>route.abort());await p.goto('http://127.0.0.1:4173/');
  assert((await p.locator('h1').innerText()).includes('Dari ide'));await p.locator('[data-project="hey"]').click();await p.locator('#preview-hey .project-title a').click();assert(p.url().includes('/work/hey/'));assert.equal((await layout(p)).overflow,false);await context.close();return 'System font fallback, dimensions and native links survive media errors.';
 });
 await check('404 route and contact destinations',async()=>{
  const response=await page.goto('http://127.0.0.1:4173/not-a-route');assert.equal(response.status(),404);assert((await page.locator('h1').innerText()).includes('Belum ada'));
  await page.locator('.not-found .text-link').click();assert.equal(page.url(),'http://127.0.0.1:4173/');assert.equal(await page.locator('#kontak .contact-link').getAttribute('href'),'https://www.instagram.com/arsafiqri_ua/');return 'Custom 404 returns to home; real owner Instagram destination.';
 });
 await check('Axe WCAG 2.2 AA automated sample',async()=>{
  if(!process.env.QA_AXE)throw new Error('QA_AXE path required');
  for(const route of ['/',...projects.map(p=>`/work/${p.id}/`),'/404.html']){
   await page.goto('http://127.0.0.1:4173'+route);await page.addScriptTag({path:process.env.QA_AXE});
   const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
   report.accessibility.push({route,violations:result.violations.map(x=>({id:x.id,impact:x.impact,description:x.description,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(x=>({id:x.id,nodes:x.nodes.length}))});
  }
  const failures=report.accessibility.filter(x=>x.violations.length);assert.equal(failures.length,0,JSON.stringify(failures));return 'Eight pages checked; automated sample is not full conformance or screen-reader testing.';
 });
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [390,1440]){await page.setViewportSize({width,height:width===390?844:1000});await page.goto('http://127.0.0.1:4173/');await page.screenshot({path:path.join(out,`home-${width}.png`),fullPage:true});}
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4173/');await page.screenshot({path:path.join(out,'hero.png')});
 for(const project of projects){await page.goto(`http://127.0.0.1:4173/work/${project.id}/`);await page.screenshot({path:path.join(out,`case-${project.id}.png`),fullPage:true});}
 await check('Visibility handler and browser freeze/resume lifecycle',async()=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:4173/');
  const result=await page.evaluate(()=>{
   const previous=Object.getOwnPropertyDescriptor(document,'hidden');
   Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
   document.dispatchEvent(new Event('visibilitychange'));
   const hiddenAnimations=document.getAnimations().filter(a=>a.playState==='running').length;
   if(previous)Object.defineProperty(document,'hidden',previous);else delete document.hidden;
   document.dispatchEvent(new Event('visibilitychange'));
   return {hiddenAnimations,semanticPanels:[...document.querySelectorAll('.work-panel')].filter(x=>!x.hidden).length};
  });
  assert.equal(result.hiddenAnimations,0);assert.equal(result.semanticPanels,1);
  const cdp=await page.context().newCDPSession(page);await cdp.send('Page.setWebLifecycleState',{state:'frozen'});await page.waitForTimeout(100);await cdp.send('Page.setWebLifecycleState',{state:'active'});
  await page.locator('[data-project="hey"]').click();assert.equal(await page.locator('.work-panel:visible').getAttribute('data-id'),'hey');
  return {result,scope:'Visibility handler input is a labelled synthetic document-hidden state in real Chromium. Freeze/resume is actual CDP browser lifecycle. Headless shell keeps actual visibilityState visible; physical background/OEM behavior was not tested.'};
 });
 await check('No uncaught client exceptions',async()=>{assert.equal(report.consoleErrors.length,0,report.consoleErrors.join('\n'));return report.consoleErrors;});
 await browser.close();server.close();
 report.summary={pass:report.checks.filter(x=>x.status==='PASS').length,fail:report.checks.filter(x=>x.status==='FAIL').length};
 fs.writeFileSync(path.join(root,'docs/browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log('SUMMARY',report.summary);
 if(report.summary.fail)process.exitCode=1;
}
main().catch(error=>{console.error(error);server.close();process.exit(1);});
