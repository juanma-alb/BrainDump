import { api } from './api';
import type { Note, PaginatedResult } from '../types/note';
import type { CreateNoteFormValues, UpdateNoteFormValues } from '../schemas/noteSchemas';

export const noteService = {
  async getNotes(
    page = 1,
    limit = 10,
    tag?: string
  ): Promise<PaginatedResult<Note>> {
    const params: Record<string, string | number> = { page, limit };
    if (tag) {
      params.tag = tag;
    }
    
    const response = await api.get<PaginatedResult<Note>>('/notes', { params });
    return response.data;
  },

  async createNote(data: CreateNoteFormValues): Promise<Note> {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  async updateNote(id: string, data: UpdateNoteFormValues): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};
