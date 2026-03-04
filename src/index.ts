import { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import { GetNoteByIdUseCase } from '@application/use-cases/GetNoteByIdUseCase';
import { InMemoryNoteRepository } from '@infrastructure/repositories/InMemoryNoteRepository';

/**
 * Punto de entrada: aquí se ensambla la aplicación (Composition Root).
 * Se instancian las dependencias y se las inyecta a los casos de uso.
 */
async function main(): Promise<void> {
  // Infraestructura
  const noteRepository = new InMemoryNoteRepository();

  // Casos de uso con dependencias inyectadas
  const createNote = new CreateNoteUseCase(noteRepository);
  const getNoteById = new GetNoteByIdUseCase(noteRepository);

  // Flujo de ejemplo
  const created = await createNote.execute({
    title: 'Primera idea en BrainDump',
    content: 'Esta arquitectura nos permite cambiar la base de datos sin tocar el dominio.',
    tags: ['arquitectura', 'clean-code'],
  });

  console.log('Nota creada:', created);

  const note = await getNoteById.execute({ id: created.id });
  console.log('Nota recuperada:', note);
}

main().catch(console.error);
