export interface LoginRequest {
  email_address: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user_id: string;
  role: string;
  account_status: string;
}

// User type
export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;
  role: string;
}

// Full API response
export interface GetMeResponse {
  message: string;
  data: User;
}
