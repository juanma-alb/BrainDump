import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUserUseCase } from '../LoginUserUseCase';
import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { ITokenService } from '@domain/ports/ITokenService';


vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}));

import bcrypt from 'bcrypt';

const FAKE_USER = {
  id: 'user-001',
  email: 'usuario@example.com',
  passwordHash: '$2b$10$hash_simulado',
  role: 'USER' as const,
  createdAt: new Date(),
};

const mockUserRepository: IUserRepository = {
  save: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  findByUsername: vi.fn()
};

const mockTokenService: ITokenService = {
  generateToken: vi.fn().mockReturnValue('jwt.token.simulado'),
};

describe('LoginUserUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockTokenService.generateToken).mockReturnValue('jwt.token.simulado');
  });

  it('devuelve un token cuando las credenciales son correctas', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(FAKE_USER as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const useCase = new LoginUserUseCase(mockUserRepository, mockTokenService);
    const result = await useCase.execute({
      email: 'usuario@example.com',
      password: 'password_correcto',
    });

    expect(result.token).toBe('jwt.token.simulado');
    expect(mockTokenService.generateToken).toHaveBeenCalledWith({
      userId: FAKE_USER.id,
      role: FAKE_USER.role,
    });
  });

  it('lanza error si el email no existe', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    const useCase = new LoginUserUseCase(mockUserRepository, mockTokenService);

    await expect(
      useCase.execute({ email: 'noexiste@example.com', password: 'cualquier' })
    ).rejects.toThrowError('Credenciales inválidas.');

    expect(mockTokenService.generateToken).not.toHaveBeenCalled();
  });

  it('lanza error si el password es incorrecto', async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(FAKE_USER as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const useCase = new LoginUserUseCase(mockUserRepository, mockTokenService);

    await expect(
      useCase.execute({ email: 'usuario@example.com', password: 'password_incorrecto' })
    ).rejects.toThrowError('Credenciales inválidas.');

    expect(mockTokenService.generateToken).not.toHaveBeenCalled();
  });
});
