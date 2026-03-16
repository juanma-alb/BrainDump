import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteNoteUseCase } from '../DeleteNoteUseCase';
import { Note } from '@domain/entities/Note';
import { createMockNoteRepository } from '../../../tests/setup/mockRepositories';

const OWNER_ID = 'user-owner-123';
const ATTACKER_ID = 'user-attacker-456';

const existingNote = Note.create({
  id: 'note-to-delete',
  userId: OWNER_ID,
  title: 'Temporary note',
  content: 'This note will be deleted.',
  tags: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
});

describe('DeleteNoteUseCase', () => {
  let mockNoteRepository: ReturnType<typeof createMockNoteRepository>;
  let useCase: DeleteNoteUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNoteRepository = createMockNoteRepository();
    useCase = new DeleteNoteUseCase(mockNoteRepository);
  });

  it('deletes the note when the userId matches the owner', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await useCase.execute({ noteId: 'note-to-delete', userId: OWNER_ID, role: 'USER' });

    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-to-delete');
    expect(mockNoteRepository.delete).toHaveBeenCalledWith('note-to-delete');
  });

  it('throws an authorization error if the userId does not match (IDOR)', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await expect(
      useCase.execute({ noteId: 'note-to-delete', userId: ATTACKER_ID, role: 'USER' })
    ).rejects.toThrowError('No tienes permiso para eliminar esta nota.');

    expect(mockNoteRepository.delete).not.toHaveBeenCalled();
  });

  it('allows deleting the note if the role is ADMIN, even if they are not the owner', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await useCase.execute({ noteId: 'note-to-delete', userId: 'admin-999', role: 'ADMIN' });

    expect(mockNoteRepository.delete).toHaveBeenCalledWith('note-to-delete');
  });

  it('throws an error if the note does not exist', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({ noteId: 'id-inexistente', userId: OWNER_ID, role: 'USER' })
    ).rejects.toThrowError('Nota con id "id-inexistente" no encontrada.');

    expect(mockNoteRepository.delete).not.toHaveBeenCalled();
  });
});