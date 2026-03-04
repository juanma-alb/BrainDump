import type { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

/**
 * Implementación en memoria del repositorio de notas.
 * Ideal para tests de integración, desarrollo local y demos.
 * En producción se reemplazaría por una implementación con base de datos real
 * sin cambiar nada en Domain ni Application.
 */
export class InMemoryNoteRepository implements INoteRepository {
  private readonly store = new Map<string, Note>();

  async save(note: Note): Promise<void> {
    this.store.set(note.id, note);
  }

  async findById(id: string): Promise<Note | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Note[]> {
    return Array.from(this.store.values());
  }

  async findByTag(tag: string): Promise<Note[]> {
    return Array.from(this.store.values()).filter((note) =>
      note.tags.includes(tag)
    );
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
