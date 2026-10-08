/* Rasterize the authored geometry for delivery; keep the code and original SVG as source. */
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
async function main(){
 const source=path.join(root,'assets/core-source.svg');
 if(!fs.existsSync(source))fs.copyFileSync(path.join(root,'assets/core.svg'),source);
 const svg=fs.readFileSync(source,'utf8');
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM,args:['--no-sandbox','--no-zygote','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage();
 const url=await page.evaluate(async svg=>{
  const image=new Image();const objectUrl=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));image.src=objectUrl;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=1140;canvas.height=1080;
  canvas.getContext('2d').drawImage(image,0,0,1140,1080);URL.revokeObjectURL(objectUrl);return canvas.toDataURL('image/webp',.9);
 },svg);
 fs.writeFileSync(path.join(root,'assets/core.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 720" width="760" height="720"><image width="760" height="720" href="${url}"/></svg>\n`);
 await browser.close();console.log('Geometry preserved; optimized delivery SVG bytes:',fs.statSync(path.join(root,'assets/core.svg')).size);
}
main().catch(e=>{console.error(e);process.exit(1)});
