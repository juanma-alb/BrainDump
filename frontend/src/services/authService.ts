import { api } from './api';
import type { AuthResponse } from '../types/auth';
import type { LoginFormValues, RegisterFormValues } from '../schemas/authSchemas';

export const authService = {
  async login(data: LoginFormValues): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterFormValues): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
