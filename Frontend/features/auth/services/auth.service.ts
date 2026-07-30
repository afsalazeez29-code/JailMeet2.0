import {
  API_BASE_URL,
  parseApiResponse,
  requestWithAuth as requestWithAuthUsingToken,
  requireData,
} from '@/lib/api';
import {
  clearAccessToken,
  getAccessToken,
  login as loginWithCredentials,
  AUTH_FORBIDDEN_EVENT,
} from '@features/auth/services/token.service';
import { ApiResponse, ApiServiceError, isApiServiceError } from '@/types/api';
import {
  AuthUser,
  ChangePasswordInput,
  ChangePasswordData,
  CurrentUserData,
  LoginResponse,
  VisitorRegistrationData,
  VisitorRegistrationPayload,
  Role,
} from '@features/auth/types';

export const requestWithAuth = async <TData>(
  path: string,
  token = getAccessToken(),
  options: RequestInit = {},
): Promise<TData> => {
  try {
    return await requestWithAuthUsingToken<TData>(path, token, options);
  } catch (error) {
    if (isApiServiceError(error) && error.status === 401) {
      clearAccessToken();
    }

    if (
      isApiServiceError(error) &&
      error.status === 403 &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(new Event(AUTH_FORBIDDEN_EVENT));
    }

    throw error;
  }
};

export const login = async (
  email: string,
  password: string,
  expectedRole: Role,
): Promise<LoginResponse> =>
  loginWithCredentials(email, password, expectedRole);

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
): Promise<ChangePasswordData> =>
  requestWithAuth<ChangePasswordData>('/auth/change-password', undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

