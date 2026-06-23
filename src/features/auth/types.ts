export interface User {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  createTime: Date;
  lastLoginTime: Date;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}
