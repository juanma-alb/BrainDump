import { describe, it, expect } from 'vitest';
import { Note } from './Note';

const validProps = {
  id: 'test-id-1',
  userId: 'user-001',
  title: 'Mi primera idea',
  content: 'Contenido de la idea.',
  tags: ['brainstorm'],
  isFavorite: true,
  authorUsername: 'johndoe',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('Note Entity', () => {
  it('crea una nota válida con todos los campos incluyendo campos opcionales', () => {
    const note = Note.create(validProps);
    expect(note.title).toBe('Mi primera idea');
    expect(note.userId).toBe('user-001');
    expect(note.tags).toContain('brainstorm');
    expect(note.isFavorite).toBe(true);
    expect(note.authorUsername).toBe('johndoe');
  });

  it('asigna isFavorite en false por defecto si no se provee', () => {
    const { isFavorite, authorUsername, ...propsWithoutOptionals } = validProps;
    const note = Note.create(propsWithoutOptionals);
    expect(note.isFavorite).toBe(false);
    expect(note.authorUsername).toBeUndefined();
  });

  it('lanza error si userId está vacío', () => {
    expect(() => Note.create({ ...validProps, userId: '  ' })).toThrowError(
      'Una nota debe pertenecer a un usuario.'
    );
  });

  it('lanza error si el título está vacío', () => {
    expect(() => Note.create({ ...validProps, title: '   ' })).toThrowError(
      'El título de una nota no puede estar vacío.'
    );
  });

  it('lanza error si el contenido está vacío', () => {
    expect(() => Note.create({ ...validProps, content: '' })).toThrowError(
      'El contenido de una nota no puede estar vacío.'
    );
  });

  it('devuelve una nueva instancia inmutable al actualizar el contenido', () => {
    const note = Note.create(validProps);
    const updated = note.withUpdatedContent('Nuevo contenido.');

    expect(updated.content).toBe('Nuevo contenido.');
    expect(note.content).toBe('Contenido de la idea.');
    expect(updated).not.toBe(note);
  });

  it('añade nuevos tags correctamente sin duplicar los existentes', () => {
    const note = Note.create(validProps); // Inicia con ['brainstorm']
    const updated = note.withAddedTags(['react', 'brainstorm', 'node']);

    expect(updated.tags).toHaveLength(3);
    expect(updated.tags).toEqual(expect.arrayContaining(['brainstorm', 'react', 'node']));
    expect(updated).not.toBe(note); // Verifica inmutabilidad
  });
});