export type UserRole = 'USER' | 'ADMIN';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly createdAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }

  static create(props: UserProps): User {
    if (!props.email.trim()) {
      throw new Error('El email del usuario no puede estar vacío.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(props.email)) {
      throw new Error('El formato del email no es válido.');
    }
    if (!props.passwordHash.trim()) {
      throw new Error('El hash de la contraseña no puede estar vacío.');
    }
    if (props.role !== 'USER' && props.role !== 'ADMIN') {
      throw new Error("El rol debe ser 'USER' o 'ADMIN'.");
    }
    return new User(props);
  }
}
