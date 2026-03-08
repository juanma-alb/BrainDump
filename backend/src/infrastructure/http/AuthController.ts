import type { Request, Response } from 'express';
import type { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import type { LoginUserUseCase } from '@application/use-cases/LoginUserUseCase';
import type { ForgotPasswordUseCase } from '@application/use-cases/ForgotPasswordUseCase';
import type { ResetPasswordUseCase } from '@application/use-cases/ResetPasswordUseCase';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password, role } = req.body;
      const result = await this.registerUserUseCase.execute({ email, username, password, role });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute({ email, password });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.forgotPasswordUseCase.execute({ email });
      res.status(200).json({ message: 'Si el correo está registrado, recibirás un enlace de recuperación.' });
    } catch {
      res.status(200).json({ message: 'Si el correo está registrado, recibirás un enlace de recuperación.' });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { id, token, newPassword } = req.body;
      await this.resetPasswordUseCase.execute({ userId: id, token, newPassword });
      res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }
}
