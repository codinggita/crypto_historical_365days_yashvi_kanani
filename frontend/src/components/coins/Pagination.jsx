import React, { useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

/**
 * Build visible page numbers array with ellipsis markers
 */
function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  // Always show first
  pages.push(1);

  if (current > 4) pages.push('...');

  const start = Math.max(2, current - 2);
  const end   = Math.min(total - 1, current + 2);

  for (let p = start; p <= end; p++) pages.push(p);

  if (current < total - 3) pages.push('...');

  // Always show last
  pages.push(total);

  return pages;
}

function Pagination({ page, totalPages, onPageChange }) {
  const pages = useMemo(() => buildPageRange(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="coins-pagination" role="navigation" aria-label="Pagination">
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
    </div>
  );
}

export default Pagination;
