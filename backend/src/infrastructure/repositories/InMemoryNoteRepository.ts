import type { Note } from '@domain/entities/Note';
import type { INoteRepository, NoteFilters, PaginatedResult } from '@domain/ports/INoteRepository';

/**
 * In-memory implementation of the notes repository.
 * Ideal for integration tests, local development, and demos.
 * In production, this would be replaced with a real database implementation
 * without changing anything in the Domain or Application.
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

    return Array.from(tagsSet); 
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
    let filteredNotes = Array.from(this.store.values());

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
     
        (note.title && note.title.toLowerCase().includes(searchTerm)) ||
        (note.content && note.content.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.startDate) {
      filteredNotes = filteredNotes.filter((note) => note.createdAt >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredNotes = filteredNotes.filter((note) => note.createdAt <= filters.endDate!);
    }

    const total = filteredNotes.length;
    const totalPages = Math.ceil(total / filters.limit);
    
    const startIndex = (filters.page - 1) * filters.limit;
    const paginatedItems = filteredNotes.slice(startIndex, startIndex + filters.limit);

    return {
      items: paginatedItems,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages,
    };
  }
}