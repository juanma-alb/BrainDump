import type { Request, Response } from 'express';
import type { GetUserProfileUseCase } from '@application/use-cases/GetUserProfileUseCase';
import type { GetNotesByUsernameUseCase } from '@application/use-cases/GetNotesByUsernameUseCase';

export class AdminController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly getNotesByUsernameUseCase: GetNotesByUsernameUseCase
  ) {}

  async getUser(req: Request<{ username: string }>, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const user = await this.getUserProfileUseCase.execute({ username });
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }

  async getUserNotes(req: Request<{ username: string }>, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const notes = await this.getNotesByUsernameUseCase.execute({ username });
      res.status(200).json(notes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }
}
