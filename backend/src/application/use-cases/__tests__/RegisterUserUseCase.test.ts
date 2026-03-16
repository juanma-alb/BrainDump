import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUserUseCase } from '../RegisterUserUseCase';
import { createMockUserRepository } from '../../../tests/setup/mockRepositories';
import bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password_mock'),
  },
}));

describe('RegisterUserUseCase', () => {
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = createMockUserRepository();
    useCase = new RegisterUserUseCase(mockUserRepository);
  });

  it('registers a new user and returns the data without the password', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(null);

    const result = await useCase.execute({
      username: 'nuevo_usuario',
      email: 'nuevo@example.com',
      password: 'password123',
    });

    expect(mockUserRepository.save).toHaveBeenCalledOnce();
    expect(result.email).toBe('nuevo@example.com');
    expect(result.role).toBe('USER');
    expect(result.id).toBeDefined();
    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('throws an error if the email is already registered', async () => {
    const existingUser = {
      id: 'user-existing',
      email: 'duplicado@example.com',
      passwordHash: 'hash_existente',
      role: 'USER' as const,
      createdAt: new Date(),
    };
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser as any);
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'duplicado@example.com', password: 'cualquier', username: 'nuevo_usuario' })
    ).rejects.toThrowError('El email ya está registrado.');

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('throws an error if the username is already in use', async () => {
    const existingUser = {
      id: 'user-existing',
      username: 'duplicado_user',
      passwordHash: 'hash_existente',
      role: 'USER' as const,
      createdAt: new Date(),
    };
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(existingUser as any);

    await expect(
      useCase.execute({ email: 'nuevo@example.com', password: 'cualquier', username: 'duplicado_user' })
    ).rejects.toThrowError('El username ya está en uso.');

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});