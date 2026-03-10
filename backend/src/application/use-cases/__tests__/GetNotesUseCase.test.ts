import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNotesUseCase } from '../GetNotesUseCase';
import { createMockNoteRepository } from '../../../tests/setup/mockRepositories';

describe('GetNotesUseCase', () => {
  let mockNoteRepository: ReturnType<typeof createMockNoteRepository>;
  let useCase: GetNotesUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNoteRepository = createMockNoteRepository();
    useCase = new GetNotesUseCase(mockNoteRepository);
  });

  it('pasa los filtros correctos y valores de paginación por defecto para un usuario normal', async () => {
    const mockResult = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    vi.mocked(mockNoteRepository.findMany).mockResolvedValue(mockResult);

    const result = await useCase.execute({
      userId: 'user-123',
      role: 'USER',
    });

    expect(mockNoteRepository.findMany).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      userId: 'user-123',
      tag: undefined,
      isFavorite: undefined,
      search: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    expect(result).toEqual(mockResult);
  });

  it('no filtra por userId si el solicitante tiene rol de ADMIN', async () => {
    vi.mocked(mockNoteRepository.findMany).mockResolvedValue({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await useCase.execute({
      userId: 'admin-123',
      role: 'ADMIN',
    });

    expect(mockNoteRepository.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ userId: 'admin-123' })
    );
  });

  it('pasa todos los filtros avanzados (search, isFavorite, fechas, tags) al repositorio', async () => {
    vi.mocked(mockNoteRepository.findMany).mockResolvedValue({ items: [], total: 0, page: 2, limit: 5, totalPages: 0 });

    const testDate = new Date('2026-03-10');

    await useCase.execute({
      userId: 'user-123',
      role: 'USER',
      page: 2,
      limit: 5,
      tag: 'idea',
      isFavorite: true,
      search: 'proyecto',
      startDate: testDate,
      endDate: testDate,
    });

    expect(mockNoteRepository.findMany).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      userId: 'user-123',
      tag: 'idea',
      isFavorite: true,
      search: 'proyecto',
      startDate: testDate,
      endDate: testDate,
    });
  });
});