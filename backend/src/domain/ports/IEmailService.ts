/*
  Port that defines the contract for sending emails.
 */
export interface IEmailService {
  sendPasswordResetEmail(to: string, resetToken: string, userId: string): Promise<void>;
}
