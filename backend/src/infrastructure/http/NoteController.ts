import type { Request, Response } from 'express';
import type { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import type { GetNotesUseCase } from '@application/use-cases/GetNotesUseCase';
import type { UpdateNoteUseCase } from '@application/use-cases/UpdateNoteUseCase';
import type { DeleteNoteUseCase } from '@application/use-cases/DeleteNoteUseCase';
import type { GenerateNoteDraftUseCase } from '@application/use-cases/GenerateNoteDraftUseCase';

export class NoteController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
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

      const pageNum = Number(req.query.page);
      const limitNum = Number(req.query.limit);
      const tag = req.query.tag as string | undefined;

      const search = req.query.search as string | undefined;
      const isFavoriteQuery = req.query.isFavorite as string | undefined;
      const startDateString = req.query.startDate as string | undefined;
      const endDateString = req.query.endDate as string | undefined;

      const page = !isNaN(pageNum) && pageNum > 0 ? pageNum : undefined;
      const limit = !isNaN(limitNum) && limitNum > 0 ? limitNum : undefined;
      
      let isFavorite: boolean | undefined = undefined;
      if (isFavoriteQuery === 'true') isFavorite = true;
      if (isFavoriteQuery === 'false') isFavorite = false;

      const startDate = startDateString ? new Date(startDateString) : undefined;
      const endDate = endDateString ? new Date(endDateString) : undefined;

      const result = await this.getNotesUseCase.execute({ 
        userId, 
        role, 
        page, 
        limit, 
        tag,
        search,
        isFavorite,
        startDate,
        endDate
      });
      
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
      const { title, content, tags, isFavorite } = req.body; 
      
      const result = await this.updateNoteUseCase.execute({ 
        noteId, 
        userId, 
        title, 
        content, 
        tags, 
        isFavorite
      });
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