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

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <article
      onClick={onClick}
      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer group"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight transition-colors">
          {note.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow transition-colors">
          {stripHtml(note.content)}
        </p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-medium transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <time className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors">
          {formatDate(note.updatedAt)}
        </time>
      </div>
    </article>
  );
}