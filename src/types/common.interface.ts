export interface PaginationMetaParams<T> {
  page?: number;
  limit?: number;
  data: T[];
  total: number;
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
