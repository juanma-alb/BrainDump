import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { User, type UserRole } from '@domain/entities/User';
import type { IUserRepository } from '@domain/ports/IUserRepository';

export interface RegisterUserInput {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * Caso de Uso: Registrar un nuevo usuario.
 * Verifica unicidad de email, encripta la contraseña y persiste la entidad.
 */
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error(`El email '${input.email}' ya está registrado.`);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = User.create({
      id: randomUUID(),
      email: input.email,
      passwordHash,
      role: input.role ?? 'USER',
      createdAt: new Date(),
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
