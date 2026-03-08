import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { ITokenService } from '@domain/ports/ITokenService';
import type { IEmailService } from '@domain/ports/IEmailService';

export interface ForgotPasswordInput {
  email: string;
}

/**
 * Caso de Uso: Iniciar el flujo de recuperación de contraseña.
 * Si el email no existe se hace un return silencioso para evitar
 * ataques de enumeración de emails (no revelar si un correo está registrado).
 */
export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService
  ) {}

  async execute(input: ForgotPasswordInput): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      return;
    }

    const token = this.tokenService.generatePasswordResetToken(
      { userId: user.id },
      user.passwordHash
    );

    await this.emailService.sendPasswordResetEmail(user.email, token, user.id);
  }
}
