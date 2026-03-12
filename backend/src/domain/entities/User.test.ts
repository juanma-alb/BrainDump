import { describe, it, expect } from 'vitest';
import { User } from './User';
import type { UserRole } from './User';

const validUserProps = {
  id: 'usr-001',
  email: 'test@braindump.com',
  username: 'johndoe',
  passwordHash: 'hashed_super_secret_password',
  role: 'USER' as UserRole,
  createdAt: new Date('2026-03-12'),
};

describe('User Entity', () => {
  it('crea un usuario válido con todos los campos correctos', () => {
    const user = User.create(validUserProps);
    expect(user.id).toBe('usr-001');
    expect(user.email).toBe('test@braindump.com');
    expect(user.username).toBe('johndoe');
    expect(user.role).toBe('USER');
  });

  it('crea un usuario administrador correctamente', () => {
    const adminProps = { ...validUserProps, role: 'ADMIN' as UserRole };
    const admin = User.create(adminProps);
    expect(admin.role).toBe('ADMIN');
  });

  it('lanza error si el email está vacío', () => {
    expect(() => User.create({ ...validUserProps, email: '   ' })).toThrowError(
      'El email del usuario no puede estar vacío.'
    );
  });

  it('lanza error si el formato del email no es válido', () => {
    expect(() => User.create({ ...validUserProps, email: 'correo-sin-arroba.com' })).toThrowError(
      'El formato del email no es válido.'
    );
  });

  it('lanza error si el username está vacío', () => {
    expect(() => User.create({ ...validUserProps, username: '' })).toThrowError(
      'El username no puede estar vacío.'
    );
  });

  it('lanza error si el username tiene menos de 3 caracteres', () => {
    expect(() => User.create({ ...validUserProps, username: 'ab' })).toThrowError(
      'El username debe tener al menos 3 caracteres.'
    );
  });

  it('lanza error si el username contiene espacios', () => {
    expect(() => User.create({ ...validUserProps, username: 'john doe' })).toThrowError(
      'El username no puede contener espacios.'
    );
  });

  it('lanza error si el hash de la contraseña está vacío', () => {
    expect(() => User.create({ ...validUserProps, passwordHash: '   ' })).toThrowError(
      'El hash de la contraseña no puede estar vacío.'
    );
  });

  it('lanza error si el rol no es válido', () => {
    // Forzamos un rol inválido mediante casting para probar la validación de dominio
    expect(() => User.create({ ...validUserProps, role: 'GUEST' as UserRole })).toThrowError(
      "El rol debe ser 'USER' o 'ADMIN'."
    );
  });
});