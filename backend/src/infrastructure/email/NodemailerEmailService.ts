import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import type { IEmailService } from '@domain/ports/IEmailService';
import { logger } from '@infrastructure/logger/PinoLogger';

dotenv.config();

export class NodemailerEmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    console.log(`\n [Email Service] Iniciando conexión SMTP...`);
    console.log(`   Host: ${SMTP_HOST}`);
    console.log(`   User: ${SMTP_USER}`);

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      logger.error('Faltan credenciales SMTP en las variables de entorno.');
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      family: 4, 
      
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false 
      }
    }as any);
  }

  async sendPasswordResetEmail(to: string, resetToken: string, userId: string): Promise<void> {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&id=${userId}`;
    const from = process.env.EMAIL_FROM || '"BrainDump App" <no-reply@braindump.dev>';

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Recuperación de contraseña - BrainDump',
        html: `
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
        `,
      });

      logger.info(`Correo de recuperación enviado exitosamente a: ${to}`);
    } catch (error) {
      logger.error({ err: error }, `Error al enviar correo a: ${to}`);
      throw new Error('No se pudo enviar el correo electrónico.');
    }
  }
}