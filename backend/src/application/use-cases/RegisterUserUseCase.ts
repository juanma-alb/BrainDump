import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { User, type UserRole } from '@domain/entities/User';
import type { IUserRepository } from '@domain/ports/IUserRepository';

export interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
  role?: UserRole;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}

/*
  Use Case: Register a new user.
  Checks for unique email and username in parallel, encrypts the password, and saves the entity.
 */
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const [existingByEmail, existingByUsername] = await Promise.all([
      this.userRepository.findByEmail(input.email),
      this.userRepository.findByUsername(input.username),
    ]);

    if (existingByEmail) {
      throw new Error('El email ya está registrado.');
    }
    if (existingByUsername) {
      throw new Error('El username ya está en uso.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = User.create({
      id: randomUUID(),
      email: input.email,
      username: input.username,
      passwordHash,
      role: input.role ?? 'USER',
      createdAt: new Date(),
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
