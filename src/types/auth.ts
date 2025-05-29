export interface SessionData {
  user: { id: string; name: string; email: string };
  expires: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
