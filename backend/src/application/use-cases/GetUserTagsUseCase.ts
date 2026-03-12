import type { INoteRepository } from '@domain/ports/INoteRepository';

export class GetUserTagsUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(userId: string): Promise<string[]> {
    if (!userId) {
      throw new Error('El ID de usuario es requerido.');
    }
    return await this.noteRepository.getUserTags(userId);
  }
}