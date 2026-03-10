import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteNoteUseCase } from '../DeleteNoteUseCase';
import { Note } from '@domain/entities/Note';
import { createMockNoteRepository } from '../../../tests/setup/mockRepositories';

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

describe('DeleteNoteUseCase', () => {
  let mockNoteRepository: ReturnType<typeof createMockNoteRepository>;
  let useCase: DeleteNoteUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNoteRepository = createMockNoteRepository();
    useCase = new DeleteNoteUseCase(mockNoteRepository);
  });

  it('elimina la nota cuando el userId coincide con el propietario', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await useCase.execute({ noteId: 'note-to-delete', userId: OWNER_ID, role: 'USER' });

    expect(mockNoteRepository.findById).toHaveBeenCalledWith('note-to-delete');
    expect(mockNoteRepository.delete).toHaveBeenCalledWith('note-to-delete');
  });

  it('lanza error de autorización si el userId no coincide (IDOR)', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await expect(
      useCase.execute({ noteId: 'note-to-delete', userId: ATTACKER_ID, role: 'USER' })
    ).rejects.toThrowError('No tienes permiso para eliminar esta nota.');

    expect(mockNoteRepository.delete).not.toHaveBeenCalled();
  });

  it('permite eliminar la nota si el rol es ADMIN, incluso si no es el propietario', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(existingNote);

    await useCase.execute({ noteId: 'note-to-delete', userId: 'admin-999', role: 'ADMIN' });

    expect(mockNoteRepository.delete).toHaveBeenCalledWith('note-to-delete');
  });

  it('lanza error si la nota no existe', async () => {
    vi.mocked(mockNoteRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({ noteId: 'id-inexistente', userId: OWNER_ID, role: 'USER' })
    ).rejects.toThrowError('Nota con id "id-inexistente" no encontrada.');

    expect(mockNoteRepository.delete).not.toHaveBeenCalled();
  });
});