import type { User } from '../../types/auth';
import type { Note } from '../../types/note';
import NoteCard from '../NoteCard';

interface AdminSearchResultsProps {
  searchedUser: User;
  userNotes: Note[];
  onNoteClick: (note: Note) => void;
}

export default function AdminSearchResults({ searchedUser, userNotes, onNoteClick }: AdminSearchResultsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl md:rounded-[2rem] p-5 md:p-6 mb-8 border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <span className="text-xl md:text-2xl font-bold text-white">
                {searchedUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors line-clamp-1">
                {searchedUser.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 transition-colors line-clamp-1">{searchedUser.email}</p>
            </div>
          </div>
          
          <span className={`rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-semibold transition-colors self-start sm:self-auto ${
              searchedUser.role === 'ADMIN'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
            {searchedUser.role}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 md:p-4 transition-colors overflow-hidden">
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">Usuario ID</p>
            <p className="text-xs md:text-sm text-gray-900 dark:text-white font-mono transition-colors truncate" title={searchedUser.id}>{searchedUser.id}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 md:p-4 transition-colors overflow-hidden">
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">Fecha de Registro</p>
            <p className="text-xs md:text-sm text-gray-900 dark:text-white transition-colors truncate">{formatDate(searchedUser.createdAt)}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white transition-colors">
            Notas del usuario
          </h3>
          <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700">
            {userNotes.length} {userNotes.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>

        {userNotes.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl md:rounded-[2rem] p-8 md:p-12 text-center border border-white/20 dark:border-slate-700/50 transition-colors">
            <div className="text-5xl md:text-6xl mb-3 md:mb-4">📝</div>
            <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Sin notas</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors">Este usuario no ha creado ninguna nota todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {userNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onClick={() => onNoteClick(note)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}