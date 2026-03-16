import type { INoteRepository, NoteFilters, PaginatedResult } from '@domain/ports/INoteRepository';
import type { Note } from '@domain/entities/Note';

interface GetNotesInput {
  userId: string;
  role: string;
  page?: number;
  limit?: number;
  tag?: string;
  isFavorite?: boolean; 
  search?: string;      
  startDate?: Date;     
  endDate?: Date;
}

/* Use case: Retrieve a user's ratings starting from page 1, with a limit of 10 ratings per page (pagination) */

export class GetNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: GetNotesInput): Promise<PaginatedResult<Note>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const filters: NoteFilters = { 
      page, 
      limit, 
      tag: input.tag,
      isFavorite: input.isFavorite,
      search: input.search,
      startDate: input.startDate,
      endDate: input.endDate
    };

    if (input.role !== 'ADMIN') {
      filters.userId = input.userId;
    }

    return await this.noteRepository.findMany(filters);
  }
}
