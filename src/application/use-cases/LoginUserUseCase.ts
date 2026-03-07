import bcrypt from 'bcrypt';
import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { ITokenService } from '@domain/ports/ITokenService';

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  token: string;
}

/**
 * Caso de Uso: Autenticar un usuario existente.
 * Usa un mensaje de error genérico para no revelar si el email existe.
 */
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Credenciales inválidas.');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new Error('Credenciales inválidas.');
    }

    const token = this.tokenService.generateToken({
      userId: user.id,
      role: user.role,
    });

    return { token };
  }
}
