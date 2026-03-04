import type { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

export interface GetNoteByIdInput {
  id: string;
}

/**
 * Caso de Uso: Obtener una nota por su ID.
 * Lanza un error de dominio si la nota no existe, en lugar de devolver null.
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
