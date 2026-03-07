import jwt from 'jsonwebtoken';
import type { ITokenService, TokenPayload } from '@domain/ports/ITokenService';

export class JwtTokenService implements ITokenService {
  private readonly secret: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('La variable de entorno JWT_SECRET no está definida.');
    }
    this.secret = secret;
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }
}
