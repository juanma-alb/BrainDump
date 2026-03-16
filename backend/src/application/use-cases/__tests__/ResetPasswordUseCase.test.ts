import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResetPasswordUseCase } from '../ResetPasswordUseCase';
import { createMockUserRepository, createMockTokenService } from '../../../tests/setup/mockRepositories';
import bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('new_hashed_password'),
  },
}));

describe('ResetPasswordUseCase', () => {
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockTokenService: ReturnType<typeof createMockTokenService>;
  let useCase: ResetPasswordUseCase;

  const FAKE_USER = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'old_hashed_password',
    role: 'USER',
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = createMockUserRepository();
    mockTokenService = createMockTokenService();
    useCase = new ResetPasswordUseCase(mockUserRepository, mockTokenService);
  });

  it('resets the password if the token is valid and the user exists', async () => {
    vi.mocked(mockUserRepository.findById).mockResolvedValue(FAKE_USER as any);
    vi.mocked(mockTokenService.verifyPasswordResetToken).mockReturnValue({ userId: 'user-123' });

    await useCase.execute({
      userId: 'user-123',
      token: 'valid-token',
      newPassword: 'newPassword123',
    });

    expect(mockTokenService.verifyPasswordResetToken).toHaveBeenCalledWith('valid-token', 'old_hashed_password');
    expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
    expect(mockUserRepository.save).toHaveBeenCalledOnce();
    
    const savedUser = vi.mocked(mockUserRepository.save).mock.calls[0]?.[0];
    expect(savedUser?.passwordHash).toBe('new_hashed_password');
  });

  it('throws an error if the user does not exist', async () => {
    vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-999',
        token: 'valid-token',
        newPassword: 'newPassword123',
      })
    ).rejects.toThrowError('Usuario no encontrado.');

    expect(mockTokenService.verifyPasswordResetToken).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('throws an error if the token is invalid (letting the TokenService throw the error)', async () => {
    vi.mocked(mockUserRepository.findById).mockResolvedValue(FAKE_USER as any);
    
    vi.mocked(mockTokenService.verifyPasswordResetToken).mockImplementation(() => {
      throw new Error('Token inválido o expirado');
    });

    await expect(
      useCase.execute({
        userId: 'user-123',
        token: 'invalid-token',
        newPassword: 'newPassword123',
      })
    ).rejects.toThrowError('Token inválido o expirado');

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});