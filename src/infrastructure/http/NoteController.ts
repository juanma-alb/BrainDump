import type { Request, Response } from 'express';
import type { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import type { AutoTagNoteUseCase } from '@application/use-cases/AutoTagNoteUseCase';

export class NoteController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly autoTagNoteUseCase: AutoTagNoteUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { title, content, tags } = req.body;
      const result = await this.createNoteUseCase.execute({ userId, title, content, tags });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }

  async autoTag(req: Request<{ id: string }>, res: Response): Promise<void> {    
    try {
      const { id: noteId } = req.params;
      if (!noteId) {
        res.status(400).json({ message: 'El ID de la nota es requerido en la URL.' });
        return;
      }
      const result = await this.autoTagNoteUseCase.execute({ noteId });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }
}
