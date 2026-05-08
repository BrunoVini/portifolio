/**
 * Prefix a public-asset path with the configured `base` (e.g. "/portifolio").
 * Accepts inputs with or without a leading slash and avoids double slashes.
 *
 * Use this anywhere you render a path that resolves to something in `public/`
 * — Astro's dev router rejects paths that omit the base.
 */
export const assetUrl = (path: string, base: string): string => {
  const trimmedBase = base.replace(/\/+$/, '');
  const trimmedPath = path.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}`;
};
