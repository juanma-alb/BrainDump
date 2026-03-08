import { randomUUID } from 'crypto';
import { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

export interface CreateNoteInput {
  userId: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface CreateNoteOutput {
  id: string;
  title: string;
  createdAt: Date;
}

/**
 * Caso de Uso: Crear una nueva nota.
 * Recibe el repositorio por inyección de dependencias → testeable sin base de datos real.
 */
export class CreateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: CreateNoteInput): Promise<CreateNoteOutput> {
    const now = new Date();

    const note = Note.create({
      id: randomUUID(),
      userId: input.userId,
      title: input.title,
      content: input.content,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
    });

    await this.noteRepository.save(note);

    return {
      id: note.id,
      title: note.title,
      createdAt: note.createdAt,
    };
  }
}
