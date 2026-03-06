import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomJwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autorizado: token no proporcionado.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'No autorizado: token malformado.' });
    return;
  }

  const secret = process.env['JWT_SECRET'];

  if (!secret) {
    res.status(500).json({ message: 'Error de configuración: JWT_SECRET no definido.' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as unknown as CustomJwtPayload;
    
    if (payload && payload.userId) {
      req.user = { id: payload.userId };
      next();
    } else {
      throw new Error('El token no contiene un userId válido');
    }
  } catch {
    res.status(401).json({ message: 'No autorizado: token inválido o expirado.' });
  }
}