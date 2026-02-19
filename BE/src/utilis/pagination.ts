export const generatePaginationObject = (
  count: number,
  currentPage: number,
  pageSize: number,
) => {
  const totalPages = Math.ceil(count / pageSize);
  const hasNextPage = currentPage < pageSize;
  const hasPrevPage = currentPage > 1;
  const isEmpty = count === 0;

  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
    isEmpty,
    page: currentPage,
  };
};
