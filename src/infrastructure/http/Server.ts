import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import type { NoteController } from './NoteController';
import type { AuthController } from './AuthController';
import { createNoteSchema, updateNoteSchema } from './schemas/NoteSchemas';
import { registerSchema, loginSchema } from './schemas/AuthSchemas';
import { validateRequest } from './middlewares/validateRequest';
import { requireAuth } from './middlewares/requireAuth';
import { logger } from '@infrastructure/logger/PinoLogger';

export class Server {
  private readonly app: Express;

  constructor(
    private readonly noteController: NoteController,
    private readonly authController: AuthController
  ) {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.post('/api/auth/register', validateRequest(registerSchema), (req, res) => this.authController.register(req, res));
    this.app.post('/api/auth/login', validateRequest(loginSchema), (req, res) => this.authController.login(req, res));
    this.app.get('/api/notes', requireAuth, (req, res) => this.noteController.getAll(req, res));
    this.app.post('/api/notes', requireAuth, validateRequest(createNoteSchema), (req, res) => this.noteController.create(req, res));
    this.app.post('/api/notes/:id/tags', requireAuth, (req: Request<{ id: string }>, res: Response) => this.noteController.autoTag(req, res));
    this.app.put('/api/notes/:id', requireAuth, validateRequest(updateNoteSchema), (req: Request<{ id: string }>, res: Response) => this.noteController.update(req, res));
    this.app.delete('/api/notes/:id', requireAuth, (req: Request<{ id: string }>, res: Response) => this.noteController.delete(req, res));
  }

  start(port: number): void {
    this.app.listen(port, () => {
      logger.info(`Servidor escuchando en http://localhost:${port}`);
    }).on('error', (error: Error) => {
      logger.error({ err: error }, 'Error al iniciar el servidor HTTP');
    });
  }
}
