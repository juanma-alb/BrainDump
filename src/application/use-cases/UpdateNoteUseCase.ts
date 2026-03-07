import { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

export interface UpdateNoteInput {
  noteId: string;
  userId: string;
  title?: string;
  content?: string;
  tags?: string[];
}

/**
 * Caso de Uso: Actualizar una nota existente.
 *
 * Seguridad IDOR/BOLA: verifica que el userId del solicitante coincide
 * con el userId de la nota antes de realizar cualquier modificación.
 * Las actualizaciones son parciales: sólo se reemplazan los campos recibidos.
 */
export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: UpdateNoteInput): Promise<Note> {
    const existing = await this.noteRepository.findById(input.noteId);

    if (!existing) {
      throw new Error('Nota no encontrada.');
    }

    if (existing.userId !== input.userId) {
      throw new Error('No tienes permiso para modificar esta nota.');
    }

    const updated = Note.create({
      id: existing.id,
      userId: existing.userId,
      title: input.title ?? existing.title,
      content: input.content ?? existing.content,
      tags: input.tags ?? existing.tags,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.noteRepository.update(updated);

    return updated;
  }
}
