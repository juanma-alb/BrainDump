import AiStarButton from '../animations/AiStarButton';

interface DraftBannerProps {
  isVisible: boolean;
  onUndo: () => void;
  onAccept: () => void;
}

export default function DraftBanner({ isVisible, onUndo, onAccept }: DraftBannerProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-between bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-3 mb-4 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
        <span className="scale-75"><AiStarButton /></span>
        <span className="text-sm font-medium">Borrador generado</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          Deshacer
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="px-3 py-1.5 text-xs font-semibold bg-indigo-100 dark:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-700/60 rounded-lg transition-colors"
        >
          Conservar
        </button>
      </div>
    </div>
  );
}