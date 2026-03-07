import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import type { NoteController } from './NoteController';
import { createNoteSchema } from './schemas/NoteSchemas';
import { validateRequest } from './middlewares/validateRequest';
import { requireAuth } from './middlewares/requireAuth';
import jwt from 'jsonwebtoken';
import { logger } from '@infrastructure/logger/PinoLogger';

export class Server {
  private readonly app: Express;

  constructor(private readonly noteController: NoteController) {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.get('/api/auth/dev-token', (req, res) => {
      const secret = process.env['JWT_SECRET'] || 'default_secret';
      const token = jwt.sign({ userId: 'user-demo-001' }, secret, { expiresIn: '1h' });
      res.json({ token });
    });
    this.app.post('/api/notes', requireAuth, validateRequest(createNoteSchema), (req, res) => this.noteController.create(req, res));
    this.app.post('/api/notes/:id/tags', requireAuth, (req: Request<{ id: string }>, res: Response) => this.noteController.autoTag(req, res));  }

  start(port: number): void {
    this.app.listen(port, () => {
      logger.info(`Servidor escuchando en http://localhost:${port}`);
    }).on('error', (error: Error) => {
      logger.error({ err: error }, 'Error al iniciar el servidor HTTP');
    });
  }
}
