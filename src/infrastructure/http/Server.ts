import express, { type Express } from 'express';
import cors from 'cors';
import type { NoteController } from './NoteController';

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
    this.app.post('/api/notes', (req, res) => this.noteController.create(req, res));
    this.app.post('/api/notes/:id/tags', (req, res) => this.noteController.autoTag(req, res));
  }

  start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  }
}
