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
    title: 'Old Title',
    content: 'Old content',
    tags: ['old'],
    isFavorite: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

  beforeEach(() => {
    mockNoteRepository = createMockNoteRepository();
    useCase = new UpdateNoteUseCase(mockNoteRepository);
  });

  it('successfully updates title, content, tags and isFavorite state', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    const result = await useCase.execute({
      noteId: 'note-123',
      userId: 'owner-777',
      title: 'New Title',
      content: 'New content',
      tags: ['new', 'updated'],
      isFavorite: true,
    });

    expect(result.title).toBe('New Title');
    expect(result.content).toBe('New content');
    expect(result.tags).toEqual(['new', 'updated']);
    expect(result.isFavorite).toBe(true);
    expect(mockNoteRepository.update).toHaveBeenCalledOnce();
  });

  it('keeps original values if they are not provided in the input', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    const result = await useCase.execute({
      noteId: 'note-123',
      userId: 'owner-777',
      isFavorite: true, 
    });

    expect(result.title).toBe('Old Title');
    expect(result.content).toBe('Old content');
    expect(result.isFavorite).toBe(true);
    expect(mockNoteRepository.update).toHaveBeenCalledOnce();
  });

  it('throws an authorization error if a user tries to modify another user\'s note (IDOR)', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await expect(
      useCase.execute({
        noteId: 'note-123',
        userId: 'hacker-999',
        title: 'Hacked Title',
      })
    ).rejects.toThrowError('No tienes permiso para modificar esta nota.');

    expect(mockNoteRepository.update).not.toHaveBeenCalled();
  });

  it('throws an error when trying to update a non-existent note', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        noteId: 'invalid-id',
        userId: 'owner-777',
        title: 'Attempting to update',
      })
    ).rejects.toThrowError('Nota no encontrada.');

    expect(mockNoteRepository.update).not.toHaveBeenCalled();
  });
});