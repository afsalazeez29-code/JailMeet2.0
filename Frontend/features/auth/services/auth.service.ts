import { API_BASE_URL } from '@/lib/api';
import { getAccessToken, login as loginWithCredentials } from '@features/auth/services/token.service';
import { ApiResponse, ApiServiceError } from '@/types/api';
import {
  AuthUser,
  ChangePasswordInput,
  CurrentUserData,
  CurrentUserResponse,
  LoginResponse,
  VisitorRegistrationData,
  VisitorRegistrationPayload,
} from '@features/auth/types';

const parseApiResponse = async <TData>(
  response: Response,
): Promise<ApiResponse<TData>> => {
  const fallback: ApiResponse<TData> = {
    success: false,
    message: 'Unable to parse server response',
  };

  return (await response.json().catch(() => fallback)) as ApiResponse<TData>;
};

const requireData = <TData>(
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

export const requestWithAuth = async <TData>(
  path: string,
  token = getAccessToken(),
  options: RequestInit = {},
): Promise<TData> => {
  if (!token) {
    throw new ApiServiceError(401, 'Authentication token is missing');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const payload = await parseApiResponse<TData>(response);

  if (!response.ok || !payload.success) {
    throw new ApiServiceError(
      response.status,
      payload.message || `Request failed with status ${response.status}`,
      payload as ApiResponse<unknown>,
    );
  }

  return requireData(payload, response.status);
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => loginWithCredentials(email, password);

export const registerVisitor = async (
  payload: VisitorRegistrationPayload,
): Promise<VisitorRegistrationData> => {
  const response = await fetch(`${API_BASE_URL}/auth/register-visitor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const responsePayload =
    await parseApiResponse<VisitorRegistrationData>(response);

  if (!response.ok || !responsePayload.success) {
    throw new ApiServiceError(
      response.status,
      responsePayload.message ||
        `Registration failed with status ${response.status}`,
      responsePayload as ApiResponse<unknown>,
    );
  }

  return requireData(responsePayload, response.status);
};

export const getCurrentUser = async (
  token = getAccessToken(),
): Promise<AuthUser> => {
  const data = await requestWithAuth<CurrentUserData>('/auth/me', token);

  return data.user;
};

export const changePassword = async (
  payload: ChangePasswordInput,
): Promise<null> =>
  requestWithAuth<null>('/auth/change-password', undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export type { CurrentUserResponse };
