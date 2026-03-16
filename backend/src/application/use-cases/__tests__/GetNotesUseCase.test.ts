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

  it('passes the correct filters and default pagination values for a regular user', async () => {
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

  it('does not filter by userId if the requester has ADMIN role', async () => {
    vi.mocked(mockNoteRepository.findMany).mockResolvedValue({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await useCase.execute({
      userId: 'admin-123',
      role: 'ADMIN',
    });

    expect(mockNoteRepository.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ userId: 'admin-123' })
    );
  });

  it('passes all advanced filters (search, isFavorite, dates, tags) to the repository', async () => {
    vi.mocked(mockNoteRepository.findMany).mockResolvedValue({ items: [], total: 0, page: 2, limit: 5, totalPages: 0 });

    const testDate = new Date('2026-03-10');

    await useCase.execute({
      userId: 'user-123',
      role: 'USER',
      page: 2,
      limit: 5,
      tag: 'idea',
      isFavorite: true,
      search: 'project',
      startDate: testDate,
      endDate: testDate,
    });

    expect(mockNoteRepository.findMany).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      userId: 'user-123',
      tag: 'idea',
      isFavorite: true,
      search: 'project',
      startDate: testDate,
      endDate: testDate,
    });
  });
});