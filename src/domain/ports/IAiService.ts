/*
  Puerto que define el contrato con cualquier proveedor de IA.
 */
export interface IAiService {
  generateTags(content: string): Promise<string[]>;
}
