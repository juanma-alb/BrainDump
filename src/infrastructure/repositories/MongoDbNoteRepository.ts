import { Note } from '@domain/entities/Note';
import type { INoteRepository } from '@domain/ports/INoteRepository';
import { NoteModel } from './models/NoteModel';


 //Implementación de INoteRepository usando MongoDB a través de Mongoose.
 
export class MongoDbNoteRepository implements INoteRepository {
  async save(note: Note): Promise<void> {
    await NoteModel.findOneAndUpdate(
      { id: note.id },
      {
        id: note.id,
        userId: note.userId,
        title: note.title,
        content: note.content,
        tags: note.tags,
      },
      { upsert: true, new: true }
    );
  }

  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findOne({ id });
    if (!doc) return null;

    return Note.create({
      id: doc.id,
      userId: doc.userId,
      title: doc.title,
      content: doc.content,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findAll(): Promise<Note[]> {
    const docs = await NoteModel.find();
    return docs.map((doc) =>
      Note.create({
        id: doc.id,
        userId: doc.userId,
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })
    );
  }

  async findByTag(tag: string): Promise<Note[]> {
    const docs = await NoteModel.find({ tags: tag });
    return docs.map((doc) =>
      Note.create({
        id: doc.id,
        userId: doc.userId,
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })
    );
  }

  async delete(id: string): Promise<void> {
    await NoteModel.deleteOne({ id });
  }
}
