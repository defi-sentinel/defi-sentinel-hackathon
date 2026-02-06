/**
 * Protocol Logo Helper
 * Returns local optimized WebP logo path if available, otherwise falls back to external URL
 */

// List of protocols with local logos
const LOCAL_LOGOS = new Set([
  'aave',
  'allbridge',
  'babylon',
  'eigenlayer',
  'ethena',
  'jupiter',
  'lido',
  'morpho',
  'pendle',
  'sky',
  'spark',
  'uniswap',
  'usdai',
]);

/**
 * Get protocol logo URL - prefers local optimized WebP over external
 * @param protocol - Protocol object with slug and logo properties
 * @returns Logo path (local or external URL)
 */
export function getProtocolLogo(protocol: { slug: string; logo?: string }): string {
  // Check if we have a local logo for this protocol
  if (LOCAL_LOGOS.has(protocol.slug.toLowerCase())) {
    return `/protocols/${protocol.slug.toLowerCase()}.webp`;
  }

  // Fallback to external logo or emoji
  return protocol.logo || '🔷';
}

/**
 * Check if protocol has local logo available
 */
export function hasLocalLogo(slug: string): boolean {
  return LOCAL_LOGOS.has(slug.toLowerCase());
}

/**
 * Get all protocols with local logos
 */
export function getLocalLogoSlugs(): string[] {
  return Array.from(LOCAL_LOGOS);
}
