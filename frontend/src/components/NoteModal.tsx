import type { Note } from "../types/note";
import { useNoteModal } from "../hooks/useNoteModal";
import RichTextEditor from "./RichTextEditor";
import NoteModalHeader from "./note-modal/NoteModalHeader";
import NoteView from "./note-modal/NoteView";
import AiAssistant from "./note-modal/AiAssistant";
import TagEditor from "./note-modal/TagEditor";
import ConfirmModal from "./ConfirmModal";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note;
  onSave: () => void;
  initialMode?: 'VIEW' | 'EDIT' | 'CREATE';
}

export default function NoteModal(props: NoteModalProps) {
  const {
    viewMode, setViewMode, form,
    tagInput, setTagInput, localTags,
    showAiInput, setShowAiInput, aiTopic, setAiTopic, aiError, isGenerating,
    handleDelete, handleAddTag, handleRemoveTag, handleKeyDown,
    handleGenerateDraft, onSubmit, handleClose, handleCancel,
    isConfirmDeleteOpen, setIsConfirmDeleteOpen, confirmDelete
  } = useNoteModal(props);

  if (!props.isOpen) return null;

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = form;

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 transition-all animate-in fade-in duration-200" onClick={handleClose}>
      
      <div className="flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 sm:border border-white/50 dark:border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-none sm:rounded-[2.5rem] w-full h-full sm:h-auto max-w-2xl sm:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 transition-colors" onClick={(e) => e.stopPropagation()}>
        
        <NoteModalHeader viewMode={viewMode} onClose={handleClose} disabled={isSubmitting} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {viewMode === 'VIEW' && props.noteToEdit ? (
            <NoteView note={props.noteToEdit} onDelete={handleDelete} onClose={handleClose} onEdit={() => setViewMode('EDIT')} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-6 sm:px-8 sm:py-6 space-y-6 animate-in fade-in duration-300 flex flex-col min-h-full">
              
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Título</label>
                <input
                  id="title"
                  type="text"
                  {...register("title")}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-base sm:text-lg bg-transparent dark:bg-slate-900/50 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Agregar un título..."
                  disabled={isSubmitting}
                />
                {errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.title.message}</p>}
              </div>

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

              <TagEditor
                localTags={localTags} tagInput={tagInput} setTagInput={setTagInput}
                handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} handleKeyDown={handleKeyDown} disabled={isSubmitting}
              />

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 mt-auto">
                <button type="button" onClick={handleCancel} disabled={isSubmitting} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full bg-transparent dark:transparent text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full bg-blue-500 text-white font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2">
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
      <ConfirmModal 
        isOpen={isConfirmDeleteOpen} 
        onClose={() => setIsConfirmDeleteOpen(false)} 
        onConfirm={confirmDelete} 
        title="¿Eliminar esta nota?" 
        message="Esta acción no se puede deshacer y la nota se perderá para siempre." 
      />
    </div>
  );
}