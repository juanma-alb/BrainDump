import type { Request, Response } from 'express';
import type { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import type { AutoTagNoteUseCase } from '@application/use-cases/AutoTagNoteUseCase';
import type { GetNotesUseCase } from '@application/use-cases/GetNotesUseCase';
import type { UpdateNoteUseCase } from '@application/use-cases/UpdateNoteUseCase';
import type { DeleteNoteUseCase } from '@application/use-cases/DeleteNoteUseCase';
import type { GenerateNoteDraftUseCase } from '@application/use-cases/GenerateNoteDraftUseCase';

export class NoteController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly autoTagNoteUseCase: AutoTagNoteUseCase,
    private readonly getNotesUseCase: GetNotesUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
    private readonly generateNoteDraftUseCase: GenerateNoteDraftUseCase
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

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const notes = await this.getNotesUseCase.execute({ userId, role });
      res.status(200).json(notes);
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

  async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const noteId = req.params.id;
      const userId = req.user!.id;
      const { title, content, tags } = req.body;
      const result = await this.updateNoteUseCase.execute({ noteId, userId, title, content, tags });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }

  async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const noteId = req.params.id;
      const userId = req.user!.id;
      const role = req.user!.role;
      await this.deleteNoteUseCase.execute({ noteId, userId, role });
      res.status(200).json({ message: 'Nota eliminada correctamente.' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }

  async generateDraft(req: Request, res: Response): Promise<void> {
    try {
      const { topic } = req.body;
      const result = await this.generateNoteDraftUseCase.execute({ topic });
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
