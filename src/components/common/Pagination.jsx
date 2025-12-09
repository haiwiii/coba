import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/button';

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  itemsPerPageOptions = [10,20,30,40,50,60,70,80,90,100],
  onPageChange,
  onItemsPerPageChange,
  dark = false,
}) => {

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      const startPage = Math.max(2, currentPage - 1);
      const endPage   = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }
    
    return pages;
  };

  const containerClass = dark
    ? 'px-4 py-3 bg-gray-900 border-t border-gray-800 text-gray-300'
    : 'px-4 py-3 bg-gray-50 border-t border-gray-200';

  const labelClass = dark ? 'text-sm text-gray-300' : 'text-sm text-gray-600';
  const selectClass = dark
    ? 'px-3 py-1.5 bg-gray-800 text-white border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600'
    : 'px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between flex-wrap gap-4">

        {/* Items per page */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className={labelClass}>Show:</label>

            <select
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              className={selectClass}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page button list */}
        <div className="flex items-center space-x-2">

          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            icon={<ChevronLeft className="w-4 h-4" />}
            title="Previous Page"
          />

          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className={dark ? 'px-3 py-1 text-gray-400' : 'px-3 py-1 text-gray-500'}>...</span>
            ) : (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
              >
                {page}
              </Button>
            )
          )}

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            icon={<ChevronRight className="w-4 h-4" />}
            title="Next Page"
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;