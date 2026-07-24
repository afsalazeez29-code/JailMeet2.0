import {
  API_BASE_URL,
  parseApiResponse,
  requestWithAuth as requestWithAuthUsingToken,
  requireData,
} from '@/lib/api';
import { getAccessToken, login as loginWithCredentials } from '@features/auth/services/token.service';
import { ApiResponse, ApiServiceError } from '@/types/api';
import {
  AuthUser,
  ChangePasswordInput,
  CurrentUserData,
  LoginResponse,
  VisitorRegistrationData,
  VisitorRegistrationPayload,
} from '@features/auth/types';

export const requestWithAuth = async <TData>(
  path: string,
  token = getAccessToken(),
  options: RequestInit = {},
): Promise<TData> => requestWithAuthUsingToken<TData>(path, token, options);

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

