export interface APIListResponse<T> {
  content: T[];
  results: number;
  status: "success" | "fail" | "error";
}

export interface APIDetailsResponse<T> {
  content: T;
  status: "success" | "fail" | "error";
}
