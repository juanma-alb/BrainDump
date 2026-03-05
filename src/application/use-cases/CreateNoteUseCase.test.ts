import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateNoteUseCase } from './CreateNoteUseCase';
import type { INoteRepository } from '@domain/ports/INoteRepository';

/**
 * Mock del repositorio: aislamos completamente la infraestructura.
 * Esto prueba SOLO la lógica del caso de uso.
 */
const mockRepository: INoteRepository = {
  save: vi.fn().mockResolvedValue(undefined),
  findById: vi.fn(),
  findAll: vi.fn(),
  findByTag: vi.fn(),
  delete: vi.fn(),
};

describe('CreateNoteUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('crea una nota y retorna id, title y createdAt', async () => {
    const useCase = new CreateNoteUseCase(mockRepository);

    const result = await useCase.execute({
      userId: 'user-001',
      title: 'Idea de producto',
      content: 'Descripción detallada de la idea.',
      tags: ['producto', 'idea'],
    });

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Idea de producto');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });

  it('la nota guardada tiene asignado el userId correcto', async () => {
    const useCase = new CreateNoteUseCase(mockRepository);

    await useCase.execute({
      userId: 'user-999',
      title: 'Nota con propietario',
      content: 'Contenido cualquiera.',
    });

    const savedNote = vi.mocked(mockRepository.save).mock.calls[0]?.[0];
    expect(savedNote?.userId).toBe('user-999');
  });

  it('lanza error si el título está vacío', async () => {
    const useCase = new CreateNoteUseCase(mockRepository);

    await expect(
      useCase.execute({ userId: 'user-001', title: '', content: 'Contenido válido.' })
    ).rejects.toThrowError('El título de una nota no puede estar vacío.');
  });
});
