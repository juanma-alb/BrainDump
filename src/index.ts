import { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import { InMemoryNoteRepository } from '@infrastructure/repositories/InMemoryNoteRepository';
import { AutoTagNoteUseCase } from '@application/use-cases/AutoTagNoteUseCase';
import { GeminiAiService } from '@infrastructure/ai-service/GeminiAiService';
import { NoteController } from '@infrastructure/http/NoteController';
import { Server } from '@infrastructure/http/Server';

// Infraestructura
const noteRepository = new InMemoryNoteRepository();
const aiService = new GeminiAiService();

// Casos de uso
const createNote = new CreateNoteUseCase(noteRepository);
const autoTagNote = new AutoTagNoteUseCase(noteRepository, aiService);

// HTTP
const noteController = new NoteController(createNote, autoTagNote);
const server = new Server(noteController);

server.start(3000);
