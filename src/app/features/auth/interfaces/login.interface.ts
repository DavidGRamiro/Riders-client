

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ResponseLogin {
  access: string;
  refresh: string
}