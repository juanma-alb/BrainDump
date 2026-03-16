import { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

export interface UpdateNoteInput {
  noteId: string;
  userId: string;
  title?: string;
  content?: string;
  tags?: string[];
  isFavorite?: boolean;
}

/*Use Case: Edit an existing note.
IDOR/BOLA Security: Verifies that the requester's user ID matches
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
      isFavorite: input.isFavorite ?? existing.isFavorite,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.noteRepository.update(updated);

    return updated;
  }
}
