// URL slug generation with CJK support

export function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    // Replace spaces with hyphens
    .replace(/[\s_]+/g, '-')
    // Keep alphanumeric, CJK, and hyphens
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf-]/g, '')
    // Collapse multiple hyphens
    .replace(/-{2,}/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // If empty after processing, generate a random slug
    || `post-${Date.now().toString(36)}`;
}

export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) return slug;
  let counter = 2;
  while (existingSlugs.includes(`${slug}-${counter}`)) {
    counter++;
  }
  return `${slug}-${counter}`;
}
