import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IAiService } from '@domain/ports/IAiService';

dotenv.config();

export class GeminiAiService implements IAiService {
  private readonly model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor() {
    const apiKey = process.env['GEMINI_API_KEY'];

    if (!apiKey) {
      throw new Error('La variable de entorno GEMINI_API_KEY no está definida.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateNoteContent(topic: string): Promise<string> {
    const prompt = `Actúa como un asistente experto. Escribe un borrador claro y estructurado sobre el siguiente tema: "${topic}". Máximo 250 palabras.`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text().trim();
    } catch {
      throw new Error('No se pudo generar el contenido');
    }
  }

  async generateTags(content: string): Promise<string[]> {
    const prompt = `Lee el siguiente texto y extrae máximo 3 etiquetas clave.
Devuelve ÚNICAMENTE un array de strings en formato JSON válido, sin texto adicional ni formato markdown.

Texto: "${content}"`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().trim();
      const parsed: unknown = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item): item is string => typeof item === 'string');
    } catch {
      return [];
    }
  }
}
