import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'El email no tiene un formato válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'El email no tiene un formato válido.' }),
  username: z
    .string()
    .min(3, { message: 'El username debe tener al menos 3 caracteres.' })
    .regex(/^\S+$/, { message: 'El username no puede contener espacios.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'El email no tiene un formato válido.' }),
});

export const resetPasswordFormSchema = z.object({
  newPassword: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
