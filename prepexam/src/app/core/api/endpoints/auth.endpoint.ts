import { environment } from '../../../../environments/environment';

const BASE = environment.apiBaseUrl;

export const AuthEndpoints = {
  LOGIN: `${BASE}/auth/login`,
  REGISTER: `${BASE}/auth/register`,
  REFRESH_TOKEN: `${BASE}/auth/refresh`,
  LOGOUT: `${BASE}/auth/logout`,
  FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE}/auth/reset-password`,
} as const;
