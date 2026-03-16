import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet'; 
import type { NoteController } from './NoteController';
import type { AuthController } from './AuthController';
import type { AdminController } from './AdminController';
import { createNoteSchema, updateNoteSchema, generateDraftSchema } from './schemas/NoteSchemas';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './schemas/AuthSchemas';
import { validateRequest } from './middlewares/validateRequest';
import { requireAuth } from './middlewares/requireAuth';
import { requireAdmin } from './middlewares/requireAdmin';
import { aiDraftLimiter } from './middlewares/rateLimiter';
import { logger } from '@infrastructure/logger/PinoLogger';

export class Server {
  private readonly app: Express;

  constructor(
    private readonly noteController: NoteController,
    private readonly authController: AuthController,
    private readonly adminController: AdminController
  ) {
    this.app = express();
    this.app.set('trust proxy', 1);
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(helmet()); 

    const allowedOrigins = process.env.FRONTEND_URL 
      ? [process.env.FRONTEND_URL, 'http://localhost:5173'] 
      : ['http://localhost:5173'];

    this.app.use(cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.post('/api/auth/register', validateRequest(registerSchema), (req, res) => this.authController.register(req, res));
    this.app.post('/api/auth/login', validateRequest(loginSchema), (req, res) => this.authController.login(req, res));
    this.app.post('/api/auth/forgot-password', validateRequest(forgotPasswordSchema), (req, res) => this.authController.forgotPassword(req, res));
    this.app.post('/api/auth/reset-password', validateRequest(resetPasswordSchema), (req, res) => this.authController.resetPassword(req, res));
    
    this.app.get('/api/notes', requireAuth, (req, res) => this.noteController.getAll(req, res));
    this.app.post('/api/notes', requireAuth, validateRequest(createNoteSchema), (req, res) => this.noteController.create(req, res));
    this.app.post('/api/notes/draft', requireAuth, aiDraftLimiter, validateRequest(generateDraftSchema), (req, res) => this.noteController.generateDraft(req, res));
    this.app.put('/api/notes/:id', requireAuth, validateRequest(updateNoteSchema), (req: Request<{ id: string }>, res: Response) => this.noteController.update(req, res));
    this.app.delete('/api/notes/:id', requireAuth, (req: Request<{ id: string }>, res: Response) => this.noteController.delete(req, res));
    this.app.get('/api/notes/tags', requireAuth, (req, res) => this.noteController.getTags(req, res));

    this.app.get('/api/admin/users/:username', requireAuth, requireAdmin, (req: Request<{ username: string }>, res: Response) => this.adminController.getUser(req, res));
    this.app.get('/api/admin/users/:username/notes', requireAuth, requireAdmin, (req: Request<{ username: string }>, res: Response) => this.adminController.getUserNotes(req, res));


    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error({ err }, 'Error no manejado capturado en el middleware global');
      res.status(500).json({ message: 'Error interno del servidor. Por favor, contacta a soporte.' });
    });
  }

  start(port: number): void {
    this.app.listen(port, () => {
      logger.info(`Servidor escuchando en http://localhost:${port}`);
    }).on('error', (error: Error) => {
      logger.error({ err: error }, 'Error al iniciar el servidor HTTP');
    });
  }
}