import { mkdirSync, cpSync, copyFileSync, rmSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const out = join(root, 'dist')
if (existsSync(out)) rmSync(out, { recursive:true, force:true })
mkdirSync(out, { recursive:true })
for (const name of ['index.html','portfolio.css','experience-v6.js','career-modes.js','v8-interactions.js','scene-v9.js','v10-experience.js','v11-experience.js','evidence-media.js','site.js','content.js','workbench-data.js','workbench-logic.js','workbench-ui.js']) copyFileSync(join(root, name), join(out,name))
cpSync(join(root,'public'),out,{recursive:true})
console.log('Built static site to dist/ with zero dependencies.')
