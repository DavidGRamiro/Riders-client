

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ExtraDataLogin{
  username: string;
  email: string;
  is_online: boolean;
  authenticated: boolean;
}

export interface ResponseLogin {
  access: string;
  refresh: string;
  extra_data : ExtraDataLogin
}

export interface SignUpRequest{
  name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface ResponseSignUp{
  token : string
  refresh: string;
  user: string;
  is_online: boolean;
}