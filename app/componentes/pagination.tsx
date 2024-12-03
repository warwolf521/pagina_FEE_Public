import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const goToNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goToPage = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="pagination-controls d-flex justify-content-center mt-4">
      <button onClick={goToPreviousPage} disabled={currentPage === 1} className="pagination-button prev">←</button>
      
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => goToPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button onClick={goToNextPage} disabled={currentPage === totalPages} className="pagination-button next">→</button>
    </div>
  );
}
