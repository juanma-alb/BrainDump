import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateNoteUseCase } from './../UpdateNoteUseCase';
import { Note } from '@domain/entities/Note';
import { createMockNoteRepository } from '../../../tests/setup/mockRepositories';

describe('UpdateNoteUseCase', () => {
  let mockNoteRepository: ReturnType<typeof createMockNoteRepository>;
  let useCase: UpdateNoteUseCase;

  const existingNote = Note.create({
    id: 'note-123',
    userId: 'owner-777',
    title: 'Título Antiguo',
    content: 'Contenido antiguo',
    tags: ['viejo'],
    isFavorite: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

  beforeEach(() => {
    mockNoteRepository = createMockNoteRepository();
    useCase = new UpdateNoteUseCase(mockNoteRepository);
  });

  it('actualiza exitosamente el título, contenido, tags y el estado isFavorite', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    const result = await useCase.execute({
      noteId: 'note-123',
      userId: 'owner-777',
      title: 'Título Nuevo',
      content: 'Contenido nuevo',
      tags: ['nuevo', 'actualizado'],
      isFavorite: true,
    });

    expect(result.title).toBe('Título Nuevo');
    expect(result.content).toBe('Contenido nuevo');
    expect(result.tags).toEqual(['nuevo', 'actualizado']);
    expect(result.isFavorite).toBe(true);
    expect(mockNoteRepository.update).toHaveBeenCalledOnce();
  });

  it('conserva los valores originales si no se envían en el input', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    const result = await useCase.execute({
      noteId: 'note-123',
      userId: 'owner-777',
      isFavorite: true, 
    });

    expect(result.title).toBe('Título Antiguo');
    expect(result.content).toBe('Contenido antiguo');
    expect(result.isFavorite).toBe(true);
    expect(mockNoteRepository.update).toHaveBeenCalledOnce();
  });

  it('lanza un error de autorización si un usuario intenta modificar la nota de otro (IDOR)', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await expect(
      useCase.execute({
        noteId: 'note-123',
        userId: 'hacker-999',
        title: 'Título Hackeado',
      })
    ).rejects.toThrowError('No tienes permiso para modificar esta nota.');

    expect(mockNoteRepository.update).not.toHaveBeenCalled();
  });

  it('lanza un error si se intenta actualizar una nota inexistente', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        noteId: 'invalid-id',
        userId: 'owner-777',
        title: 'Intentando actualizar',
      })
    ).rejects.toThrowError('Nota no encontrada.');

    expect(mockNoteRepository.update).not.toHaveBeenCalled();
  });
});