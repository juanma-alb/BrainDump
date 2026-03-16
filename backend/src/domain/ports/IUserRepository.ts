import type { User } from '@domain/entities/User';

/*
  Port (contract) that defines how the application persists and retrieves users.
 */
export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
