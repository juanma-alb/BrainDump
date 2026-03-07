/**
 * Puerto que define el contrato para el envío de correos electrónicos.
 * La capa de Infrastructure DEBE implementar esta interfaz.
 */
export interface IEmailService {
  sendPasswordResetEmail(to: string, resetToken: string, userId: string): Promise<void>;
}
