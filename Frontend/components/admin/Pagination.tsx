'use client';

import { Pagination as PaginationData } from '@/types/admin';

type PaginationProps = {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  onPageChange,
  pagination,
}: PaginationProps) {
  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
      <div className="text-muted">
        Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems}{' '}
        items)
      </div>
      <div className="btn-group">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(pagination.page - 1)}
          type="button"
        >
          Previous
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(pagination.page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
