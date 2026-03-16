import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from '../GetUserProfileUseCase';
import { createMockUserRepository } from '../../../tests/setup/mockRepositories';

describe('GetUserProfileUseCase', () => {
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let useCase: GetUserProfileUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = createMockUserRepository();
    useCase = new GetUserProfileUseCase(mockUserRepository);
  });

  it('returns the user profile if it exists', async () => {
    const fakeUser = {
      id: 'user-123',
      email: 'test@admin.com',
      username: 'target_user',
      role: 'USER',
      createdAt: new Date(),
      passwordHash: 'secret_hash', 
    };
    
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(fakeUser as any);

    const result = await useCase.execute({ username: 'target_user' });

    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('target_user');
    expect(result.id).toBe('user-123');
    expect(result.username).toBe('target_user');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('throws an error if the user does not exist', async () => {
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(null);

    await expect(useCase.execute({ username: 'ghost_user' }))
      .rejects.toThrowError('Usuario no encontrado');
  });
});