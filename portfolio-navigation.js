/**
 * Portfolio navigation V20.5
 * A single owner for role and project-case URL state.
 * No persistence, analytics, network access, or changes to existing portfolio content.
 */
const ROLES = new Set(['fullstack', 'software', 'ml']);
const CASES = new Set(['ohs', 'news', 'mulyankan', 'earthbridge']);
const CASE_HASH = /^#case-(ohs|news|mulyankan|earthbridge)$/;
const instances = new WeakMap();

export function readPortfolioLocation(href) {
  const url = new URL(href, 'https://portfolio.local/');
  const requestedRole = url.searchParams.get('view');
  const match = CASE_HASH.exec(url.hash);
  return Object.freeze({
    role: ROLES.has(requestedRole) ? requestedRole : 'fullstack',
    caseId: match ? match[1] : null,
    hash: url.hash
  });
}

function sameState(a, b) {
  return a.role === b.role && a.caseId === b.caseId && a.hash === b.hash;
}

export function createPortfolioNavigation(win) {
  if (!win?.location?.href || !win?.history) throw new TypeError('A browser window is required');
  let state = readPortfolioLocation(win.location.href);
  const subscribers = new Set();
  let disposed = false;
  // When pushState is denied, keep the chosen résumé role through ordinary
  // native fragment navigation. A real Back/Forward navigation resets it.
  let localRoleOverride = null;

  function publish(next, source) {
    if (disposed || sameState(next, state)) return;
    state = next;
    for (const subscriber of [...subscribers]) subscriber(state, source);
  }
  function notify(source) {
    publish(readPortfolioLocation(win.location.href), source);
  }
  const handlePopState = () => {
    localRoleOverride = null;
    notify('browser');
  };
  const handleHashChange = () => {
    const next = readPortfolioLocation(win.location.href);
    publish(localRoleOverride === null ? next : Object.freeze({ ...next, role: localRoleOverride }), 'browser');
  };
  win.addEventListener('popstate', handlePopState);
  win.addEventListener('hashchange', handleHashChange);

  function commit(url, source, replace = false) {
    if (disposed) return false;
    const intended = readPortfolioLocation(url.href);
    if (url.href === win.location.href) {
      // A user explicitly returned to the URL's actual role/case, which also
      // cancels any stale override left by a previously blocked history write.
      localRoleOverride = null;
      publish(intended, `${source}-local`);
      return false;
    }
    try {
      const previous = win.history.state;
      const extra = previous && typeof previous === 'object' && !Array.isArray(previous) ? previous : {};
      win.history[replace ? 'replaceState' : 'pushState']({ ...extra, portfolioNavigation: true }, '', url.href);
    } catch {
      // Preserve only a role that differs from the actual URL. A case-tab
      // selection alone should not suppress later native fragment changes.
      const actual = readPortfolioLocation(win.location.href);
      localRoleOverride = intended.role !== actual.role ? intended.role : null;
      publish(intended, `${source}-local`);
      return false;
    }
    if (win.location.href !== url.href) {
      const actual = readPortfolioLocation(win.location.href);
      localRoleOverride = intended.role !== actual.role ? intended.role : null;
      publish(intended, `${source}-local`);
      return false;
    }
    localRoleOverride = null;
    notify(source);
    return true;
  }
  return {
    current: () => state,
    isUrlSynced: () => sameState(state, readPortfolioLocation(win.location.href)),
    subscribe(listener) {
      if (disposed) throw new Error('Portfolio navigation has been disposed');
      if (typeof listener !== 'function') throw new TypeError('Listener must be a function');
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    },
    selectRole(role, { replace = false } = {}) {
      if (!ROLES.has(role)) return false;
      const url = new URL(win.location.href);
      url.searchParams.set('view', role);
      // An old screenshot or selected case must not silently override the new role.
      if (url.hash.startsWith('#proof/') || /^#case-/.test(url.hash)) url.hash = '';
      return commit(url, 'role', replace);
    },
    selectCase(caseId, { replace = false } = {}) {
      if (!CASES.has(caseId)) return false;
      const url = new URL(win.location.href);
      // If history is blocked, retain the locally selected résumé role.
      if (readPortfolioLocation(url.href).role !== state.role) url.searchParams.set('view', state.role);
      url.hash = `case-${caseId}`;
      return commit(url, 'case', replace);
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      subscribers.clear();
      win.removeEventListener('popstate', handlePopState);
      win.removeEventListener('hashchange', handleHashChange);
      if (instances.get(win) === this) instances.delete(win);
    }
  };
}

export function getPortfolioNavigation(win = window) {
  if (!instances.has(win)) instances.set(win, createPortfolioNavigation(win));
  return instances.get(win);
}

/**
 * Native fragment navigation emits no hashchange if the URL already contains
 * the requested hash. Reopen a previously collapsed case in that situation.
 * It neither prevents normal link behavior nor adds any history entries.
 * Return a disposer so the listener can be removed if the page is re-mounted.
 */
export function installCaseLinkRecovery(doc, win, revealCase) {
  if (!doc?.addEventListener || !doc?.removeEventListener || !win?.location || typeof revealCase !== 'function') {
    throw new TypeError('A document, window and reveal callback are required');
  }
  const handleClick = event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target?.closest?.('a[href]');
    const href = anchor?.getAttribute?.('href');
    if (!href || !CASE_HASH.test(href) || href !== win.location.hash) return;
    revealCase(href.slice('#case-'.length));
  };
  doc.addEventListener('click', handleClick);
  return () => doc.removeEventListener('click', handleClick);
}
