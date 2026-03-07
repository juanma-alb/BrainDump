import type { Note } from '@domain/entities/Note';

/**
 * Puerto (contrato) que define cómo la aplicación persiste y recupera notas.
 * La capa de Infrastructure DEBE implementar esta interfaz.
 * La regla de dependencia se respeta: el dominio no conoce la implementación concreta.
 */
export interface INoteRepository {
  save(note: Note): Promise<void>;
  findById(id: string): Promise<Note | null>;
  findAll(): Promise<Note[]>;
  findByUserId(userId: string): Promise<Note[]>;
  findByTag(tag: string): Promise<Note[]>;
  delete(id: string): Promise<void>;
}
