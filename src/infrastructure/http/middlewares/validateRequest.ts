import type { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    // Usamos safeParse en lugar de parse para evitar el try/catch
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Extraemos las 'issues' (el nombre correcto del array en Zod)
      const fields = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      
      // Devolvemos un hermoso 400 Bad Request (Culpa del cliente)
      res.status(400).json({ message: 'Validación fallida.', errors: fields });
      return; // Cortamos la ejecución aquí
    }

    // Si todo está perfecto, reemplazamos el body con los datos sanitizados por Zod
    req.body = result.data;
    next();
  };
}