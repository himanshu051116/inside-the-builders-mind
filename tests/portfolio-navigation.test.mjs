import test from 'node:test';
import assert from 'node:assert/strict';
import { createPortfolioNavigation, getPortfolioNavigation, readPortfolioLocation, installCaseLinkRecovery } from '../portfolio-navigation.js';

function browser(initial = 'https://portfolio.example/?view=fullstack') {
  const listeners = new Map();
  const win = {
    location: { href: initial },
    history: {
      state: { otherFeature: 'preserved' },
      calls: [],
      pushState(state, unused, href) { this.state = state; this.calls.push('push'); win.location.href = href; },
      replaceState(state, unused, href) { this.state = state; this.calls.push('replace'); win.location.href = href; }
    },
    addEventListener(event, listener) { if (!listeners.has(event)) listeners.set(event, new Set()); listeners.get(event).add(listener); },
    removeEventListener(event, listener) { listeners.get(event)?.delete(listener); },
    dispatch(event) { for (const listener of listeners.get(event) || []) listener(); },
    listenerCount(event) { return listeners.get(event)?.size || 0; }
  };
  return win;
}

test('unrecognized role falls back to full-stack and invalid hashes are ignored', () => {
  assert.deepEqual(readPortfolioLocation('https://a.test/?view=hacker#case-wrong'), {role:'fullstack',caseId:null,hash:'#case-wrong'});
});

test('direct project-case links are readable', () => {
  assert.deepEqual(readPortfolioLocation('https://a.test/?view=ml#case-earthbridge'), {role:'ml',caseId:'earthbridge',hash:'#case-earthbridge'});
});

test('role changes use one history entry, preserve query parameters and ordinary anchors', () => {
  const win = browser('https://a.test/?ref=recruiter&view=fullstack#work');
  const nav = createPortfolioNavigation(win);
  assert.equal(nav.selectRole('ml'), true);
  assert.equal(win.location.href, 'https://a.test/?ref=recruiter&view=ml#work');
  assert.equal(win.history.calls.length, 1);
  assert.equal(win.history.state.otherFeature, 'preserved');
  assert.equal(nav.selectRole('ml'), false);
  nav.destroy();
});

test('changing role clears stale proof and case hashes but does not rewrite project content', () => {
  for (const hash of ['#proof/ohs-home', '#case-news']) {
    const win=browser('https://a.test/?view=fullstack'+hash);
    const nav=createPortfolioNavigation(win);
    assert.equal(nav.selectRole('software'),true);
    assert.equal(new URL(win.location.href).hash, '');
    nav.destroy();
  }
});

test('case tab updates are navigable and reported once', () => {
  const win=browser(); const nav=createPortfolioNavigation(win);
  const events=[];nav.subscribe((state,source)=>events.push([state.caseId,source]));
  assert.equal(nav.selectCase('mulyankan'),true);
  assert.equal(nav.selectCase('mulyankan'),false);
  assert.deepEqual(events,[['mulyankan','case']]);
  assert.equal(win.location.href.endsWith('#case-mulyankan'),true);
  nav.destroy();
});

test('popstate and hashchange duplicate notifications are coalesced', () => {
  const win=browser();const nav=createPortfolioNavigation(win);
  const events=[];nav.subscribe((state,source)=>events.push([state.role,state.caseId,source]));
  win.location.href='https://portfolio.example/?view=software#case-news';
  win.dispatch('popstate');win.dispatch('hashchange');
  assert.deepEqual(events,[['software','news','browser']]);
  nav.destroy();
});

test('invalid roles/cases are no-ops and cannot mutate URL', () => {
  const win=browser();const nav=createPortfolioNavigation(win);
  assert.equal(nav.selectRole('admin'),false);
  assert.equal(nav.selectCase('made-up'),false);
  assert.equal(win.history.calls.length,0);
  nav.destroy();
});

test('replaceState works without a redundant push', () => {
  const win=browser();const nav=createPortfolioNavigation(win);
  assert.equal(nav.selectRole('software',{replace:true}),true);
  assert.deepEqual(win.history.calls,['replace']);
  nav.destroy();
});

