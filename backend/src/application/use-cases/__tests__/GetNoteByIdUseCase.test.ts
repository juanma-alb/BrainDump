import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNoteByIdUseCase } from './../GetNoteByIdUseCase';
import { Note } from '@domain/entities/Note';
import { createMockNoteRepository } from '../../../tests/setup/mockRepositories';

describe('GetNoteByIdUseCase', () => {
  let mockNoteRepository: ReturnType<typeof createMockNoteRepository>;
  let useCase: GetNoteByIdUseCase;

  beforeEach(() => {
    mockNoteRepository = createMockNoteRepository();
    useCase = new GetNoteByIdUseCase(mockNoteRepository);
  });

  it('retorna la nota exitosamente si existe', async () => {
    const expectedNote = Note.create({
      id: 'note-123',
      userId: 'user-001',
      title: 'Nota de Prueba',
      content: 'Contenido de prueba',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockNoteRepository.findById).mockResolvedValue(expectedNote);

    const result = await useCase.execute({ id: 'note-123' });

    expect(result.id).toBe('note-123');
    expect(result.title).toBe('Nota de Prueba');
    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-123');
  });

  it('lanza un error si la nota no se encuentra en la base de datos', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'note-999' }))
      .rejects.toThrowError('Nota con id "note-999" no encontrada.');
      
    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-999');
  });
});