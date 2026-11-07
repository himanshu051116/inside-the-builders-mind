// Validate links in CURRENT project documentation (not archived historical copies).
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname, sep } from 'node:path'
import assert from 'node:assert/strict'

const root=resolve(import.meta.dirname,'..')
const docs=[
  'README.md','CHANGELOG.md','CONTRIBUTING.md',
  'docs/architecture/README.md','docs/testing/README.md',
  'docs/deployment/README.md','docs/history/README.md',
  'docs/LICENSING.md','.github/SECURITY.md',
  'AWS_DEPLOYMENT.md'
]
let checked=0
for(const doc of docs){
  const src=resolve(root,doc)
  assert(existsSync(src),`Missing required documentation: ${doc}`)
  const text=readFileSync(src,'utf8')
  for(const [,raw] of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
    const href=raw.trim().split(/\s+"[^"]*"$/)[0]
    if(/^(https?:|mailto:|#|data:)/i.test(href))continue
    const path=decodeURIComponent(href.split('#')[0].split('?')[0])
    if(!path)continue
    const target=resolve(dirname(src),path)
    assert(target.startsWith(root+sep),`Link leaves repository: ${doc} → ${href}`)
    assert(existsSync(target),`Broken local documentation link: ${doc} → ${href}`)
    checked++
  }
}
const intro=readFileSync(resolve(root,'README.md'),'utf8')
assert(!intro.startsWith('> **Current local checkpoint: V14'), 'README begins with obsolete release status')
assert(intro.includes('docs/history/README.md'),'README must preserve access to the history archive')
console.log(`Documentation audit passed: ${docs.length} current files and ${checked} internal links.`)
