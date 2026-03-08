export type UserRole = 'USER' | 'ADMIN';

export interface UserProps {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly createdAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.username = props.username;
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
    if (!props.username || !props.username.trim()) {
      throw new Error('El username no puede estar vacío.');
    }
    if (props.username.length < 3) {
      throw new Error('El username debe tener al menos 3 caracteres.');
    }
    if (/\s/.test(props.username)) {
      throw new Error('El username no puede contener espacios.');
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
