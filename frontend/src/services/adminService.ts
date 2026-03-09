import { api } from './api';
import type { User } from '../types/auth';
import type { Note } from '../types/note';

export const adminService = {
  async getUserByUsername(username: string): Promise<User> {
    const response = await api.get<User>(`/admin/users/${username}`);
    return response.data;
  },

  async getUserNotes(username: string): Promise<Note[]> {
    const response = await api.get<Note[]>(`/admin/users/${username}/notes`);
    return response.data;
  },
};
