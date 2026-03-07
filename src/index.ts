import 'dotenv/config';
import mongoose from 'mongoose';
import { logger } from '@infrastructure/logger/PinoLogger';
import { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import { MongoDbNoteRepository } from '@infrastructure/repositories/MongoDbNoteRepository';
import { AutoTagNoteUseCase } from '@application/use-cases/AutoTagNoteUseCase';
import { GeminiAiService } from '@infrastructure/ai-service/GeminiAiService';
import { NoteController } from '@infrastructure/http/NoteController';
import { Server } from '@infrastructure/http/Server';

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('La variable de entorno MONGODB_URI no se encuentra definida.');
  }

  await mongoose.connect(mongoUri);
  logger.info('Conexion a MongoDB establecida correctamente.');

  // Infraestructura
  const noteRepository = new MongoDbNoteRepository();
  const aiService = new GeminiAiService();

  // Casos de uso
  const createNote = new CreateNoteUseCase(noteRepository);
  const autoTagNote = new AutoTagNoteUseCase(noteRepository, aiService);

  // HTTP
  const noteController = new NoteController(createNote, autoTagNote);
  const server = new Server(noteController);

  server.start(3000);
}

main().catch((error: unknown) => {
  logger.error({ err: error }, 'Error al iniciar la app');
  process.exit(1);
});
