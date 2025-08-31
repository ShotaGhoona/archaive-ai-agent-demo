import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPageSelector = false,
  maxVisiblePages = 5,
  className = '',
}: TablePaginationProps) {
  // ページ番号の範囲を計算
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 最後のページ付近で調整
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* 総項目数表示 */}
      <div className='text-muted-foreground text-sm whitespace-nowrap'>
        {totalItems}件中 {startItem}-{endItem}件を表示
      </div>

      {/* ページネーション */}
      <Pagination>
        <PaginationContent>
          {/* 前のページ */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {/* ページ番号 */}
          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className='cursor-pointer'
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 次のページ */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* ページ当たり項目数セレクター */}
      {showItemsPerPageSelector && onItemsPerPageChange && (
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-sm whitespace-nowrap'>
            表示件数:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value, 10))}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
