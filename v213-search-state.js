/**
 * V21.3: pure search/selection state for the Work explorer.
 * A typed query is transient: it previews one visible result without modifying
 * the explicitly selected project or the shareable URL. An explicit click,
 * Enter, or tab interaction can commit that preview through the existing router.
 */
export function filterV213Projects(projects, query, order = []) {
  const q = String(query ?? '').trim().toLocaleLowerCase();
  const ranks = new Map(order.map((id, index) => [id, index]));
  const matches = (Array.isArray(projects) ? projects : []).filter(project => {
    if (!q) return true;
    const values = [project.title, project.description, project.category,
      project.status, ...(Array.isArray(project.stack) ? project.stack : [])];
    return values.some(value => String(value ?? '').toLocaleLowerCase().includes(q));
  });
  // Stable sorting preserves the original project order for equal or unranked records.
  return matches.sort((a, b) => (ranks.get(a.id) ?? 99) - (ranks.get(b.id) ?? 99));
}

export function selectV213VisibleProject(matches, selectedId) {
  const shown = Array.isArray(matches) ? matches : [];
  if (shown.some(project => project.id === selectedId)) return selectedId;
  return shown[0]?.id ?? null;
}
