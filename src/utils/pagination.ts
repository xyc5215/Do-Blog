// Pagination calculation

import type { Pagination } from '../env';

export function calcPagination(total: number, page: number, pageSize: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  return { page: safePage, pageSize, total, totalPages };
}

export function getOffset(page: number, pageSize: number): number {
  return (Math.max(1, page) - 1) * pageSize;
}
