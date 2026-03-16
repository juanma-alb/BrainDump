import type { IEmailService } from '@domain/ports/IEmailService';
import { logger } from '@infrastructure/logger/PinoLogger';

export class BrevoEmailService implements IEmailService {
  private readonly apiKey: string;
  private readonly senderEmail: string;

  constructor() {
    this.apiKey = (process.env.BREVO_API_KEY || '').trim();
    this.senderEmail = process.env.SMTP_USER || 'noreply.4uth.system@gmail.com';

    if (!this.apiKey) {
      logger.error('Falta la variable de entorno BREVO_API_KEY.');
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string, userId: string): Promise<void> {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&id=${userId}`;
    const senderName = 'BrainDump App';

    const payload = {
      sender: {
        name: senderName,
        email: this.senderEmail
      },
      to: [
        { email: to }
      ],
      subject: 'Recuperación de contraseña - BrainDump',
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #8b5cf6;">Restablecer contraseña</h2>
          <p>Hola,</p>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en BrainDump.</p>
          <p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Restablecer mi contraseña</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">Este enlace expirará en 15 minutos. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
        </div>
      `
    };

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error de Brevo: ${JSON.stringify(errorData)}`);
      }

      logger.info(`Correo de recuperación enviado por API HTTP a: ${to}`);
    } catch (error) {
      logger.error({ err: error }, `Error crítico al enviar correo a: ${to}`);
      throw new Error('No se pudo enviar el correo electrónico mediante la API.');
    }
  }
}