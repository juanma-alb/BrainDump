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

  it('successfully returns the note if it exists', async () => {
    const expectedNote = Note.create({
      id: 'note-123',
      userId: 'user-001',
      title: 'Test Note',
      content: 'Test content',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockNoteRepository.findById).mockResolvedValue(expectedNote);

    const result = await useCase.execute({ id: 'note-123' });

    expect(result.id).toBe('note-123');
    expect(result.title).toBe('Test Note');
    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-123');
  });

  it('throws an error if the note is not found in the database', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'note-999' }))
      .rejects.toThrowError('Nota con id "note-999" no encontrada.');
      
    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-999');
  });
});