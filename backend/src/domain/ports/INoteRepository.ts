import type { Note } from '@domain/entities/Note';

export interface NoteFilters {
  page: number;
  limit: number;
  userId?: string;
  tag?: string;
  isFavorite?: boolean; 
  search?: string;      
  startDate?: Date;     
  endDate?: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
/*
  Port (contract) that defines how the application persists and retrieves notes.
 */
export interface INoteRepository {
  save(note: Note): Promise<void>;
  findById(id: string): Promise<Note | null>;
  findAll(): Promise<Note[]>;
  findByUserId(userId: string): Promise<Note[]>;
  findByTag(tag: string): Promise<Note[]>;
  getUserTags(userId: string): Promise<string[]>;
  update(note: Note): Promise<void>;
  delete(id: string): Promise<void>;
  findMany(filters: NoteFilters): Promise<PaginatedResult<Note>>;
}
