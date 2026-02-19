export const generatePaginationObject = (
  count: number,
  currentPage: number,
  pageSize: number,
  search: string,
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
    canReset: currentPage !== 1 || search !== "",
  };
};
