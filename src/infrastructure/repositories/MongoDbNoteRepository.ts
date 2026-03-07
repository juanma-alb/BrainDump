import { Note } from '@domain/entities/Note';
import type { INoteRepository, NoteFilters, PaginatedResult } from '@domain/ports/INoteRepository';
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

  async findByUserId(userId: string): Promise<Note[]> {
    const docs = await NoteModel.find({ userId });
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

  async update(note: Note): Promise<void> {
    await NoteModel.updateOne(
      { id: note.id },
      {
        title: note.title,
        content: note.content,
        tags: note.tags,
        updatedAt: note.updatedAt,
      }
    );
  }

  async delete(id: string): Promise<void> {
    await NoteModel.deleteOne({ id });
  }

  async findMany(filters: NoteFilters): Promise<PaginatedResult<Note>> {
    const query: Record<string, unknown> = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.tag) query.tags = filters.tag;

    const skip = (filters.page - 1) * filters.limit;

    const [docs, total] = await Promise.all([
      NoteModel.find(query).skip(skip).limit(filters.limit).sort({ createdAt: -1 }),
      NoteModel.countDocuments(query),
    ]);

    const items = docs.map((doc) =>
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

    return {
      items,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }
}
