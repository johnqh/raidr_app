/**
 * Every internal URL of the catalog, in one place. Pages pass these to
 * `LocalizedLink`, which adds the language prefix.
 *
 *   /domains                      site browser
 *   /api?domain={apiHost}         API inspector (endpoint list + flow map)
 *   /endpoint?endpoint={ref}      endpoint playground (`METHOD https://host/path`)
 *   /mcps, /mcps?domain={apiHost} MCP browser / inspector
 *   /skills, /skills?skill={slug} skill browser / inspector
 */
export const links = {
  domains: () => '/domains',
  api: (apiHost: string) => `/api?domain=${encodeURIComponent(apiHost)}`,
  endpoint: (ref: string) => `/endpoint?endpoint=${encodeURIComponent(ref)}`,
  mcps: () => '/mcps',
  mcp: (apiHost: string) => `/mcps?domain=${encodeURIComponent(apiHost)}`,
  skills: () => '/skills',
  skill: (slug: string) => `/skills?skill=${encodeURIComponent(slug)}`,
};

/**
 * The skill slug raidr-crawler gives an API host (`studio-api.suno.com` →
 * `studio-api-suno-com`). Used to redirect old `/skills/:apiHost` URLs.
 */
export function skillSlugFor(apiHost: string): string {
  return apiHost
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .replace(/^-|-$/g, '');
}
