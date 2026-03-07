import 'dotenv/config';
import mongoose from 'mongoose';
import { logger } from '@infrastructure/logger/PinoLogger';
import { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import { MongoDbNoteRepository } from '@infrastructure/repositories/MongoDbNoteRepository';
import { AutoTagNoteUseCase } from '@application/use-cases/AutoTagNoteUseCase';
import { GeminiAiService } from '@infrastructure/ai-service/GeminiAiService';
import { NoteController } from '@infrastructure/http/NoteController';
import { MongoDbUserRepository } from '@infrastructure/repositories/MongoDbUserRepository';
import { JwtTokenService } from '@infrastructure/auth/JwtTokenService';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '@application/use-cases/LoginUserUseCase';
import { AuthController } from '@infrastructure/http/AuthController';
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
  const userRepository = new MongoDbUserRepository();
  const aiService = new GeminiAiService();
  const tokenService = new JwtTokenService();

  // Casos de uso
  const createNote = new CreateNoteUseCase(noteRepository);
  const autoTagNote = new AutoTagNoteUseCase(noteRepository, aiService);
  const registerUser = new RegisterUserUseCase(userRepository);
  const loginUser = new LoginUserUseCase(userRepository, tokenService);

  // HTTP
  const noteController = new NoteController(createNote, autoTagNote);
  const authController = new AuthController(registerUser, loginUser);
  const server = new Server(noteController, authController);

  server.start(3000);
}

main().catch((error: unknown) => {
  logger.error({ err: error }, 'Error al iniciar la app');
  process.exit(1);
});
