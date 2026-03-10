import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerateNoteDraftUseCase } from '../GenerateNoteDraftUseCase';
import { createMockAiService } from '../../../tests/setup/mockRepositories';

describe('GenerateNoteDraftUseCase', () => {
  let mockAiService: ReturnType<typeof createMockAiService>;
  let useCase: GenerateNoteDraftUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAiService = createMockAiService();
    useCase = new GenerateNoteDraftUseCase(mockAiService);
  });

  it('genera contenido de borrador exitosamente usando el AiService', async () => {
    const mockHtmlResponse = '<h2>Borrador generado por IA</h2><p>Sobre React...</p>';
    vi.mocked(mockAiService.generateNoteContent).mockResolvedValue(mockHtmlResponse);

    const result = await useCase.execute({ topic: 'React Hooks' });

    expect(mockAiService.generateNoteContent).toHaveBeenCalledWith('React Hooks');
    expect(result.generatedContent).toBe(mockHtmlResponse);
  });
  
  it('permite que el error suba si el AiService falla (ej. Rate Limit o API caída)', async () => {
    vi.mocked(mockAiService.generateNoteContent).mockRejectedValue(new Error('API límite excedido'));

    await expect(useCase.execute({ topic: 'Cualquier cosa' }))
      .rejects.toThrowError('API límite excedido');
  });
});