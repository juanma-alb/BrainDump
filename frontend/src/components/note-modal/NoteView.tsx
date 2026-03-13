import type { Note } from "../../types/note";

interface NoteViewProps {
  note: Note;
  onDelete: () => void;
  onClose: () => void;
  onEdit: () => void;
}

export default function NoteView({ note, onDelete, onClose, onEdit }: NoteViewProps) {
  return (
    <div className="px-5 py-5 sm:px-8 sm:py-6 space-y-6 sm:space-y-8 animate-in fade-in duration-300 flex flex-col min-h-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors">{note.title}</h1>
        <div 
          className="prose prose-blue dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 transition-colors"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>

      {note.tags.length > 0 && (
        <div className="pt-4 sm:pt-6 transition-colors">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span key={index} className="rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-gray-300 dark:border-slate-700/50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <button
          onClick={onDelete}
          className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 flex items-center justify-center gap-2 order-2 sm:order-1"
        >
          Eliminar Nota
        </button>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 text-center"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full bg-blue-500 text-white font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200 text-center"
          >
            Editar Nota
          </button>
        </div>
      </div>
    </div>
  );
}