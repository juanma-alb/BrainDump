import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateNoteUseCase } from '../CreateNoteUseCase';
import { createMockNoteRepository } from '../../../tests/setup/mockRepositories';

describe('CreateNoteUseCase', () => {
  let mockRepository: ReturnType<typeof createMockNoteRepository>;
  let useCase: CreateNoteUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockNoteRepository();
    useCase = new CreateNoteUseCase(mockRepository);
  });

  it('crea una nota y retorna id, title y createdAt', async () => {
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
    await useCase.execute({
      userId: 'user-999',
      title: 'Nota con propietario',
      content: 'Contenido cualquiera.',
    });

    // Verificamos qué se le pasó al método save del repositorio
    const savedNote = vi.mocked(mockRepository.save).mock.calls[0]?.[0];
    expect(savedNote?.userId).toBe('user-999');
  });

  it('lanza error si el título está vacío', async () => {
    await expect(
      useCase.execute({ userId: 'user-001', title: '', content: 'Contenido válido.' })
    ).rejects.toThrowError('El título de una nota no puede estar vacío.');
  });
});