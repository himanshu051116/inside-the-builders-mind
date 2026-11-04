import test from 'node:test'
import assert from 'node:assert/strict'
import { recruiterFacts, recruiterIntroMarkup } from '../v17-recruiter.js'

const profile={name:'Himanshu Shukla',github:'https://github.com/himanshu051116',linkedin:'https://www.linkedin.com/in/himanshu-shukla-88175637a',email:'himanshusubh1510@gmail.com'}
const html=recruiterIntroMarkup(profile)

test('recruiter identity comes before specialization navigation',()=>{
 assert.match(html,/<section class="v17Recruiter" id="home"/)
 assert.match(html,/<h1 id="v17Name">Himanshu Shukla/)
 assert.match(html,/B\.Tech · Mathematics &amp; Computing/)
 assert.match(html,/Madhav Institute of Technology &amp; Science/)
 assert.match(html,/Expected graduation 2028/)
 assert.match(html,/href="#top"/)
})

test('recruiter-specific proof is concrete and avoids invented employment',()=>{
 assert.equal(recruiterFacts.spotlight.date,'11 July 2026')
 assert.match(html,/CMPDI Headquarters, Ranchi/)
 assert.match(html,/Document review/)
 assert.match(html,/href="#case-mulyankan"/)
 for(const bad of ['10+ internships','99% accuracy','Production ML model','Google employee']) assert.ok(!html.includes(bad))
})

test('leadership and awards are visible without expanding',()=>{
 for(const phrase of ['Class Representative','Hindi Samiti','Content Head &amp; Treasurer','SchoolBuddies','Neeti Summit','Tark Yudh','Model United Nations','VBYLD 2026']) {
  assert.ok(html.includes(phrase),phrase)
 }
 assert.match(html,/<details class="v17ResumeSelect"/)
 assert.doesNotMatch(html,/<details class="v17Essential"/)
})

test('professional links and role-specific résumé are accessible',()=>{
 assert.match(html,/resumes\/Himanshu_Shukla_software_Public\.pdf/)
 assert.match(html,/linkedin\.com/)
 assert.match(html,/github\.com/)
 assert.match(html,/mailto:himanshusubh1510@gmail\.com/)
 assert.match(html,/aria-label="Professional profile links"/)
})

test('user-controlled external URLs and names are escaped and validated',()=>{
 const unsafe=recruiterIntroMarkup({name:'<img onerror=alert(1)>',github:'javascript:alert(1)',linkedin:'https://linkedin.com/" onclick="x',email:'test@foo.com" onclick="x'})
 assert.ok(!unsafe.includes('<img onerror'))
 assert.ok(!unsafe.includes('href="javascript:'))
 assert.ok(!unsafe.includes('onclick="x'))
 assert.match(unsafe,/&lt;img onerror/)
})
