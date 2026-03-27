export interface ResultDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}