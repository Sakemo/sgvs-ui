// src/components/common/Pagination.tsx
import React from 'react';
import { LuChevronLeft, LuChevronRight, LuFlipHorizontal } from 'react-icons/lu';
import Button from './ui/Button';
import { usePagination, DOTS } from '../../hooks/usePagination';

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const paginationRange = usePagination({ currentPage, totalPages });

  if (currentPage < 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  const lastPage = paginationRange ? paginationRange[paginationRange.length - 1] : 0;

  return (
    <nav className="flex items-center justify-center gap-1">
      <Button variant="ghost" size="icon" onClick={onPrevious} disabled={currentPage === 0}>
        <LuChevronLeft className="h-4 w-4" />
      </Button>
      {paginationRange?.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return <span key={`dots-${index}`} className="flex h-10 w-10 items-center justify-center"><LuFlipHorizontal /></span>;
        }

        return (
          <Button
            key={pageNumber}
            variant={currentPage + 1 === pageNumber ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => onPageChange(Number(pageNumber) - 1)}
          >
            {pageNumber}
          </Button>
        );
      })}
      <Button variant="ghost" size="icon" onClick={onNext} disabled={currentPage + 1 === lastPage}>
        <LuChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export default Pagination;