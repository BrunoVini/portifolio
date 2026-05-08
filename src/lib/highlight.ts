/**
 * Splits a paragraph into plain-text and highlighted-term fragments so they
 * can be rendered with a wrapping <mark> element for animated highlighter.
 *
 * Matches are case-insensitive and ordered by descending length (so
 * "high-performance" wins over "performance"). Non-overlapping.
 */
export type Fragment = { kind: 'text' | 'mark'; value: string };

export const splitOnTerms = (text: string, terms: readonly string[]): Fragment[] => {
  if (!terms.length) return [{ kind: 'text', value: text }];
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');
  const out: Fragment[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index === undefined) continue;
    if (m.index > last) out.push({ kind: 'text', value: text.slice(last, m.index) });
    out.push({ kind: 'mark', value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
  return out.length ? out : [{ kind: 'text', value: text }];
};
