import type { RequestHandler } from 'express';
import { type ZodTypeAny } from 'zod';

export function validateRequest(schema: ZodTypeAny): RequestHandler {  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fields = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      
      res.status(400).json({ message: 'Validación fallida.', errors: fields });
      return; 
    }

    req.body = result.data;
    next();
  };
}