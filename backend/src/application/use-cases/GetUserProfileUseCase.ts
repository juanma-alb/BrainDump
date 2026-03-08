import type { IUserRepository } from '@domain/ports/IUserRepository';
import type { UserRole } from '@domain/entities/User';

export interface GetUserProfileInput {
  username: string;
}

export interface UserProfileOutput {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserProfileInput): Promise<UserProfileOutput> {
    const user = await this.userRepository.findByUsername(input.username);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
