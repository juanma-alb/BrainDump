import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { INoteRepository } from '@domain/ports/INoteRepository';
import type { Note } from '@domain/entities/Note';

export interface GetNotesByUsernameInput {
  username: string;
}

export class GetNotesByUsernameUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly noteRepository: INoteRepository
  ) {}

  async execute(input: GetNotesByUsernameInput): Promise<Note[]> {
    const user = await this.userRepository.findByUsername(input.username);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.noteRepository.findByUserId(user.id);
  }
}
