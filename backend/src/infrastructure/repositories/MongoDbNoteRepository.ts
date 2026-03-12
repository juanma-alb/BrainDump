import { Note } from '@domain/entities/Note';
import type { INoteRepository, NoteFilters, PaginatedResult } from '@domain/ports/INoteRepository';
import { NoteModel } from './models/NoteModel';

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
        isFavorite: note.isFavorite,
      },
      { upsert: true, new: true }
    );
  }

  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findOne({ id });
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async findAll(): Promise<Note[]> {
    const docs = await NoteModel.find();
    return docs.map(this.mapToDomain);
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const docs = await NoteModel.find({ userId });
    return docs.map(this.mapToDomain);
  }

  async findByTag(tag: string): Promise<Note[]> {
    const docs = await NoteModel.find({ tags: tag });
    return docs.map(this.mapToDomain);
  }

  async getUserTags(userId: string): Promise<string[]> {
    const tags = await NoteModel.distinct('tags', { userId });
    return tags.sort((a, b) => a.localeCompare(b)); 
  }

  async update(note: Note): Promise<void> {
    await NoteModel.updateOne(
      { id: note.id },
      {
        title: note.title,
        content: note.content,
        tags: note.tags,
        isFavorite: note.isFavorite,
        updatedAt: note.updatedAt,
      }
    );
  }

  async delete(id: string): Promise<void> {
    await NoteModel.deleteOne({ id });
  }

  async findMany(filters: NoteFilters): Promise<PaginatedResult<Note>> {
    const query: Record<string, any> = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.tag) query.tags = filters.tag;
    if (filters.isFavorite !== undefined) query.isFavorite = filters.isFavorite;

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [docs, total] = await Promise.all([
      NoteModel.aggregate([
        { $match: query },
        { $sort: { isFavorite: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: filters.limit },
        {
          $lookup: {
            from: 'users', 
            localField: 'userId',
            foreignField: 'id',
            as: 'userDoc'
          }
        },
        {
          $unwind: {
            path: '$userDoc',
            preserveNullAndEmptyArrays: true 
          }
        },
        {
          $addFields: {
            authorUsername: '$userDoc.username' 
          }
        }
      ]),
      NoteModel.countDocuments(query),
    ]);

    const items = docs.map(this.mapToDomain);

    return {
      items,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  // auxiliar DRY
  private mapToDomain(doc: any): Note {
    return Note.create({
      id: doc.id,
      userId: doc.userId,
      title: doc.title,
      content: doc.content,
      tags: doc.tags,
      isFavorite: doc.isFavorite ?? false,
      authorUsername: doc.authorUsername,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}