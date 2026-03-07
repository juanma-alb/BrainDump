import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'El email no tiene un formato válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'El email no tiene un formato válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});
