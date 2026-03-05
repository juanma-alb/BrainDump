import type { IAiService } from '@domain/ports/IAiService';

/**
 * Implementación simulada del servicio de IA.
 * Útil para desarrollo local y demos sin necesitar una API key real.
 * En producción se reemplaza por OpenAiService, AnthropicAiService, etc.
 * sin modificar nada en Domain ni Application.
 */
export class MockAiService implements IAiService {
  async generateTags(_content: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ['IA', 'Arquitectura'];
  }
}
