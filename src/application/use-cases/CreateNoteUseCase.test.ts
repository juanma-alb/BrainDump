import { describe, it, expect, vi } from 'vitest';
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
  it('crea una nota y retorna id, title y createdAt', async () => {
    const useCase = new CreateNoteUseCase(mockRepository);

    const result = await useCase.execute({
      title: 'Idea de producto',
      content: 'Descripción detallada de la idea.',
      tags: ['producto', 'idea'],
    });

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Idea de producto');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });

  it('lanza error si el título está vacío', async () => {
    const useCase = new CreateNoteUseCase(mockRepository);

    await expect(
      useCase.execute({ title: '', content: 'Contenido válido.' })
    ).rejects.toThrowError('El título de una nota no puede estar vacío.');
  });
});
