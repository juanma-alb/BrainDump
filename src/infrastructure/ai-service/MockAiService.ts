import type { IAiService } from '@domain/ports/IAiService';

/**
 * Implementación simulada del servicio de IA.
 */
export class MockAiService implements IAiService {
  async generateTags(_content: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ['IA', 'Arquitectura'];
  }
}
