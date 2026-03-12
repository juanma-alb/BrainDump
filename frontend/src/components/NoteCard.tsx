import type { Note } from '../types/note';
import { useAuth } from '../context/AuthContext';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  onToggleFavorite?: (note: Note) => void; 
}

export default function NoteCard({ note, onClick, onToggleFavorite }: NoteCardProps) {
const { user} = useAuth();

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
      className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer group"
    >
      {/* Botón de Favorito*/}
      {onToggleFavorite && user?.role === 'USER' && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onToggleFavorite(note);
          }}
          className="absolute top-6 right-6 z-10 p-2 -m-2 text-gray-300 dark:text-gray-600 hover:text-yellow-500 transition-colors duration-300"
          aria-label={note.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-7 w-7 transition-all duration-300 ${
              note.isFavorite 
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]' 
                : 'fill-none stroke-current stroke-2 hover:scale-110'
            }`} 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      )}

      {/* pr-10 asegura que el texto no se superponga con la estrella */}
      <div className="flex flex-col h-full pr-10">
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

        <div className="flex items-center justify-between mt-2 border-t border-gray-100 dark:border-slate-700/30 pt-3">
          <time className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors">
            {formatDate(note.updatedAt)}
          </time>
          
          {note.authorUsername && user?.role === 'ADMIN' && (
            <span className="text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-800/30 transition-colors">
              @{note.authorUsername}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}