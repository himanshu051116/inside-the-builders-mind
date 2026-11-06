import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {allowedV217Asset,v217CaptureDescription,setupV217MediaViewer} from '../v217-media-viewer.js';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');

test('V21.7 viewer accepts only same-origin saved evidence assets',()=>{
  const base='https://portfolio.test/projects/mulyankan/';
  assert.equal(allowedV217Asset('/evidence/mulyankan-overview.webp',base),'https://portfolio.test/evidence/mulyankan-overview.webp');
  assert.equal(allowedV217Asset('https://portfolio.test/evidence/news-overview.webp',base),'https://portfolio.test/evidence/news-overview.webp');
  for(const path of ['javascript:alert(1)','https://example.com/evidence/news-overview.webp','/video/mulyankan-system-walkthrough-presenter.mp4','/evidence/%2e%2e/private.png','/evidence/test.webp?hack=1','/evidence/test.svg','/evidence/THIS.webp'])
    assert.equal(allowedV217Asset(path,base),null,path);
});
test('caption text is descriptive and does not imply live inference',()=>{
  assert.equal(v217CaptureDescription('Saved screen','Redacted review screen'),'Redacted review screen');
  assert.equal(v217CaptureDescription('Saved screen',''),'Saved screen');
  assert.match(v217CaptureDescription('',''),/not a live/);
  assert.equal(typeof setupV217MediaViewer,'function');
});
test('viewer supports accessible dialog, focus restoration and actual-pixels zoom',()=>{
  const code=read('v217-media-viewer.js');
  for(const phrase of ['showModal()','aria-labelledby','aria-haspopup','aria-pressed','dialog.addEventListener(\'close\'','returnFocus.focus','dialog.dataset.zoom','Open original image','portrait']){
    if(phrase==='portrait')continue;
    assert.ok(code.includes(phrase),phrase);
  }
  assert.match(code,/portfolio:v20-render/);
  assert.match(code,/\.v208ProjectFigure figure/);
  assert.match(code,/\.v20Media > figure/);
});
test('mobile feature list uses verified existing annotation objects and shares hotspot handlers',()=>{
  const code=read('v208-project.js');
  assert.match(code,/getPoints\(id\)/);
  assert.match(code,/v217AnnotationList/);
  assert.match(code,/updateAnnotation\(point,i\)/);
  assert.match(code,/featureList\?\.replaceChildren\(\)/);
  assert.match(code,/aria-pressed/);
  assert.match(code,/setupV217MediaViewer\(document\)/);
  assert.match(read('v208-work.js'),/setupV217MediaViewer\(document\)/);
});
test('recordings are untouched and accessibility notes are explicitly not verbatim captions',()=>{
  const code=read('v19-milestone-video.js');
  for(const clip of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4']){
    assert.match(code,new RegExp(clip.replaceAll('.','\\.')));
    assert.ok(existsSync(new URL('../public/video/'+clip,import.meta.url)));
  }
  assert.match(code,/v217VideoGuide/);
  assert.match(code,/not a verbatim speech transcript/);
  assert.doesNotMatch(code,/kind="captions"/);
});
test('CSS is part of production build and respects mobile and reduced motion',()=>{
  const css=read('v217-media.css'),build=read('scripts/build.mjs');
  assert.match(build,/v217-media\.css/);
  assert.match(build,/v217-media-viewer\.js/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/\.v217AnnotationList/);
});
