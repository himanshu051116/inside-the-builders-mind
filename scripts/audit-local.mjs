import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { profile, projects } from '../content.js'

const root = resolve(import.meta.dirname, '..')
let warnings = 0
const fail = message => { console.error(`FAIL: ${message}`); process.exitCode = 1 }
const warn = message => { console.warn(`WARN: ${message}`); warnings++ }

for (const file of ['index.html','portfolio.css','v14.css','experience-v6.js','v10-experience.js','v11-experience.js','site.js','workbench-ui.js','workbench-data.js','workbench-logic.js','amplify.yml','public/favicon.svg','public/robots.txt']) {
  if (!existsSync(resolve(root,file))) fail(`Missing required asset: ${file}`)
}
for (const entry of projects) {
  if (!entry.title || !entry.status || !entry.description || !entry.caseStudy) fail(`Project incomplete: ${entry.number}`)
  for (const link of entry.links) {
    try {
      const u = new URL(link.url)
      if (u.protocol !== 'https:') fail(`Non-HTTPS project link in ${entry.title}: ${link.url}`)
    } catch { fail(`Malformed link in ${entry.title}: ${link.url}`) }
  }
}
if (projects.length !== 5) warn(`Expected five featured project cards; found ${projects.length}`)
if (projects.some(project=>project.title==='Sentinel')) warn('The removed security project is still present')
if (!profile.portfolioRepo) warn('Set profile.portfolioRepo once the NEW portfolio source repository is published.')
if (!profile.github || !profile.linkedin) fail('Missing personal public profile links.')
if (/password|api[_-]?key|private[_-]?key|secret\s*[:=]/i.test(readFileSync(resolve(root,'content.js'),'utf-8'))) warn('Review content.js for accidental secret-like text.')
console.log(`Local content/asset audit complete (${warnings} reminder(s)). Outbound URLs were not network-checked.`)
