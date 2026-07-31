// Shared contracts / API & Event interfaces
export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    status: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  status: string;
}

export interface AuthenticationError {
  statusCode: number;
  message: string;
  error: string;
}
