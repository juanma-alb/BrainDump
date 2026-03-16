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

  it('creates a note and returns id, title and createdAt', async () => {
    const result = await useCase.execute({
      userId: 'user-001',
      title: 'Product idea',
      content: 'Detailed description of the idea.',
      tags: ['product', 'idea'],
    });

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Product idea');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });

  it('the saved note has the correct userId assigned', async () => {
    await useCase.execute({
      userId: 'user-999',
      title: 'Note with owner',
      content: 'Any content.',
    });

    const savedNote = vi.mocked(mockRepository.save).mock.calls[0]?.[0];
    expect(savedNote?.userId).toBe('user-999');
  });

  it('throws an error if the title is empty', async () => {
    await expect(
      useCase.execute({ userId: 'user-001', title: '', content: 'Contenido válido.' })
    ).rejects.toThrowError('El título de una nota no puede estar vacío.');
  });
});