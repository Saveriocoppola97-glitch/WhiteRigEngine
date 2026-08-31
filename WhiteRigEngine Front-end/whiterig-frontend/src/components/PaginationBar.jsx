const PaginationBar = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 my-4 ">
      <button
        className="btn btn-outline-dark btn-sm px-3 fw-semibold"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="bi bi-chevron-left me-1"></i> Precedente
      </button>

      <span className="text-dark font-monospace small fw-bold">
        Pagina <strong className="text-dark">{currentPage + 1}</strong> di{" "}
        <strong className="text-muted">{totalPages}</strong>
      </span>

      <button
        className="btn btn-outline-dark btn-sm px-3 fw-semibold"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Successivo <i className="bi bi-chevron-right ms-1"></i>
      </button>
    </div>
  );
};

export default PaginationBar;
