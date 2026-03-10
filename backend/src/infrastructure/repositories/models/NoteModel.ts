import { Schema, model } from 'mongoose';

interface INoteDocument {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INoteDocument>(
  {
    id: { type: String, required: true, unique: true},
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

export const NoteModel = model<INoteDocument>('Note', noteSchema);
