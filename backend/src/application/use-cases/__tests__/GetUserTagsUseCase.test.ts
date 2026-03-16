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

  it('should successfully return an array of tags', async () => {
    const mockTags = ['ideas', 'react', 'work'];
    vi.mocked(mockNoteRepository.getUserTags).mockResolvedValue(mockTags);

    const userId = 'user-123';
    const result = await getUserTagsUseCase.execute(userId);

    expect(mockNoteRepository.getUserTags).toHaveBeenCalledWith(userId);
    expect(mockNoteRepository.getUserTags).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTags);
  });

  it('should throw an error if the userId is empty or undefined', async () => {
    await expect(getUserTagsUseCase.execute('')).rejects.toThrowError(
      'El ID de usuario es requerido.'
    );

    expect(mockNoteRepository.getUserTags).not.toHaveBeenCalled();
  });
});