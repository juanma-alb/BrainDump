import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetUserTagsUseCase } from './../GetUserTagsUseCase';
import {createMockNoteRepository } from '../../../tests/setup/mockRepositories';

describe('GetUserTagsUseCase', () => {
  let mockNoteRepository: ReturnType<typeof createMockNoteRepository>;
  let getUserTagsUseCase: GetUserTagsUseCase;

  beforeEach(() => {
    mockNoteRepository = createMockNoteRepository();
    getUserTagsUseCase = new GetUserTagsUseCase(mockNoteRepository);
  });

  it('debe retornar un array de etiquetas exitosamente', async () => {
    const mockTags = ['ideas', 'react', 'work'];
    vi.mocked(mockNoteRepository.getUserTags).mockResolvedValue(mockTags);

    const userId = 'user-123';
    const result = await getUserTagsUseCase.execute(userId);

    expect(mockNoteRepository.getUserTags).toHaveBeenCalledWith(userId);
    expect(mockNoteRepository.getUserTags).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTags);
  });

  it('debe lanzar un error si el userId está vacío o es indefinido', async () => {
    await expect(getUserTagsUseCase.execute('')).rejects.toThrowError(
      'El ID de usuario es requerido.'
    );

    expect(mockNoteRepository.getUserTags).not.toHaveBeenCalled();
  });
});