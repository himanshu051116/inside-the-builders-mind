import test from 'node:test'
import assert from 'node:assert/strict'
import {TOY_EMBEDDINGS,TOY_LIBRARY,TRACE_STEPS,cosineSimilarity,rankToyNeighbors} from '../v8-interactions.js'

test('synthetic vectors are explicitly defined and three-dimensional',()=>{
 assert.equal(Object.keys(TOY_EMBEDDINGS).length,3)
 for(const v of Object.values(TOY_EMBEDDINGS)) assert.equal(v.length,3)
 for(const v of TOY_LIBRARY)assert.equal(v.v.length,3)
})
test('cosine score is bounded, self similarity is one and zero-vector score is zero',()=>{
 const a=[.8,.1,.5]
 assert.ok(Math.abs(cosineSimilarity(a,a,80)-1)<1e-12)
 assert.equal(cosineSimilarity([0,0,0],a,50),0)
 for(const w of [0,20,50,100]){
   assert.ok(cosineSimilarity(a,[.2,.5,.1],w)>=-1)
   assert.ok(cosineSimilarity(a,[.2,.5,.1],w)<=1)
 }
})
test('invalid vector inputs are rejected',()=>{
 assert.throws(()=>cosineSimilarity([1,2],[1,2]))
})
test('toy search sorts by descending numeric score and returns unique IDs',()=>{
 for(const query of Object.keys(TOY_EMBEDDINGS)){
  const rows=rankToyNeighbors(query)
  assert.equal(rows.length,5)
  assert.equal(new Set(rows.map(x=>x.id)).size,5)
  assert.ok(rows.every((x,i)=>i===0||rows[i-1].score>=x.score))
 }
})
test('changing weighting changes scores',()=>{
 const a=rankToyNeighbors('optical',0)
 const b=rankToyNeighbors('optical',100)
 assert.notDeepEqual(a.map(x=>x.score),b.map(x=>x.score))
})
test('unknown query is not assigned fabricated results',()=>{
 assert.deepEqual(rankToyNeighbors('wrong'),[])
})
test('pipeline contains the four interactive stages and explains provenance',()=>{
 assert.deepEqual(Object.keys(TRACE_STEPS),['discover','normalize','dedup','store'])
 assert.match(TRACE_STEPS.store.description,/source references/i)
})
