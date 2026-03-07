import type { User } from '@domain/entities/User';

/**
 * Puerto (contrato) que define cómo la aplicación persiste y recupera usuarios.
 * La capa de Infrastructure DEBE implementar esta interfaz.
 * La regla de dependencia se respeta: el dominio no conoce la implementación concreta.
 */
export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
