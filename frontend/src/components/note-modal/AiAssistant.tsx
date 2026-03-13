import AiStarButton from '../animations/AiStarButton';

interface AiAssistantProps {
  showAiInput: boolean;
  setShowAiInput: (show: boolean) => void;
  aiTopic: string;
  setAiTopic: (topic: string) => void;
  handleGenerateDraft: () => void;
  isGenerating: boolean;
  disabled: boolean;
  aiError: string;
}

export default function AiAssistant({
  showAiInput, setShowAiInput, aiTopic, setAiTopic,
  handleGenerateDraft, isGenerating, disabled, aiError
}: AiAssistantProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">
          Contenido
        </label>
        <button
          type="button"
          onClick={() => setShowAiInput(!showAiInput)}
          disabled={disabled}
          className="group w-fit rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed border bg-blue-50/50 hover:bg-blue-200/60 text-blue-700 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md hover:shadow-blue-500/10 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800/50 dark:hover:border-indigo-700/80 dark:hover:shadow-lg dark:hover:shadow-indigo-900/20"
        >
          <span className="transition-transform duration-300 group-hover:scale-110 flex items-center scale-90 sm:scale-100">
            <AiStarButton/>
          </span>
          <span>Asistente IA</span>
        </button>
      </div>

      {showAiInput && (
        <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-md border border-blue-100 dark:border-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleGenerateDraft(); } }}
                placeholder="Escribe una idea y la IA creará un borrador..."
                disabled={isGenerating || disabled}
                className="w-full px-3 py-2.5 sm:px-4 text-sm bg-white/80 dark:bg-slate-800/80 dark:text-white border border-blue-200/50 dark:border-slate-700/50 rounded-lg sm:rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-blue-500 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {aiError && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{aiError}</p>}

            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={isGenerating || disabled}
              className="w-full sm:w-fit sm:min-w-[250px] mx-auto px-6 sm:px-8 py-2.5 rounded-lg sm:rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-300 to-indigo-300 text-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-400 hover:to-indigo-400 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200 dark:shadow-black/50 dark:hover:from-blue-800 dark:hover:to-indigo-800"
            >
              {isGenerating ? (
                <><div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div><span>Generando...</span></>
              ) : (
                <><span><AiStarButton/></span><span>Generar</span></>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}