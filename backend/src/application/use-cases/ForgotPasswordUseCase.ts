import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { ITokenService } from '@domain/ports/ITokenService';
import type { IEmailService } from '@domain/ports/IEmailService';

export interface ForgotPasswordInput {
  email: string;
}

/*
  Use Case: Initiate the password recovery process.
  If the email address does not exist, a silent return is performed to prevent
  email enumeration attacks (do not reveal whether an email address is registered).
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
