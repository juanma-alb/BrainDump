import { CreateNoteUseCase } from '@application/use-cases/CreateNoteUseCase';
import { GetNoteByIdUseCase } from '@application/use-cases/GetNoteByIdUseCase';
import { InMemoryNoteRepository } from '@infrastructure/repositories/InMemoryNoteRepository';
import { AutoTagNoteUseCase } from '@application/use-cases/AutoTagNoteUseCase';
import { MockAiService } from '@infrastructure/ai-service/MockAiService';
/**
 * Punto de entrada: aquí se ensambla la aplicación (Composition Root).
 * Se instancian las dependencias y se las inyecta a los casos de uso.
 */
async function main(): Promise<void> {
 // Infraestructura
 const noteRepository = new InMemoryNoteRepository();
 const aiService = new MockAiService(); 

 // Casos de uso con dependencias inyectadas
 const createNote = new CreateNoteUseCase(noteRepository);
 const getNoteById = new GetNoteByIdUseCase(noteRepository);
 const autoTagNote = new AutoTagNoteUseCase(noteRepository, aiService); 

  // Flujo de ejemplo
  const created = await createNote.execute({
    title: 'Primera idea en BrainDump',
    content: 'Esta arquitectura nos permite cambiar la base de datos sin tocar el dominio.',
    tags: ['arquitectura', 'clean-code'],
  });

  console.log('Nota creada:', created);

  const note = await getNoteById.execute({ id: created.id });
  console.log('Nota recuperada:', note);

  console.log('\n--- Solicitando a la IA que etiquete la nota... ---');
  // Usamos el ID de la nota que acabamos de crear
  const tagResult = await autoTagNote.execute({ noteId: created.id });
  
  console.log('¡Etiquetado completado!');
  console.log('Nuevas etiquetas generadas:', tagResult.addedTags);
  
  // Verificamos cómo quedó la nota en la base de datos
  const updatedNote = await getNoteById.execute({ id: created.id });
  console.log('\nNota final en la base de datos:', updatedNote);
}

main().catch(console.error);
