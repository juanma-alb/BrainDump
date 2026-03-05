import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteNoteUseCase } from './DeleteNoteUseCase';
import { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';

const OWNER_ID = 'user-owner-123';
const ATTACKER_ID = 'user-attacker-456';

const existingNote = Note.create({
  id: 'note-to-delete',
  userId: OWNER_ID,
  title: 'Nota temporal',
  content: 'Esta nota será eliminada.',
  tags: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
});

const mockNoteRepository: INoteRepository = {
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  findByTag: vi.fn(),
  delete: vi.fn().mockResolvedValue(undefined),
};

describe('DeleteNoteUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('elimina la nota cuando el userId coincide con el propietario', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    const useCase = new DeleteNoteUseCase(mockNoteRepository);
    await useCase.execute({ noteId: 'note-to-delete', userId: OWNER_ID });

    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-to-delete');
    expect(mockNoteRepository.delete).toHaveBeenCalledWith('note-to-delete');
  });

  it('lanza error de autorización si el userId no coincide (IDOR)', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    const useCase = new DeleteNoteUseCase(mockNoteRepository);

    await expect(
      useCase.execute({ noteId: 'note-to-delete', userId: ATTACKER_ID })
    ).rejects.toThrowError('No tienes permiso para eliminar esta nota.');

    expect(mockNoteRepository.delete).not.toHaveBeenCalled();
  });

  it('lanza error si la nota no existe', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    const useCase = new DeleteNoteUseCase(mockNoteRepository);

    await expect(
      useCase.execute({ noteId: 'id-inexistente', userId: OWNER_ID })
    ).rejects.toThrowError('Nota con id "id-inexistente" no encontrada.');

    expect(mockNoteRepository.delete).not.toHaveBeenCalled();
  });
});
