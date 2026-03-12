interface TagEditorProps {
  localTags: string[];
  tagInput: string;
  setTagInput: (tag: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export default function TagEditor({
  localTags, tagInput, setTagInput, handleAddTag, handleRemoveTag, handleKeyDown, disabled
}: TagEditorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">
          Etiquetas
        </label>
        {localTags.length >= 5 && (
          <span className="text-xs text-amber-600 dark:text-amber-500 font-semibold bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md">
            Límite de 5 etiquetas alcanzado
          </span>
        )}
      </div>
      <div className="flex gap-2 mb-3">
        <input
          id="tags"
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-5 py-3 text-sm bg-gray-300/30 dark:bg-slate-900/50 dark:text-white border-2 border-transparent dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-slate-800"
          placeholder={localTags.length >= 5 ? "Límite de etiquetas alcanzado" : "Agregar etiqueta..."}
          disabled={disabled || localTags.length >= 5}
        />
        <button
          type="button"
          onClick={handleAddTag}
          disabled={disabled || localTags.length >= 5}
          className="px-6 py-3 rounded-2xl bg-blue-400 text-white text-sm font-semibold hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Agregar
        </button>
      </div>

      {localTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {localTags.map((tag, index) => (
            <span key={index} className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 text-sm font-medium transition-colors">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                disabled={disabled}
                className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                aria-label={`Eliminar etiqueta ${tag}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}