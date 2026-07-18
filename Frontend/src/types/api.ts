export type ApiResponse<TData> = {
  success: boolean;
  message: string;
  data?: TData;
};

export class ApiServiceError extends Error {
  status: number;
  response?: ApiResponse<unknown>;

  constructor(
    status: number,
    message: string,
    response?: ApiResponse<unknown>,
  ) {
    super(message);
    this.name = 'ApiServiceError';
    this.status = status;
    this.response = response;
  }
}

export const isApiServiceError = (
  error: unknown,
): error is ApiServiceError => error instanceof ApiServiceError;
