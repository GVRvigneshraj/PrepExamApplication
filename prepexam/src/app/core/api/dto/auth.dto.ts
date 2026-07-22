export interface LoginRequest {
  emailOrMobile: string;
  password: string;
  deviceId: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: {
    token: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    token: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  fullName: string;
  dob: string;
  email: string;
  mobileNumber: string;
  address: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}
