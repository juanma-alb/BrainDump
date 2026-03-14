interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-all animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] rounded-[2rem] p-6 sm:p-8 w-full max-w-sm animate-in zoom-in-95 duration-200 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
            <button 
              onClick={onClose}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl sm:rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-[0_4px_12px_rgb(239,68,68,0.3)] transition-all duration-200"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}