export type ApiResponse<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ApiErrorResponse = ApiResponse<never> & {
  success: false;
  error: string;
};

export type ApiSuccessResponse<T> = ApiResponse<T> & {
  success: true;
  data: T;
};
