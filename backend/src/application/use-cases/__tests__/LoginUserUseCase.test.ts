import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUserUseCase } from '../LoginUserUseCase';
import { createMockUserRepository, createMockTokenService } from '../../../tests/setup/mockRepositories';
import bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe('LoginUserUseCase', () => {
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockTokenService: ReturnType<typeof createMockTokenService>;
  let useCase: LoginUserUseCase;

  const FAKE_USER = {
    id: 'user-001',
    email: 'usuario@example.com',
    username: 'usuario1',
    passwordHash: '$2b$10$hash_simulado',
    role: 'USER' as const,
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = createMockUserRepository();
    mockTokenService = createMockTokenService();
    useCase = new LoginUserUseCase(mockUserRepository, mockTokenService);
  });

  it('returns a token and the user when the credentials are correct', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(FAKE_USER as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(mockTokenService.generateToken).mockReturnValue('jwt.token.simulado');

    const result = await useCase.execute({
      email: 'usuario@example.com',
      password: 'password_correcto',
    });

    expect(result.token).toBe('jwt.token.simulado');
    expect(result.user.email).toBe('usuario@example.com');
    expect(mockTokenService.generateToken).toHaveBeenCalledWith({
      userId: FAKE_USER.id,
      role: FAKE_USER.role,
    });
  });

  it('throws an error if the email does not exist', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'noexiste@example.com', password: 'cualquier' })
    ).rejects.toThrowError('Credenciales inválidas.');

    expect(mockTokenService.generateToken).not.toHaveBeenCalled();
  });

  it('throws an error if the password is incorrect', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(FAKE_USER as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      useCase.execute({ email: 'usuario@example.com', password: 'password_incorrecto' })
    ).rejects.toThrowError('Credenciales inválidas.');

    expect(mockTokenService.generateToken).not.toHaveBeenCalled();
  });
});