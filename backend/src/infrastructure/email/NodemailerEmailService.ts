import nodemailer from 'nodemailer';
import type { IEmailService } from '@domain/ports/IEmailService';
import { logger } from '@infrastructure/logger/PinoLogger';

export class NodemailerEmailService implements IEmailService {
  private transporterPromise: Promise<nodemailer.Transporter>;

  constructor() {
    this.transporterPromise = this.createTransporter();
  }

  private async createTransporter(): Promise<nodemailer.Transporter> {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string, userId: string): Promise<void> {
    const transporter = await this.transporterPromise;

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&id=${userId}`;

    const info = await transporter.sendMail({
      from: '"BrainDump App" <no-reply@braindump.dev>',
      to,
      subject: 'Recuperación de contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n${resetLink}\n\nEste enlace expirará en 15 minutos.`,
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p><strong>Este enlace expirará en 15 minutos.</strong></p>
      `,
    });

    logger.info(`Correo de recuperación enviado a: ${to}`);
    logger.info(`URL de previsualización (Ethereal): ${nodemailer.getTestMessageUrl(info)}`);
  }
}
