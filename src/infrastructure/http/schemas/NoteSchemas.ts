import { z } from 'zod';

export const createNoteSchema = z.object({
  userId: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
});
