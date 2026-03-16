import 'dotenv/config';
import mongoose from 'mongoose';
import { logger } from '@infrastructure/logger/PinoLogger';
import { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import { GetNotesUseCase } from '@application/use-cases/GetNotesUseCase';
import { UpdateNoteUseCase } from '@application/use-cases/UpdateNoteUseCase';
import { DeleteNoteUseCase } from '@application/use-cases/DeleteNoteUseCase';
import { MongoDbNoteRepository } from '@infrastructure/repositories/MongoDbNoteRepository';
import { GeminiAiService } from '@infrastructure/ai-service/GeminiAiService';
import { NoteController } from '@infrastructure/http/NoteController';
import { MongoDbUserRepository } from '@infrastructure/repositories/MongoDbUserRepository';
import { JwtTokenService } from '@infrastructure/auth/JwtTokenService';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '@application/use-cases/LoginUserUseCase';
import { AuthController } from '@infrastructure/http/AuthController';
import { AdminController } from '@infrastructure/http/AdminController';
import { GetUserProfileUseCase } from '@application/use-cases/GetUserProfileUseCase';
import { GetNotesByUsernameUseCase } from '@application/use-cases/GetNotesByUsernameUseCase';
import { GenerateNoteDraftUseCase } from '@application/use-cases/GenerateNoteDraftUseCase';
import { ForgotPasswordUseCase } from '@application/use-cases/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '@application/use-cases/ResetPasswordUseCase';
import { BrevoEmailService } from '@infrastructure/email/BrevoEmailService';
import { Server } from '@infrastructure/http/Server';
import { GetUserTagsUseCase } from '@application/use-cases/GetUserTagsUseCase';

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('La variable de entorno MONGODB_URI no se encuentra definida.');
  }

  await mongoose.connect(mongoUri);
  logger.info('Conexion a MongoDB establecida correctamente.');

  // Infrastructure
  const noteRepository = new MongoDbNoteRepository();
  const userRepository = new MongoDbUserRepository();
  const aiService = new GeminiAiService();
  const tokenService = new JwtTokenService();
  const emailService = new BrevoEmailService();

  // Use Cases
  const createNote = new CreateNoteUseCase(noteRepository);
  const getNotes = new GetNotesUseCase(noteRepository);
  const updateNote = new UpdateNoteUseCase(noteRepository);
  const deleteNote = new DeleteNoteUseCase(noteRepository);
  const getTags = new GetUserTagsUseCase(noteRepository);
  const registerUser = new RegisterUserUseCase(userRepository);
  const loginUser = new LoginUserUseCase(userRepository, tokenService);
  const getUserProfile = new GetUserProfileUseCase(userRepository);
  const getNotesByUsername = new GetNotesByUsernameUseCase(userRepository, noteRepository);
  const generateNoteDraft = new GenerateNoteDraftUseCase(aiService);
  const forgotPassword = new ForgotPasswordUseCase(userRepository, tokenService, emailService);
  const resetPassword = new ResetPasswordUseCase(userRepository, tokenService);

  // HTTP
  const noteController = new NoteController(createNote,  getNotes, updateNote, deleteNote, generateNoteDraft, getTags);
  const authController = new AuthController(registerUser, loginUser, forgotPassword, resetPassword);
  const adminController = new AdminController(getUserProfile, getNotesByUsername);
  const server = new Server(noteController, authController, adminController);

  server.start(3000);
}

main().catch((error: unknown) => {
  logger.error({ err: error }, 'Error al iniciar la app');
  process.exit(1);
});
