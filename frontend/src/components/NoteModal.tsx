import type { Note } from "../types/note";
import { useNoteModal } from "../hooks/useNoteModal";
import RichTextEditor from "./RichTextEditor";
import NoteModalHeader from "./note-modal/NoteModalHeader";
import NoteView from "./note-modal/NoteView";
import AiAssistant from "./note-modal/AiAssistant";
import TagEditor from "./note-modal/TagEditor";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note;
  onSave: () => void;
}

export default function NoteModal(props: NoteModalProps) {
  const {
    viewMode, setViewMode, form,
    tagInput, setTagInput, localTags,
    showAiInput, setShowAiInput, aiTopic, setAiTopic, aiError, isGenerating,
    handleDelete, handleAddTag, handleRemoveTag, handleKeyDown,
    handleGenerateDraft, onSubmit, handleClose, handleCancel
  } = useNoteModal(props);

  if (!props.isOpen) return null;

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = form;

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200" onClick={handleClose}>
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 custom-scrollbar transition-colors" onClick={(e) => e.stopPropagation()}>
        
        <NoteModalHeader viewMode={viewMode} onClose={handleClose} disabled={isSubmitting} />

        {viewMode === 'VIEW' && props.noteToEdit ? (
          <NoteView note={props.noteToEdit} onDelete={handleDelete} onClose={handleClose} onEdit={() => setViewMode('EDIT')} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6 animate-in fade-in duration-300">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Título</label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="w-full px-5 py-3.5 text-lg bg-gray-300/30 dark:bg-slate-900/50 dark:text-white border-2 border-transparent dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Agregar un título..."
                disabled={isSubmitting}
              />
              {errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.title.message}</p>}
            </div>

            {/* Contenido (IA + Editor) */}
            <div>
              <AiAssistant 
                showAiInput={showAiInput} setShowAiInput={setShowAiInput}
                aiTopic={aiTopic} setAiTopic={setAiTopic} aiError={aiError}
                handleGenerateDraft={handleGenerateDraft} isGenerating={isGenerating} disabled={isSubmitting}
              />
              <RichTextEditor
                content={watch("content")}
                onChange={(newContent) => setValue("content", newContent, { shouldValidate: true })}
                disabled={isSubmitting}
              />
              {errors.content && <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.content.message}</p>}
            </div>

            {/* Tags */}
            <TagEditor
              localTags={localTags} tagInput={tagInput} setTagInput={setTagInput}
              handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} handleKeyDown={handleKeyDown} disabled={isSubmitting}
            />

            {/* Footer Formulario */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={handleCancel} disabled={isSubmitting} className="px-6 py-3 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-full bg-blue-400 text-white font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-500 hover:shadow-[0_6px_16px_rgb(59,130,246,0.4)] transition-all duration-200 flex items-center gap-2">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Guardando...</>
                ) : (
                  <>{viewMode === 'EDIT' ? "Actualizar Nota" : "Crear Nota"}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}