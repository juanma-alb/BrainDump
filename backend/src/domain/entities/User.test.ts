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
  it('creates a valid user with all correct fields', () => {
    const user = User.create(validUserProps);
    expect(user.id).toBe('usr-001');
    expect(user.email).toBe('test@braindump.com');
    expect(user.username).toBe('johndoe');
    expect(user.role).toBe('USER');
  });

  it('creates an admin user correctly', () => {
    const adminProps = { ...validUserProps, role: 'ADMIN' as UserRole };
    const admin = User.create(adminProps);
    expect(admin.role).toBe('ADMIN');
  });

  it('throws an error if the email is empty', () => {
    expect(() => User.create({ ...validUserProps, email: '   ' })).toThrowError(
      'El email del usuario no puede estar vacío.'
    );
  });

  it('throws an error if the email format is invalid', () => {
    expect(() => User.create({ ...validUserProps, email: 'correo-sin-arroba.com' })).toThrowError(
      'El formato del email no es válido.'
    );
  });

  it('throws an error if the username is empty', () => {
    expect(() => User.create({ ...validUserProps, username: '' })).toThrowError(
      'El username no puede estar vacío.'
    );
  });

  it('throws an error if the username has less than 3 characters', () => {
    expect(() => User.create({ ...validUserProps, username: 'ab' })).toThrowError(
      'El username debe tener al menos 3 caracteres.'
    );
  });

  it('throws an error if the username contains spaces', () => {
    expect(() => User.create({ ...validUserProps, username: 'john doe' })).toThrowError(
      'El username no puede contener espacios.'
    );
  });

  it('throws an error if the password hash is empty', () => {
    expect(() => User.create({ ...validUserProps, passwordHash: '   ' })).toThrowError(
      'El hash de la contraseña no puede estar vacío.'
    );
  });

  it('throws an error if the role is invalid', () => {
    expect(() => User.create({ ...validUserProps, role: 'GUEST' as UserRole })).toThrowError(
      "El rol debe ser 'USER' o 'ADMIN'."
    );
  });
});