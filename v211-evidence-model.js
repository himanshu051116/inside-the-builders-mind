/**
 * V21.1 evidence paths. This intentionally draws on published portfolio records,
 * not inferred implementation or claimed verification of a screenshot.
 */
import {projects} from './content.js';
import {V20_FLOWS} from './v20-workspace.js';
import {V204_STAGE_CAPTURES} from './v204-evidence.js';
import {V205_ANNOTATIONS} from './v205-annotations.js';
import {caseDossiers} from './case-dossiers.js';

const dossierId={"our-hidden-universe":"ohs",newssources:"news"};
const slug=name=>String(name||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const validCapture=id=>typeof id==='string'&&/^[a-z0-9-]{1,80}$/.test(id);
// Only reuse screenshot annotations in the project they actually document.
// Unknown IDs must not pick up a valid annotation from another project.
const capturePrefixes=Object.freeze({
  'our-hidden-universe':'ohs-',
  'newssources':'news-',
  'mulyankan':'mulyankan-',
  'earthbridge':'earthbridge-',
  'schoolbuddies':'schoolbuddies-'
});
export const captureBelongsToProject=(projectId,captureId)=>
  validCapture(captureId)&&typeof projectId==='string'&&
  typeof capturePrefixes[projectId]==='string'&&captureId.startsWith(capturePrefixes[projectId]);
const isGitHub=url=>typeof url==='string'&&/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\/[^\s<>]*)?$/.test(url);
export const listProjectIds=()=>projects.map(p=>slug(p.title));
export const getPoints=id=>validCapture(id)?(V205_ANNOTATIONS[id]?.points||[]):[];

export function getEvidenceTrail(projectId,captureId=null,featureIndex=null){
  const project=projects.find(p=>slug(p.title)===projectId);
  if(!project)return null;
  const dossier=caseDossiers[dossierId[projectId]||projectId]||null;
  const stages=V20_FLOWS[projectId]||[];
  const scopedCapture=captureBelongsToProject(projectId,captureId)?captureId:null;
  const points=getPoints(scopedCapture);
  const index=Number.isInteger(featureIndex)&&featureIndex>=0&&featureIndex<points.length?featureIndex:null;
  const feature=index===null?null:points[index];
  const context=(V204_STAGE_CAPTURES[projectId]||[]);
  const mappedStage=scopedCapture?context.findIndex(x=>x?.id===scopedCapture):-1;
  const candidate=Number.isInteger(feature?.stage)?feature.stage:mappedStage;
  const stageIndex=Number.isInteger(candidate)&&candidate>=0&&candidate<stages.length?candidate:null;
  const stage=stageIndex===null?null:{index:stageIndex,title:stages[stageIndex][0],description:stages[stageIndex][1]};
  const associated=context[stageIndex??-1];
  // A screenshot is context for a stage, not proof that its subsystem executed.
  const contextNote=associated?.id===scopedCapture?associated.context:null;
  const sourceRecords=dossier?.evidence?.filter(([label,url])=>label&&isGitHub(url)).map(([label,url])=>({label,url,category:/test|unit|integration|evaluation script|diagnostic/i.test(label)?'Test or evaluation source':'Design or implementation source'})) || [];
  const genericSources=project.links.filter(link=>isGitHub(link.url)).map(link=>({label:link.label,url:link.url,category:'Project repository reference'}));
  return {
    project:project.title,projectId,captureId:scopedCapture,
    featureIndex:index,feature:feature?{title:feature.title,detail:feature.detail}:null,
    annotatedCount:points.length,stage,contextNote,
    sourceRecords:sourceRecords.length?sourceRecords:genericSources,
    verification:project.caseStudy.verification,
    limitations:project.caseStudy.caveat,
    reproducible:dossier?.reproducible||null,
    expected:dossier?.expected||null,
    // Distinction for accessibility and communication; never promise a live test.
    status:project.status
  };
}

/** Whitelisted query restoration. Only IDs from this page's real gallery are accepted. */
export function readEvidenceSelection(href,knownIds,initialId=knownIds?.[0]||null){
  const url=new URL(href,'https://portfolio.invalid/');
  const ids=new Set(Array.isArray(knownIds)?knownIds.filter(validCapture):[]);
  const value=url.searchParams.get('capture');
  const captureId=ids.has(value)?value:ids.has(initialId)?initialId:[...ids][0]||null;
  const raw=url.searchParams.get('feature');
  const featureIndex=raw!==null&&/^(0|[1-9][0-9]?)$/.test(raw)&&Number(raw)<getPoints(captureId).length?Number(raw):null;
  return {captureId,featureIndex};
}

/** Keep unrelated query arguments, and do not write duplicate history entries. */
export function evidenceLink(href,captureId,featureIndex=null){
  const url=new URL(href,'https://portfolio.invalid/');
  if(validCapture(captureId))url.searchParams.set('capture',captureId);
  else url.searchParams.delete('capture');
  if(Number.isInteger(featureIndex)&&featureIndex>=0&&featureIndex<getPoints(captureId).length)
    url.searchParams.set('feature',String(featureIndex));
  else url.searchParams.delete('feature');
  url.hash='#captures';
  return url.pathname+url.search+url.hash;
}
