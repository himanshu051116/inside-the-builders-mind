import { mkdirSync, cpSync, copyFileSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { minifyCSS } from './minify-css.mjs'
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const out = join(root, 'dist')
// Legacy CSS is now maintained in smaller source-owner files. Compile it in the
// original cascade order so old components remain behaviorally stable.
const cssModules = ["01-base.css", "02-workbench.css", "03-atelier.css", "04-experience.css", "05-career.css", "06-interactions.css", "07-scenes.css", "08-case-index.css", "09-evidence-desk.css", "10-screen-gallery.css", "11-image-reader.css"]
const modernLayers=['v14.css','v14-polish.css','v14-4.css','v14-5.css','v14-8.css','v15-editorial.css','v16-screenwalk.css','v17-recruiter.css','v19-milestone-video.css','v19-hero-refinement.css','v20-workspace.css','v203-experience.css']
// One production stylesheet: all source modules remain readable and editable.
// Preserve the exact cascade that V14.4 tested; never ship redundant CSS requests.
const combinedCss=[
 ...cssModules.map(name=>readFileSync(join(root,'styles',name),'utf8')),
 ...modernLayers.map(name=>readFileSync(join(root,name),'utf8'))
].join('\n')
if (existsSync(out)) rmSync(out, { recursive:true, force:true })
mkdirSync(out, { recursive:true })
writeFileSync(join(out,'portfolio.css'),combinedCss)
for (const name of ['index.html','experience-v6.js','career-modes.js','v8-interactions.js','scene-v9.js','v10-experience.js','v11-experience.js','evidence-media.js','v16-screenwalk.js','v17-recruiter.js','v19-milestone-video.js','v20-workspace.js','v203-experience.js','case-dossiers.js','site.js','content.js','workbench-data.js','workbench-logic.js','workbench-ui.js']) copyFileSync(join(root, name), join(out,name))
// Keep readable source CSS in the repository, but ship compressed bytes to browsers.
const stylesheets=['portfolio.css']
for (const cssName of stylesheets) {
  const contents=readFileSync(join(out,cssName),'utf8')
  writeFileSync(join(out,cssName),minifyCSS(contents))
}
cpSync(join(root,'public'),out,{recursive:true})
console.log('Built static site to dist/ with zero dependencies.')
