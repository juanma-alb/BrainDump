import bcrypt from 'bcrypt';
import { User } from '@domain/entities/User';
import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { ITokenService } from '@domain/ports/ITokenService';

export interface ResetPasswordInput {
  userId: string;
  token: string;
  newPassword: string;
}

/**
 * Caso de Uso: Restablecer la contraseña de un usuario.
 * El token de reset está firmado con el hash actual de la contraseña,
 * por lo que queda invalidado automáticamente tras el cambio.
 */
export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    this.tokenService.verifyPasswordResetToken(input.token, user.passwordHash);

    const newHash = await bcrypt.hash(input.newPassword, 10);

    const updatedUser = User.create({
      ...user,
      passwordHash: newHash,
    });

    await this.userRepository.save(updatedUser);
  }
}
