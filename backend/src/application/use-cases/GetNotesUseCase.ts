import type { INoteRepository, NoteFilters, PaginatedResult } from '@domain/ports/INoteRepository';
import type { Note } from '@domain/entities/Note';

interface GetNotesInput {
  userId: string;
  role: string;
  page?: number;
  limit?: number;
  tag?: string;
}

export class GetNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: GetNotesInput): Promise<PaginatedResult<Note>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const filters: NoteFilters = { page, limit, tag: input.tag };

    if (input.role !== 'ADMIN') {
      filters.userId = input.userId;
    }

    return await this.noteRepository.findMany(filters);
  }
}
