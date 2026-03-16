export interface TokenPayload {
  userId: string;
  role: string;
}

/*
  Port that defines the contract for generating authentication tokens.
 */
export interface ITokenService {
  generateToken(payload: TokenPayload): string;
  generatePasswordResetToken(payload: { userId: string }, currentPasswordHash: string): string;
  verifyPasswordResetToken(token: string, currentPasswordHash: string): { userId: string };
}
