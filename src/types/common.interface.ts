export interface PaginationParams<T> {
  page?: number;
  limit?: number;
  data: T[];
}

export interface PaginationMetadata<T> {
  metadata: {
    total: number;
    per_page: number;
    page: number;
    page_count: number;
  };
  data: T[];
}
