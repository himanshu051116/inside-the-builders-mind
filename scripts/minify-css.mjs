/**
 * Conservative, dependency-free CSS release minifier.
 * The source modules remain unminified. Only remove comments and whitespace next
 * to punctuation where CSS tokenization does not depend on spacing. Preserve
 * quoted strings, escapes, calc arithmetic, selectors and custom properties.
 */
export function minifyCSS(source) {
  let out = ''
  let i = 0
  let quote = ''
  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]
    if (quote) {
      out += char
      if (char === '\\' && i + 1 < source.length) {
        out += source[++i]
      } else if (char === quote) {
        quote = ''
      }
      i++
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      out += char
      i++
      continue
    }
    if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      if (end < 0) throw new Error('Unclosed CSS comment')
      const comment = source.slice(i, end + 2)
      // Preserve explicit licensing comments when present.
      if (comment.startsWith('/*!')) out += comment
      i = end + 2
      continue
    }
    if (/\s/.test(char)) {
      let j = i + 1
      while (j < source.length && /\s/.test(source[j])) j++
      const prev = out[out.length - 1] || ''
      const following = source[j] || ''
      const safeToOmit = !out || !following || /[{};,]/.test(prev) || /[{};,]/.test(following)
      if (!safeToOmit) out += ' '
      i = j
      continue
    }
    out += char
    i++
  }
  return out.trim()
}
