import { api } from './api';
import type { Note, PaginatedResult } from '../types/note';
import type { CreateNoteFormValues, UpdateNoteFormValues } from '../schemas/noteSchemas';

export const noteService = {
  async getNotes(
    page = 1,
    limit = 10,
    filters?: {
      tag?: string;
      search?: string;
      isFavorite?: boolean;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PaginatedResult<Note>> {
    const params: Record<string, string | number | boolean> = { page, limit };
    
    if (filters?.tag) params.tag = filters.tag;
    if (filters?.search) params.search = filters.search;
    if (filters?.isFavorite !== undefined) params.isFavorite = filters.isFavorite;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    
    const response = await api.get<PaginatedResult<Note>>('/notes', { params });
    return response.data;
  },

  async getTags(): Promise<string[]> {
    const response = await api.get<string[]>('/notes/tags');
    return response.data;
  },

  async createNote(data: CreateNoteFormValues): Promise<Note> {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  async updateNote(id: string, data: UpdateNoteFormValues & { isFavorite?: boolean }): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async generateDraft(topic: string): Promise<{ generatedContent: string }> {
    const response = await api.post<{ generatedContent: string }>('/notes/draft', { topic });
    return response.data;
  },
};