test('destroy removes listeners and unsubscribes, singleton can be rebuilt', () => {
  const win=browser();const nav=getPortfolioNavigation(win);
  assert.strictEqual(getPortfolioNavigation(win),nav);
  let eventCount=0;nav.subscribe(()=>eventCount++);
  nav.destroy();
  assert.equal(win.listenerCount('popstate'),0);
  assert.equal(win.listenerCount('hashchange'),0);
  assert.equal(nav.selectRole('ml'),false);
  assert.notStrictEqual(getPortfolioNavigation(win),nav);
  assert.equal(eventCount,0);
  getPortfolioNavigation(win).destroy();
});


test('blocked URL history leaves the local role and corresponding case selected', () => {
  const win = browser('https://a.test/?view=fullstack');
  win.history.pushState = () => { throw new Error('history disabled'); };
  const nav = createPortfolioNavigation(win);
  const events=[];
  nav.subscribe((route, source)=>events.push([route.role, route.caseId, source]));
  assert.equal(nav.selectRole('software'), false);
  assert.equal(nav.current().role, 'software');
  assert.equal(nav.isUrlSynced(), false);
  assert.equal(nav.selectCase('news'), false);
  assert.equal(nav.current().caseId, 'news');
  assert.equal(win.location.href, 'https://a.test/?view=fullstack');
  assert.deepEqual(events, [['software',null,'role-local'],['software','news','case-local']]);
  // A later browser navigation has authoritative state, regardless of the old local fallback.
  win.location.href='https://a.test/?view=ml#case-earthbridge';
  win.dispatch('popstate');
  assert.equal(nav.isUrlSynced(), true);
  assert.equal(nav.current().role,'ml');
  nav.destroy();
});

test('switching back to the URL-selected role after a blocked history update works', () => {
  const win=browser('https://a.test/?view=fullstack');
  win.history.pushState=()=>{throw new Error('blocked')};
  const nav=createPortfolioNavigation(win);
  nav.selectRole('software');
  assert.equal(nav.current().role,'software');
  assert.equal(nav.selectRole('fullstack'),false);
  assert.equal(nav.current().role,'fullstack');
  assert.equal(nav.isUrlSynced(),true);
  nav.destroy();
});

test('noop history mutation is never reported as an updated URL', () => {
  const win=browser();
  win.history.pushState=()=>{};
  const nav=createPortfolioNavigation(win);
  assert.equal(nav.selectRole('ml'),false);
  assert.equal(nav.current().role,'ml');
  assert.equal(nav.isUrlSynced(),false);
  nav.destroy();
});

test('browser Back/Forward restores a locally selected case after successful writes', () => {
  const win=browser('https://a.test/?view=fullstack');
  const nav=createPortfolioNavigation(win);
  nav.selectRole('ml');
  nav.selectCase('earthbridge');
  assert.equal(nav.current().caseId,'earthbridge');
  win.location.href='https://a.test/?view=ml';win.dispatch('popstate');
  assert.equal(nav.current().caseId,null);
  win.location.href='https://a.test/?view=ml#case-earthbridge';win.dispatch('popstate');
  assert.equal(nav.current().caseId,'earthbridge');
  nav.destroy();
});

test('local fallback state is not treated as a shareable URL', () => {
  const win=browser('https://a.test/?view=fullstack#work');
  const nav=createPortfolioNavigation(win);
  win.history.pushState=()=>{throw new Error('blocked')};
  nav.selectRole('ml');
  assert.equal(nav.isUrlSynced(),false);
  assert.equal(win.location.href.endsWith('#work'),true);
  nav.destroy();
});

function caseClickFixture(hash='#case-news') {
  const handlers=new Map();
  const doc={
    addEventListener(type,fn){handlers.set(type,fn)},
    removeEventListener(type,fn){if(handlers.get(type)===fn)handlers.delete(type)},
    click(href, options={}) {
      const anchor={getAttribute:()=>href};
      const event={button:0,defaultPrevented:false,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false,
        target:{closest:()=>anchor},...options};
      handlers.get('click')?.(event);
    },
    count:()=>handlers.size
  };
  return {doc, win:{location:{hash}}};
}

