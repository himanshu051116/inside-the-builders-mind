import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const code=readFileSync(new URL('../v208-home.js',import.meta.url),'utf8').replace(/^import [^\n]+\n/,'');
function run(href,linkPaths=[]){
  let redirected=null,videos=0;
  const links=linkPaths.map(path=>({href:path,getAttribute(){return this.href},setAttribute(name,value){if(name==='href')this.href=value}}));
  const doc={querySelectorAll(){return links}};
  const win={location:{href,replace(to){redirected=to}}};
  runInNewContext(code,{window:win,document:doc,URL,setupMilestoneVideo(){videos++;links.push({href:'#case-mulyankan',getAttribute(){return this.href},setAttribute(name,value){if(name==='href')this.href=value}})}});
  return {redirected,videos,links};
}
test('role+project+panel+old hash survive migration to Work',()=>{
  const r=run('https://portfolio.test/?utm_source=chatgpt.com&view=ml&project=earthbridge&panel=evidence#case-files');
  assert.equal(r.redirected,'/work/?utm_source=chatgpt.com&view=ml&project=earthbridge&panel=evidence#case-files');
  assert.equal(r.videos,0);
});
test('legacy case links migrate to Work without losing hash',()=>{
  const r=run('https://portfolio.test/#case-ohs');
  assert.equal(r.redirected,'/work/#case-ohs');
});
test('local-only lab hashes route to the standalone Lab',()=>{
  const r=run('https://portfolio.test/#interactive-lab');
  assert.equal(r.redirected,'/lab/');
});
test('homepage converts old internal links, including the dynamically added video-dialog link',()=>{
  const r=run('https://portfolio.test/', ['#v20-workspace','#case-ohs','#case-news']);
  assert.equal(r.redirected,null);
  assert.equal(r.videos,1);
  assert.deepEqual(r.links.map(x=>x.href),['/work/','/projects/our-hidden-universe/','/projects/newssources/','/projects/mulyankan/']);
});
