export interface ApiResponseDTO<T> {
  message?: string;
  data?: T;
  status: 'success' | 'error';
  metadata?: object;
}

export interface PaginationParams {
  skip?: number;
  take?: number;
}
