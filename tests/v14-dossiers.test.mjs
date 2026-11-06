import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { caseDossiers } from '../case-dossiers.js'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')

test('Four canonical case dossiers have technical constraints, trade-offs, reproduction and cautious statuses',()=>{
 assert.deepEqual(Object.keys(caseDossiers).sort(),['earthbridge','mulyankan','news','ohs'])
 for(const [key,d] of Object.entries(caseDossiers)){
  for(const part of ['problem','decision','tradeoff','reproducible','expected','state'])assert.ok(d[part]?.length>65, `${key}.${part} too sparse`)
  assert.ok(d.evidence.length>=3, key)
  for(const [label,url] of d.evidence){assert.ok(label.length>10);assert.ok(url.startsWith('https://github.com/himanshu051116/'))}
 }
})
test('NewsSources names real stale lease-writer regression and its database precondition',()=>{
 const n=caseDossiers.news
 assert.match(n.reproducible,/test_expired_candidate_is_reclaimed_and_old_writer_is_rejected/)
 assert.match(n.reproducible,/NEWSINTEL_TEST_DATABASE_URL/)
 assert.match(n.expected,/stale writer/)
 assert.match(n.state,/not a hosted live backend/)
})
test('EarthBridge case describes documented submission results without unqualified accuracy claims',()=>{
 const d=caseDossiers.earthbridge
 assert.match(d.expected,/cross-modal F1@5 = 19\.53%/)
 assert.match(d.expected,/not rerun or externally verified/)
 assert.doesNotMatch(Object.values(d).filter(x=>typeof x==='string').join(' '), /90% retrieval accuracy/)
})
test('Mulyankan case separates advisory scoring from final decision',()=>{
 const d=caseDossiers.mulyankan
 assert.match(d.decision,/allow abstention/)
 assert.match(d.expected,/human reviewer/)
})
test('Case dossier UI is embedded inside detailed canonical note and evidence desk is secondary',()=>{
 const site=read('site.js'),css=read('v14.css'),build=read('scripts/build.mjs')
 assert.match(site,/caseDossierMarkup\(c.id\)/)
 assert.match(site,/class="dossier"/)
 assert.match(site,/class="atlasDrawer"/)
 assert.match(css,/\.dossierGrid/)
 assert.match(build,/case-dossiers\.js/)
})
test('Externally inspectable file references include key regression suites',()=>{
 assert.ok(caseDossiers.ohs.evidence.some(x=>/chatService/.test(x[1])))
 assert.ok(caseDossiers.news.evidence.some(x=>/test_article_repository_postgres/.test(x[1])))
 assert.ok(caseDossiers.mulyankan.evidence.some(x=>/EVALUATION_SYSTEM/.test(x[1])))
 assert.ok(caseDossiers.earthbridge.evidence.some(x=>/test_descriptor_eval/.test(x[1])))
})
