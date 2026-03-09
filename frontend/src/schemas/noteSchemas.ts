import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  content: z
    .string()
    .min(1, 'El contenido es obligatorio')
    .max(50000, 'El contenido no puede exceder 50000 caracteres'),
  tags: z
    .array(z.string().trim().min(1))
    .optional()
    .default([])
    .transform((tags) => tags.filter((tag) => tag.length > 0)),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim()
    .optional(),
  content: z
    .string()
    .min(1, 'El contenido es obligatorio')
    .max(50000, 'El contenido no puede exceder 50000 caracteres')
    .optional(),
  tags: z
    .array(z.string().trim().min(1))
    .optional()
    .transform((tags) => (tags ? tags.filter((tag) => tag.length > 0) : undefined)),
});

export type CreateNoteFormValues = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormValues = z.infer<typeof updateNoteSchema>;
