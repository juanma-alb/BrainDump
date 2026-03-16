import type { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

export interface GetNoteByIdInput {
  id: string;
}

/*
  Use Case: Retrieve a note by its ID.
  Throws a domain error if the note does not exist, instead of returning null.
 */
export class GetNoteByIdUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: GetNoteByIdInput): Promise<Note> {
    const note = await this.noteRepository.findById(input.id);

    if (!note) {
      throw new Error(`Nota con id "${input.id}" no encontrada.`);
    }

    return note;
  }
}
