import { useState, useCallback } from 'react';

/**
 * usePagination Hook
 * @param {Object} options
 * @param {number} options.initialPage
 * @param {number} options.initialLimit
 * @returns {Object} pagination state and controls
 */
export function usePagination({ initialPage = 1, initialLimit = 20 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const nextPage = useCallback(() => {
    setPage((prev) => (totalPages && prev >= totalPages ? prev : prev + 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => (prev <= 1 ? 1 : prev - 1));
  }, []);

  const goToPage = useCallback((targetPage) => {
    const pageNum = Math.max(1, targetPage);
    setPage(totalPages ? Math.min(pageNum, totalPages) : pageNum);
  }, [totalPages]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 on limit change
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
  };
}

export default usePagination;
