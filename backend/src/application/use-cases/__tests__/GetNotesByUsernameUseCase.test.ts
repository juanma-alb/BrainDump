import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNotesByUsernameUseCase } from '../GetNotesByUsernameUseCase';
import { createMockUserRepository, createMockNoteRepository } from '../../../tests/setup/mockRepositories';
import { Note } from '@domain/entities/Note';

describe('GetNotesByUsernameUseCase', () => {
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockNoteRepository: ReturnType<typeof createMockNoteRepository>;
  let useCase: GetNotesByUsernameUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = createMockUserRepository();
    mockNoteRepository = createMockNoteRepository();
    useCase = new GetNotesByUsernameUseCase(mockUserRepository, mockNoteRepository);
  });

  it('obtiene las notas del usuario si este existe', async () => {
    const fakeUser = { id: 'user-456', username: 'author' };
    const fakeNotes = [
      Note.create({ 
        id: 'n1', 
        userId: 'user-456', 
        title: 'Nota de Admin', 
        content: 'Contenido', 
        tags: [], 
        createdAt: new Date(), 
        updatedAt: new Date() 
      })
    ];

    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(fakeUser as any);
    vi.mocked(mockNoteRepository.findByUserId).mockResolvedValue(fakeNotes);

    const result = await useCase.execute({ username: 'author' });

    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('author');
    expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith('user-456');
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('Nota de Admin');
  });

  it('lanza un error si el usuario no existe y no busca sus notas', async () => {
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(null);

    await expect(useCase.execute({ username: 'nobody' }))
      .rejects.toThrowError('Usuario no encontrado');

    expect(mockNoteRepository.findByUserId).not.toHaveBeenCalled();
  });
});