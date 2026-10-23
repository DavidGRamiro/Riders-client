

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ExtraDataLogin{
  username: string;
  email: string;
  is_active: boolean;
  authenticated: boolean;
}

export interface ResponseLogin {
  access: string;
  refresh: string;
  extra_data : ExtraDataLogin
}