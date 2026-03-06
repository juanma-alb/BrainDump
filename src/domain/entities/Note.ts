export interface NoteProps {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}


export class Note {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly content: string;
  readonly tags: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: NoteProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.title = props.title;
    this.content = props.content;
    this.tags = props.tags;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: NoteProps): Note {
    if (!props.userId.trim()) {
      throw new Error('Una nota debe pertenecer a un usuario.');
    }
    if (!props.title.trim()) {
      throw new Error('El título de una nota no puede estar vacío.');
    }
    if (!props.content.trim()) {
      throw new Error('El contenido de una nota no puede estar vacío.');
    }
    return new Note(props);
  }

  withUpdatedContent(newContent: string): Note {
    if (!newContent.trim()) {
      throw new Error('El contenido actualizado no puede estar vacío.');
    }
    return new Note({
      ...this,
      content: newContent,
      updatedAt: new Date(),
    });
  }

  /*
    Devuelve una nueva instancia con los tags fusionados (sin duplicados).
    Preserva los tags existentes y añade los nuevos.
   */
  withAddedTags(newTags: string[]): Note {
    const merged = Array.from(new Set([...this.tags, ...newTags]));
    return new Note({
      ...this,
      tags: merged,
      updatedAt: new Date(),
    });
  }
}
