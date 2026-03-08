import type { INoteRepository } from '@domain/ports/INoteRepository';
import type { IAiService } from '@domain/ports/IAiService';

export interface AutoTagNoteInput {
  noteId: string;
}

export interface AutoTagNoteOutput {
  noteId: string;
  addedTags: string[];
  allTags: string[];
}

/**
 * Caso de Uso: Auto-etiquetar una nota usando IA.
 *
 * Flujo:
 *  1. Busca la nota por ID (falla explícitamente si no existe).
 *  2. Delega al IAiService la generación de tags a partir del contenido.
 *  3. Produce una nueva instancia inmutable de Note con los tags fusionados.
 *  4. Persiste la nota actualizada.
 *
 * Ambas dependencias se inyectan: ninguna implementación concreta es conocida aquí.
 */
export class AutoTagNoteUseCase {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly aiService: IAiService
  ) {}

  async execute(input: AutoTagNoteInput): Promise<AutoTagNoteOutput> {
    const note = await this.noteRepository.findById(input.noteId);

    if (!note) {
      throw new Error(`Nota con id "${input.noteId}" no encontrada.`);
    }

    const generatedTags = await this.aiService.generateTags(note.content);

    const updatedNote = note.withAddedTags(generatedTags);

    await this.noteRepository.save(updatedNote);

    const addedTags = generatedTags.filter((tag) => !note.tags.includes(tag));

    return {
      noteId: updatedNote.id,
      addedTags,
      allTags: updatedNote.tags,
    };
  }
}
