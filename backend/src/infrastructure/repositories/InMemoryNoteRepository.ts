import type { Note } from '@domain/entities/Note';
import type { INoteRepository, NoteFilters, PaginatedResult } from '@domain/ports/INoteRepository';

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

  async findByUserId(userId: string): Promise<Note[]> {
    return Array.from(this.store.values()).filter((note) => note.userId === userId);
  }

  async findByTag(tag: string): Promise<Note[]> {
    return Array.from(this.store.values()).filter((note) =>
      note.tags.includes(tag)
    );
  }

  async getUserTags(userId: string): Promise<string[]> {
    const userNotes = await this.findByUserId(userId);
    const tagsSet = new Set<string>();

    userNotes.forEach((note) => {
      note.tags.forEach((tag) => tagsSet.add(tag));
    });

    return Array.from(tagsSet); // Convertimos el Set (valores únicos) de nuevo a un Array
  }

  async update(note: Note): Promise<void> {
    if (!this.store.has(note.id)) {
      throw new Error(`Note with id ${note.id} not found`);
    }
    this.store.set(note.id, note);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async findMany(filters: NoteFilters): Promise<PaginatedResult<Note>> {
    // 1. Empezamos con todas las notas en el repositorio
    let filteredNotes = Array.from(this.store.values());

    // 2. Aplicamos cada filtro si existe
    if (filters.userId) {
      filteredNotes = filteredNotes.filter((note) => note.userId === filters.userId);
    }

    if (filters.tag) {
      filteredNotes = filteredNotes.filter((note) => note.tags.includes(filters.tag!));
    }

    if (filters.isFavorite !== undefined) {
      filteredNotes = filteredNotes.filter((note) => note.isFavorite === filters.isFavorite);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredNotes = filteredNotes.filter((note) => 
        // Asumiendo que la entidad Note tiene 'title' y 'content'.
        // Si tienes nombres diferentes de propiedad, ajusta esta parte.
        (note.title && note.title.toLowerCase().includes(searchTerm)) ||
        (note.content && note.content.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.startDate) {
      // Asumiendo que la entidad Note tiene un 'createdAt' tipo Date
      filteredNotes = filteredNotes.filter((note) => note.createdAt >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredNotes = filteredNotes.filter((note) => note.createdAt <= filters.endDate!);
    }

    // 3. Calculamos la paginación
    const total = filteredNotes.length;
    const totalPages = Math.ceil(total / filters.limit);
    
    // Obtenemos solo la porción de datos de la página actual
    const startIndex = (filters.page - 1) * filters.limit;
    const paginatedItems = filteredNotes.slice(startIndex, startIndex + filters.limit);

    // 4. Retornamos el resultado paginado respetando la interfaz PaginatedResult
    return {
      items: paginatedItems,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages,
    };
  }
}