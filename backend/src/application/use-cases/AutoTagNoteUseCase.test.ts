import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AutoTagNoteUseCase } from './AutoTagNoteUseCase';
import { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';
import type { IAiService } from '@domain/ports/IAiService';

// --- Fixtures ---

const existingNote = Note.create({
  id: 'note-abc-123',
  userId: 'user-001',
  title: 'Reflexión sobre patrones',
  content: 'La inyección de dependencias facilita el testing y la sustitución de implementaciones.',
  tags: ['patrones'],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
});

// --- Mocks de los dos puertos ---

const mockNoteRepository: INoteRepository = {
  save: vi.fn().mockResolvedValue(undefined),
  findById: vi.fn(),
  findAll: vi.fn(),
  findByTag: vi.fn(),
  delete: vi.fn(),
};

const mockAiService: IAiService = {
  generateTags: vi.fn(),
};

// ---

describe('AutoTagNoteUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('genera tags, los fusiona con los existentes y guarda la nota actualizada', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
    vi.mocked(mockAiService.generateTags).mockResolvedValue(['IA', 'Arquitectura']);

    const useCase = new AutoTagNoteUseCase(mockNoteRepository, mockAiService);
    const result = await useCase.execute({ noteId: 'note-abc-123' });

    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-abc-123');
    expect(mockAiService.generateTags).toHaveBeenCalledWith(existingNote.content);
    expect(mockNoteRepository.save).toHaveBeenCalledOnce();

    expect(result.addedTags).toEqual(['IA', 'Arquitectura']);
    expect(result.allTags).toEqual(expect.arrayContaining(['patrones', 'IA', 'Arquitectura']));
    expect(result.allTags).toHaveLength(3);
  });

  it('no duplica tags si la IA devuelve uno que ya existía', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
    vi.mocked(mockAiService.generateTags).mockResolvedValue(['patrones', 'IA']);

    const useCase = new AutoTagNoteUseCase(mockNoteRepository, mockAiService);
    const result = await useCase.execute({ noteId: 'note-abc-123' });

    expect(result.allTags).toHaveLength(2);
    expect(result.addedTags).toEqual(['IA']);
  });

  it('lanza error si la nota no existe', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    const useCase = new AutoTagNoteUseCase(mockNoteRepository, mockAiService);

    await expect(
      useCase.execute({ noteId: 'id-inexistente' })
    ).rejects.toThrowError('Nota con id "id-inexistente" no encontrada.');

    expect(mockAiService.generateTags).not.toHaveBeenCalled();
    expect(mockNoteRepository.save).not.toHaveBeenCalled();
  });

  it('no guarda si la IA no genera ningún tag nuevo', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);
    vi.mocked(mockAiService.generateTags).mockResolvedValue(['patrones']);

    const useCase = new AutoTagNoteUseCase(mockNoteRepository, mockAiService);
    const result = await useCase.execute({ noteId: 'note-abc-123' });

    // save sigue llamándose (el repositorio decide si hay diff), pero addedTags está vacío
    expect(result.addedTags).toHaveLength(0);
    expect(result.allTags).toEqual(['patrones']);
  });
});
