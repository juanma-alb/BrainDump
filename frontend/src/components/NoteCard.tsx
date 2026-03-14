import { useState } from 'react';
import type { Note } from '../types/note';
import { useAuth } from '../context/AuthContext';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  onEdit?: (note: Note) => void;
  onToggleFavorite?: (note: Note) => void;
  onDelete?: (note: Note) => void; 
  onCopy?: (note: Note) => void;
  onExportPDF?: (note: Note) => void;
}

export default function NoteCard({ note, onClick, onToggleFavorite, onDelete, onCopy, onExportPDF, onEdit }: NoteCardProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric',
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
      className={`relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer group flex flex-col h-full ${isMenuOpen ? 'z-50' : 'z-0'}`}
    >
      <div className="absolute top-5 right-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-2 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50"
          aria-label="Opciones de la nota"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}></div>
            
            {/* Panel Flotante del Menú */}
            <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-100 dark:border-slate-700/50 rounded-2xl shadow-xl z-40 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              
              {/* ✅ SOLO MOSTRAMOS ESTO SI NO ES ADMIN */}
              {user?.role !== 'ADMIN' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit?.(note); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 font-medium">
                    ✏️ Editar
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onCopy?.(note); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 font-medium">
                    📋 Copiar texto
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onExportPDF?.(note); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 font-medium">
                    📄 Exportar PDF / Imprimir
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-slate-700/50 my-1"></div>
                </>
              )}
              
              {/* ✅ ELIMINAR SIEMPRE VISIBLE */}
              <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete?.(note); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 font-semibold">
                🗑️ Eliminar
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col flex-grow pr-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight transition-colors">
          {note.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 transition-colors">
          {stripHtml(note.content)}
        </p>
      </div>

      <div className="mt-auto pt-4">
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {note.tags.map((tag, index) => (
              <span key={index} className="rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-medium transition-colors">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 border-t border-gray-100 dark:border-slate-700/30 pt-3">
          <time className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors">
            {formatDate(note.updatedAt)}
          </time>
          
          <div className="flex items-center gap-2">
            {note.authorUsername && user?.role === 'ADMIN' && (
              <span className="text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-800/30 transition-colors">
                @{note.authorUsername}
              </span>
            )}

            {onToggleFavorite && user?.role === 'USER' && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  onToggleFavorite(note);
                }}
                className="p-1 -m-1 text-gray-300 dark:text-gray-600 hover:text-yellow-500 transition-colors duration-300"
                aria-label={note.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 transition-all duration-300 ${
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
          </div>
        </div>
      </div>
    </article>
  );
}