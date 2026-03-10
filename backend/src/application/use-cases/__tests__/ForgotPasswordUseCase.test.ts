import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForgotPasswordUseCase } from '../ForgotPasswordUseCase';
import { createMockUserRepository, createMockTokenService, createMockEmailService } from '../../../tests/setup/mockRepositories';

describe('ForgotPasswordUseCase', () => {
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockTokenService: ReturnType<typeof createMockTokenService>;
  let mockEmailService: ReturnType<typeof createMockEmailService>;
  let useCase: ForgotPasswordUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = createMockUserRepository();
    mockTokenService = createMockTokenService();
    mockEmailService = createMockEmailService();
    useCase = new ForgotPasswordUseCase(mockUserRepository, mockTokenService, mockEmailService);
  });

  it('genera un token y envía un correo si el usuario existe', async () => {
    const user = {
      id: 'user-123',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
    };
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(user as any);
    vi.mocked(mockTokenService.generatePasswordResetToken).mockReturnValue('reset-token-123');

    await useCase.execute({ email: 'test@example.com' });

    expect(mockTokenService.generatePasswordResetToken).toHaveBeenCalledWith(
      { userId: user.id },
      user.passwordHash
    );
    expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
      user.email,
      'reset-token-123',
      user.id
    );
  });

  it('no hace nada (retorna silenciosamente) si el usuario no existe', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    await useCase.execute({ email: 'inexistente@example.com' });

    expect(mockTokenService.generatePasswordResetToken).not.toHaveBeenCalled();
    expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});