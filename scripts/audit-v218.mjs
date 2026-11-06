import {readFileSync,existsSync,statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const dist=resolve(root,'dist');
const max={cssGzip:70*1024,criticalJsGzip:32*1024,largestJsGzip:18*1024};
const metrics={};
const gzip=path=>gzipSync(readFileSync(resolve(dist,path)),{level:9}).length;
if(!existsSync(resolve(dist,'index.html')))throw new Error('V21.8 expects a completed npm run build');
metrics.cssGzip=gzip('portfolio.css');
const critical=['v208-work.js','v20-workspace.js','v214-work-feature.js','v217-media-viewer.js','content.js'];
const entry=Object.fromEntries(critical.map(name=>[name,gzip(name)]));
metrics.entryGzip=entry;metrics.criticalJsGzip=Object.values(entry).reduce((a,b)=>a+b,0);
metrics.largestJsGzip=Math.max(...Object.values(entry));
const routes=['index.html','work/index.html','lab/index.html','projects/mulyankan/index.html','projects/earthbridge/index.html','projects/newssources/index.html','projects/our-hidden-universe/index.html','projects/schoolbuddies/index.html','evidence/index.html','legacy/index.html'];
for(const route of routes)if(!existsSync(resolve(dist,route)))throw new Error('Expected route missing: '+route);
const immutable=['video/mulyankan-system-walkthrough-presenter.mp4','video/mulyankan-docx-workflow-presenter.mp4',
 'resumes/Himanshu_Shukla_fullstack_Public.pdf','resumes/Himanshu_Shukla_software_Public.pdf','resumes/Himanshu_Shukla_ml_Public.pdf'];
for(const file of immutable)if(!existsSync(resolve(dist,file))||statSync(resolve(dist,file)).size<=4096)throw new Error('Missing/empty original asset: '+file);
console.log('V21.8 built-site static budget (gzip estimates only; not measured transfer size/LCP):');
console.log(JSON.stringify(metrics,null,2));
const problems=[];
for(const name of ['cssGzip','criticalJsGzip','largestJsGzip'])if(metrics[name]>max[name])problems.push(name+' '+metrics[name]+' exceeds '+max[name]);
if(problems.length)throw Error(problems.join('; '));
console.log('V21.8 PASS: static budgets, 11 routes, 5 original media/resume assets.');
