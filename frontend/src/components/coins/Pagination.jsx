import React, { useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

/**
 * Build visible page number array with ellipsis markers
 */
function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);

  if (current > 4)         pages.push('...');

  const start = Math.max(2, current - 2);
  const end   = Math.min(total - 1, current + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  if (current < total - 3) pages.push('...');

  pages.push(total);
  return pages;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * Pagination component
 *
 * Props:
 *   page          — current page (1-based)
 *   totalPages    — total number of pages
 *   totalItems    — total record count (for "Showing X-Y of Z")
 *   limit         — current page size
 *   onPageChange  — (page: number) => void
 *   onLimitChange — (limit: number) => void
 */
function Pagination({ page, totalPages, totalItems = 0, limit = 10, onPageChange, onLimitChange }) {
  const pages = useMemo(() => buildPageRange(page, totalPages), [page, totalPages]);

  const startRecord = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord   = Math.min(page * limit, totalItems);

  if (totalPages <= 0) return null;

  return (
    <div className="coins-pagination-wrap">

      {/* ── Showing X–Y of Z ── */}
      <div className="pagination-info">
        {totalItems > 0
          ? <>Showing <strong>{startRecord}–{endRecord}</strong> of <strong>{totalItems.toLocaleString()}</strong> records</>
          : 'No records'
        }
      </div>

      {/* ── Navigation controls ── */}
      <nav className="coins-pagination" role="navigation" aria-label="Pagination">

        {/* First */}
        <button
          id="page-first"
          className="page-btn"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          title="First page"
        >
          <FiChevronsLeft />
        </button>

        {/* Prev */}
        <button
          id="page-prev"
          className="page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          title="Previous page"
        >
          <FiChevronLeft />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              id={`page-${p}`}
              className={`page-btn${p === page ? ' active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          id="page-next"
          className="page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          title="Next page"
        >
          <FiChevronRight />
        </button>

        {/* Last */}
        <button
          id="page-last"
          className="page-btn"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          title="Last page"
        >
          <FiChevronsRight />
        </button>
      </nav>

      {/* ── Per-page selector ── */}
      {onLimitChange && (
        <div className="pagination-limit">
          <label className="filter-label" htmlFor="pagination-per-page">Per page</label>
          <select
            id="pagination-per-page"
            className="filter-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            style={{ width: 75 }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default Pagination;
