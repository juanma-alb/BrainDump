interface NoteModalHeaderProps {
  viewMode: 'VIEW' | 'EDIT' | 'CREATE';
  onClose: () => void;
  disabled: boolean;
}

export default function NoteModalHeader({ viewMode, onClose, disabled }: NoteModalHeaderProps) {
  return (
    <div className="px-8 py-6 border-b border-gray-300 dark:border-slate-700/50 transition-colors">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
          {viewMode === 'CREATE' && 'Nueva Nota'}
          {viewMode === 'EDIT' && 'Editar Nota'}
          {viewMode === 'VIEW' && 'Detalles de la Nota'}
        </h2>
        <button
          onClick={onClose}
          disabled={disabled}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}