export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
