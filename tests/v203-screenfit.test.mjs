import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8')
const css = read('v203-screenfit.css')
const build = read('scripts/build.mjs')
const recruiter = read('v17-recruiter.js')
const player = read('v19-milestone-video.js')

test('screen fit applies only on shorter desktop viewports', () => {
  assert.match(css, /@media \(min-width: 951px\) and \(max-height: 900px\)/)
  assert.match(css, /@media \(min-width: 951px\) and \(max-height: 740px\)/)
  assert.doesNotMatch(css, /display\s*:\s*none|visibility\s*:\s*hidden|overflow\s*:\s*hidden|transform\s*:\s*scale|zoom\s*:/i)
})

test('the visible hero keeps every core surface', () => {
  for (const selector of ['.v17TopLine','.v17LeadGrid','.v17LeadCopy','.v17ProofHeader','.v19MilestoneOpen','.v17Essential','.v17Socials']) assert.ok(css.includes(selector),selector)
  for (const token of ['v17Essentials','v208SelectedProjects','v17Proof','v17ResumeSelect','/resumes/Himanshu_Shukla_ml_Public.pdf']) assert.ok(recruiter.includes(token),token)
})

test('video poster framing, original clips and separate player are unchanged', () => {
  for (const filename of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4']) assert.ok(player.includes(filename))
  assert.match(read('v19-milestone-video.css'), /object-fit:contain/)
  assert.match(css, /height: clamp\(160px, 14vw, 194px\)/)
})

test('the screen fit layer follows V20.3 in the production CSS cascade', () => {
  assert.match(build, /'v203-experience\.css','v203-screenfit\.css'/)
  assert.match(build, /'v19-milestone-video\.css','v19-hero-refinement\.css'/)
  assert.match(build, /'v20-workspace\.css'/)
})
