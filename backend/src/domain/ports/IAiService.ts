/*
  Port that defines the contract with any AI provider.
 */
export interface IAiService {
  generateNoteContent(topic: string): Promise<string>;
}
