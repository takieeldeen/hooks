export interface APIListResponse<T> {
  content: T[];
  results: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isEmpty: boolean;
  canReset: boolean;
  page: number;
  status: "success" | "fail" | "error";
}

export interface APIDetailsResponse<T> {
  content: T;
  status: "success" | "fail" | "error";
}
