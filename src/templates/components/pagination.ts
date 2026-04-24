// Pagination component
import type { Pagination } from '../../env';

export function renderPagination(pagination: Pagination, baseUrl: string): string {
  if (pagination.totalPages <= 1) return '';

  const items: string[] = [];
  const { page, totalPages } = pagination;

  // Build URL helper
  const pageUrl = (p: number) => {
    const sep = baseUrl.includes('?') ? '&' : '?';
    return p === 1 ? baseUrl : `${baseUrl}${sep}page=${p}`;
  };

  // Previous button
  items.push(page > 1
    ? `<a href="${pageUrl(page - 1)}" class="page-btn page-arrow" aria-label="Previous">&larr;</a>`
    : `<span class="page-btn page-arrow disabled" aria-hidden="true">&larr;</span>`);

  // Page numbers with ellipsis
  const range = getPageRange(page, totalPages);
  for (const p of range) {
    if (p === -1) {
      items.push(`<span class="page-btn disabled">&hellip;</span>`);
    } else {
      items.push(p === page
        ? `<span class="page-btn active" aria-current="page">${p}</span>`
        : `<a href="${pageUrl(p)}" class="page-btn">${p}</a>`);
    }
  }

  // Next button
  items.push(page < totalPages
    ? `<a href="${pageUrl(page + 1)}" class="page-btn page-arrow next" aria-label="Next">&rarr;</a>`
    : `<span class="page-btn page-arrow next disabled" aria-hidden="true">&rarr;</span>`);

  return `<nav class="pagination" aria-label="Page navigation">${items.join('\n')}</nav>`;
}

function getPageRange(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: number[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push(-1); // ellipsis
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push(-1); // ellipsis
  pages.push(total);

  return pages;
}
