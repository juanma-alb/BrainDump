import { describe, it, expect } from 'vitest';
import { Note } from './Note';

const validProps = {
  id: 'test-id-1',
  userId: 'user-001',
  title: 'Mi primera idea',
  content: 'Contenido de la idea.',
  tags: ['brainstorm'],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('Note Entity', () => {
  it('crea una nota válida con todos los campos', () => {
    const note = Note.create(validProps);
    expect(note.title).toBe('Mi primera idea');
    expect(note.userId).toBe('user-001');
    expect(note.tags).toContain('brainstorm');
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
});
