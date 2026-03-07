export interface TokenPayload {
  userId: string;
  role: string;
}

/**
 * Puerto que define el contrato para la generación de tokens de autenticación.
 * La capa de Infrastructure DEBE implementar esta interfaz.
 */
export interface ITokenService {
  generateToken(payload: TokenPayload): string;
}
