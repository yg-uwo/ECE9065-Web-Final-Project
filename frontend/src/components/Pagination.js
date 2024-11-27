import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="d-flex justify-content-center mt-3">
      {pages.map((page) => (
        <button
          key={page}
          className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-secondary"} mx-1`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
