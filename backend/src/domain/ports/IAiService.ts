/*
  Puerto que define el contrato con cualquier proveedor de IA.
 */
export interface IAiService {
  generateNoteContent(topic: string): Promise<string>;
}
