import type { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <article
      onClick={onClick}
      className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer group"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
          {note.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {note.content}
        </p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 text-blue-600 px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <time className="text-xs text-gray-400 font-medium">
          {formatDate(note.updatedAt)}
        </time>
      </div>
    </article>
  );
}
