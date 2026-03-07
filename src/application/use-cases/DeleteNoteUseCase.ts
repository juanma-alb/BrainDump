import type { INoteRepository } from '@domain/ports/INoteRepository';

export interface DeleteNoteInput {
  noteId: string;
  userId: string;
  role: string;
}

/*
  Caso de Uso: Eliminar una nota por su ID.

  Seguridad IDOR/BOLA
 */
export class DeleteNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: DeleteNoteInput): Promise<void> {
    const note = await this.noteRepository.findById(input.noteId);

    if (!note) {
      throw new Error(`Nota con id "${input.noteId}" no encontrada.`);
    }

    if (input.role !== 'ADMIN' && note.userId !== input.userId) {
      throw new Error('No tienes permiso para eliminar esta nota.');
    }

    await this.noteRepository.delete(input.noteId);
  }
}