test('a repeated same-hash case link reopens a collapsed note once',()=>{
  const {doc,win}=caseClickFixture();
  const opened=[];
  const dispose=installCaseLinkRecovery(doc,win,id=>opened.push(id));
  doc.click('#case-news');
  doc.click('#case-news');
  assert.deepEqual(opened,['news','news']);
  dispose();
  assert.equal(doc.count(),0);
  doc.click('#case-news');
  assert.deepEqual(opened,['news','news']);
});

test('different hashes and modifier clicks preserve native browser navigation',()=>{
  const {doc,win}=caseClickFixture('#case-news');
  let count=0;
  installCaseLinkRecovery(doc,win,()=>count++);
  for(const href of ['#case-ohs','#case-unknown','https://example.com/#case-news','#work'])doc.click(href);
  for(const option of [{ctrlKey:true},{shiftKey:true},{metaKey:true},{altKey:true},{button:1},{defaultPrevented:true}])doc.click('#case-news',option);
  assert.equal(count,0);
});

test('case-link recovery validates inputs instead of installing a broken listener',()=>{
  assert.throws(()=>installCaseLinkRecovery({}, {location:{hash:''}},()=>{}),TypeError);
  assert.throws(()=>installCaseLinkRecovery({addEventListener(){},removeEventListener(){}}, {location:{}},null),TypeError);
});


test('native section hashchange preserves locally selected résumé role when history writes are blocked',()=>{
  const win=browser('https://portfolio.example/?view=fullstack');
  const nav=createPortfolioNavigation(win);
  win.history.pushState=()=>{throw new Error('History disabled')};
  assert.equal(nav.selectRole('ml'),false);
  assert.equal(nav.current().role,'ml');
  win.location.href='https://portfolio.example/?view=fullstack#about';
  win.dispatch('hashchange');
  assert.equal(nav.current().role,'ml');
  assert.equal(nav.current().hash,'#about');
  assert.equal(nav.current().caseId,null);
  assert.equal(nav.isUrlSynced(),false);
  // A native link into a real case also retains the user's chosen role.
  win.location.href='https://portfolio.example/?view=fullstack#case-news';
  win.dispatch('hashchange');
  assert.equal(nav.current().role,'ml');
  assert.equal(nav.current().caseId,'news');
  nav.destroy();
});

test('a genuine browser Back navigation overrides stale local-only role selection',()=>{
  const win=browser('https://portfolio.example/?view=software');
  const nav=createPortfolioNavigation(win);
  win.history.pushState=()=>{throw new Error('History denied')};
  nav.selectRole('ml');
  win.location.href='https://portfolio.example/?view=software#contact';
  win.dispatch('hashchange');
  assert.equal(nav.current().role,'ml');
  win.location.href='https://portfolio.example/?view=software#home';
  win.dispatch('popstate');
  assert.equal(nav.current().role,'software');
  assert.equal(nav.current().hash,'#home');
  assert.equal(nav.isUrlSynced(),true);
  nav.destroy();
});

test('successful history writes clear local role override for later native anchors',()=>{
  const win=browser('https://portfolio.example/?view=fullstack');
  const nav=createPortfolioNavigation(win);
  const push=win.history.pushState;
  win.history.pushState=()=>{throw new Error('History disabled')};
  nav.selectRole('ml');
  win.history.pushState=push;
  assert.equal(nav.selectRole('software'),true);
  win.location.href='https://portfolio.example/?view=software#work';
  win.dispatch('hashchange');
  assert.equal(nav.current().role,'software');
  assert.equal(nav.isUrlSynced(),true);
  nav.destroy();
});


test('choosing the role already in the URL clears stale local override',()=>{
  const win=browser('https://portfolio.example/?view=fullstack');
  const nav=createPortfolioNavigation(win);
  win.history.pushState=()=>{throw new Error('denied')};
  nav.selectRole('ml');
  assert.equal(nav.current().role,'ml');
  assert.equal(nav.selectRole('fullstack'),false); // No URL edit needed.
  assert.equal(nav.current().role,'fullstack');
  win.location.href='https://portfolio.example/?view=fullstack#about';
  win.dispatch('hashchange');
  assert.equal(nav.current().role,'fullstack');
  assert.equal(nav.isUrlSynced(),true);
  nav.destroy();
});
