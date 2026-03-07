import type { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

interface GetNotesInput {
  userId: string;
  role: string;
}

export class GetNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: GetNotesInput): Promise<Note[]> {
    if (input.role === 'ADMIN') {
      return await this.noteRepository.findAll();
    }

    return await this.noteRepository.findByUserId(input.userId);
  }
}
