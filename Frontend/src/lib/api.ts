import { ApiResponse, ApiServiceError } from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api';

type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

export const parseApiResponse = async <TData>(
  response: Response,
): Promise<ApiResponse<TData>> => {
  const fallback: ApiResponse<TData> = {
    success: false,
    message: 'Unable to parse server response',
  };

  return (await response.json().catch(() => fallback)) as ApiResponse<TData>;
};

export const requireData = <TData>(
  payload: ApiResponse<TData>,
  status: number,
): TData => {
  if (!payload.data) {
    throw new ApiServiceError(
      status,
      payload.message || 'Response data was missing',
      payload as ApiResponse<unknown>,
    );
  }

  return payload.data;
};

const requestApiResponse = async <TData>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<{ payload: ApiResponse<TData>; status: number; ok: boolean }> => {
  const { token, headers, ...fetchOptions } = options;
  const hasFormDataBody =
    typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(!hasFormDataBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  return {
    payload: await parseApiResponse<TData>(response),
    status: response.status,
    ok: response.ok,
  };
};

export const apiRequest = async <TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> => {
  const { payload, status, ok } = await requestApiResponse<unknown>(
    path,
    options,
  );

  if (!ok) {
    throw new ApiServiceError(
      status,
      payload.message || `Request failed with status ${status}`,
      payload,
    );
  }

  return payload as TResponse;
};

export const requestWithAuth = async <TData>(
  path: string,
  token: string | null,
  options: RequestInit = {},
): Promise<TData> => {
  if (!token) {
    throw new ApiServiceError(401, 'Authentication token is missing');
  }

  const { payload, status, ok } = await requestApiResponse<TData>(path, {
    ...options,
    token,
  });

  if (!ok || !payload.success) {
    throw new ApiServiceError(
      status,
      payload.message || `Request failed with status ${status}`,
      payload as ApiResponse<unknown>,
    );
  }

  return requireData(payload, status);
};

export { API_BASE_URL };
