import { describe, it, expect } from 'vitest';
import { Note } from './Note';

const validProps = {
  id: 'test-id-1',
  userId: 'user-001',
  title: 'My first idea',
  content: 'Idea content.',
  tags: ['brainstorm'],
  isFavorite: true,
  authorUsername: 'johndoe',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('Note Entity', () => {
  it('creates a valid note with all fields including optional ones', () => {
    const note = Note.create(validProps);
    expect(note.title).toBe('My first idea');
    expect(note.userId).toBe('user-001');
    expect(note.tags).toContain('brainstorm');
    expect(note.isFavorite).toBe(true);
    expect(note.authorUsername).toBe('johndoe');
  });

  it('assigns isFavorite to false by default if not provided', () => {
    const { isFavorite, authorUsername, ...propsWithoutOptionals } = validProps;
    const note = Note.create(propsWithoutOptionals);
    expect(note.isFavorite).toBe(false);
    expect(note.authorUsername).toBeUndefined();
  });

  it('throws an error if userId is empty', () => {
    expect(() => Note.create({ ...validProps, userId: '  ' })).toThrowError(
      'Una nota debe pertenecer a un usuario.'
    );
  });

  it('throws an error if the title is empty', () => {
    expect(() => Note.create({ ...validProps, title: '   ' })).toThrowError(
      'El título de una nota no puede estar vacío.'
    );
  });

  it('throws an error if the content is empty', () => {
    expect(() => Note.create({ ...validProps, content: '' })).toThrowError(
      'El contenido de una nota no puede estar vacío.'
    );
  });

  it('returns a new immutable instance when updating the content', () => {
    const note = Note.create(validProps);
    const updated = note.withUpdatedContent('New content.');

    expect(updated.content).toBe('New content.');
    expect(note.content).toBe('Idea content.');
    expect(updated).not.toBe(note);
  });

  it('adds new tags correctly without duplicating existing ones', () => {
    const note = Note.create(validProps); 
    const updated = note.withAddedTags(['react', 'brainstorm', 'node']);

    expect(updated.tags).toHaveLength(3);
    expect(updated.tags).toEqual(expect.arrayContaining(['brainstorm', 'react', 'node']));
    expect(updated).not.toBe(note); 
  });
});