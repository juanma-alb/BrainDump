import { vi } from 'vitest';
import type { INoteRepository } from '@domain/ports/INoteRepository';
import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { ITokenService } from '@domain/ports/ITokenService';
import type { IEmailService } from '@domain/ports/IEmailService';
import type { IAiService } from '@domain/ports/IAiService';

export const createMockNoteRepository = (): INoteRepository => ({
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  findByUserId: vi.fn(),
  findByTag: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findMany: vi.fn(),
});

export const createMockUserRepository = (): IUserRepository => ({
  save: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  findByUsername: vi.fn(),
});

export const createMockTokenService = (): ITokenService => ({
  generateToken: vi.fn(),
  generatePasswordResetToken: vi.fn(),
  verifyPasswordResetToken: vi.fn(),
});

export const createMockEmailService = (): IEmailService => ({
  sendPasswordResetEmail: vi.fn(),
});

export const createMockAiService = (): IAiService => ({
  generateNoteContent: vi.fn(),
});

