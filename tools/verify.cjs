const {chromium}=require('playwright');
const fs=require('fs'); const os=require('os');
const http=require('http'),path=require('path'); const root=path.resolve(__dirname,'..'); const out=fs.mkdtempSync(path.join(os.tmpdir(),'ars-portfolio-qa-')); 
(async()=>{
const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(req.url.split('?')[0])==='/'?'index.html':decodeURIComponent(req.url.split('?')[0]));try{res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(fs.readFileSync(file))}catch{res.writeHead(404);res.end('Not found')}});
await new Promise(r=>server.listen(8765,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:process.env.PORTFOLIO_CHROMIUM || chromium.executablePath(),args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['small',320,700],['tablet',820,1180]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765',{waitUntil:'networkidle'});
 await page.screenshot({path:path.join(out,`${name}.png`),fullPage:true});
 const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,nav:[...document.querySelectorAll('.chapter-link')].map(x=>({text:x.textContent,rect:x.getBoundingClientRect().toJSON()}))}));
 results.push({name,dimensions,errors});
 if(dimensions.scroll>width)throw Error(`${name} overflow: ${dimensions.scroll}`);
 await page.getByRole('link',{name:/Jelajahi karya/}).click();
 await page.getByRole('link',{name:'Lihat proyek Hey by Ars'}).click();
 await page.waitForURL('**/work/hey.html'); await page.waitForLoadState('networkidle'); await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:path.join(out,`${name}-case.png`),fullPage:true});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`${name} case overflow`);
 await page.getByRole('link',{name:'Kembali ke karya'}).click();
 await page.waitForURL('**/index.html#project-hey');
 await page.getByRole('link',{name:'Mari ngobrol'}).click();
 const contact=await page.locator('#kontak').boundingBox();
 if(contact.y>height)throw Error('Contact anchor failed');
 await page.close();
}
const page=await browser.newPage({viewport:{width:1440,height:1000}});

await page.goto('http://127.0.0.1:8765');
await page.waitForTimeout(1100);
await page.screenshot({path:path.join(out,'hero.png')});
await page.locator('.chapter-link[href="#karya"]').click();
await page.locator('.chapter-link[href="#proses"]').click({force:true});
await page.emulateMedia({reducedMotion:'reduce'});
await page.waitForTimeout(200);
if(await page.locator('.waiting').count())throw Error('Reduced motion leaves hidden content');
await page.goto('http://127.0.0.1:8765/work/plugin.html');
await page.keyboard.press('Tab');await page.keyboard.press('Tab');
results.push({keyboardFocus:await page.evaluate(()=>document.activeElement.textContent)});
await page.close();
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
const p=await nojs.newPage();
await p.goto('http://127.0.0.1:8765');await p.getByRole('link',{name:'Lihat proyek Plugin Builder'}).click();await p.waitForURL('**/work/plugin.html');
results.push({noJavaScript:'Project navigation works'});
fs.writeFileSync(path.join(out,'qa-results.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(x=>({name:x.name,overflow:x.dimensions?.scroll,errors:x.errors,noJavaScript:x.noJavaScript,keyboardFocus:x.keyboardFocus})),null,2));
await browser.close();
server.close();
})().catch(e=>{console.error(e);process.exit(1)});
