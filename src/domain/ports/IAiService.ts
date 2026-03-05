/**
 * Puerto que define el contrato con cualquier proveedor de IA.
 * Application depende de esta abstracción, nunca de una SDK concreta
 * (OpenAI, Anthropic, Gemini, etc.).
 */
export interface IAiService {
  generateTags(content: string): Promise<string[]>;
}
