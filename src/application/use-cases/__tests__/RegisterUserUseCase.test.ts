import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUserUseCase } from '../RegisterUserUseCase';
import type { IUserRepository } from '@domain/ports/IUserRepository';


vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password_mock'),
  },
}));

const mockUserRepository: IUserRepository = {
  save: vi.fn().mockResolvedValue(undefined),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  findByUsername: vi.fn(),
};

describe('RegisterUserUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registra un usuario nuevo y devuelve los datos sin el password', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    const useCase = new RegisterUserUseCase(mockUserRepository);
    const result = await useCase.execute({
      username: 'nuevo_usuario',
      email: 'nuevo@example.com',
      password: 'password123',
    });

    expect(mockUserRepository.save).toHaveBeenCalledOnce();
    expect(result.email).toBe('nuevo@example.com');
    expect(result.role).toBe('USER');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('lanza error si el email ya está registrado', async () => {
    const existingUser = {
      id: 'user-existing',
      email: 'duplicado@example.com',
      passwordHash: 'hash_existente',
      role: 'USER' as const,
      createdAt: new Date(),
    };
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser as any);

    const useCase = new RegisterUserUseCase(mockUserRepository);

    await expect(
      useCase.execute({ email: 'duplicado@example.com', password: 'cualquier', username: 'nuevo_usuario' })
    ).rejects.toThrowError("ya está registrado");

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
