import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Note } from "../types/note";
import { createNoteSchema, updateNoteSchema } from "../schemas/noteSchemas";
import type {
  CreateNoteFormValues,
  UpdateNoteFormValues,
} from "../schemas/noteSchemas";
import { noteService } from "../services/noteService";
import RichTextEditor from "./RichTextEditor";

type UnifiedFormValues = {
  title: string;
  content: string;
  tags: string[];
};

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note;
  onSave: () => void;
}

export default function NoteModal({
  isOpen,
  onClose,
  noteToEdit,
  onSave,
}: NoteModalProps) {
  const [tagInput, setTagInput] = useState("");
  const [localTags, setLocalTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiError, setAiError] = useState("");
  const [viewMode, setViewMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('CREATE');

  const isEditing = Boolean(noteToEdit);
  const schema = isEditing ? updateNoteSchema : createNoteSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm<UnifiedFormValues>({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (noteToEdit) {
      setViewMode('VIEW');
      setValue("title", noteToEdit.title);
      setValue("content", noteToEdit.content);
      setValue("tags", noteToEdit.tags);
      setLocalTags(noteToEdit.tags);
    } else {
      setViewMode('CREATE');
      reset();
      setLocalTags([]);
    }
  }, [noteToEdit, setValue, reset]);

  const handleDelete = async () => {
    if (!noteToEdit) return;
    
    // Alerta de confirmación nativa
    if (window.confirm('¿Estás seguro de que deseas eliminar esta nota? Esta acción no se puede deshacer.')) {
      try {
        await noteService.deleteNote(noteToEdit.id);
        onSave(); 
        onClose(); 
      } catch (error) {
        console.error('Error al eliminar la nota:', error);
      }
    }
  };

  const handleAddTag = () => {
    if (localTags.length >= 5) return;

    const trimmedTag = tagInput.trim();
    if (trimmedTag && !localTags.includes(trimmedTag)) {
      const newTags = [...localTags, trimmedTag];
      setLocalTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = localTags.filter((tag) => tag !== tagToRemove);
    setLocalTags(newTags);
    setValue("tags", newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleGenerateDraft = async () => {
    setAiError("");

    if (aiTopic.trim().length < 3) {
      setAiError("El tema debe tener al menos 3 caracteres");
      return;
    }

    try {
      setIsGenerating(true);
      const result = await noteService.generateDraft(aiTopic.trim());
      setValue("content", result.generatedContent, { shouldValidate: true });
      setShowAiInput(false);
      setAiTopic("");
    } catch (error) {
      console.error("Error al generar borrador:", error);
      setAiError("Error al generar el borrador. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: UnifiedFormValues) => {
    try {
      clearErrors();

      const validation = schema.safeParse(data);

      if (!validation.success) {
        validation.error.issues.forEach((err) => {
          if (err.path[0]) {
            setError(err.path[0] as keyof UnifiedFormValues, {
              type: "manual",
              message: err.message,
            });
          }
        });
        return;
      }

      if (isEditing && noteToEdit) {
        await noteService.updateNote(
          noteToEdit.id,
          validation.data as UpdateNoteFormValues,
        );
      } else {
        await noteService.createNote(validation.data as CreateNoteFormValues);
      }

      onSave();
      reset();
      setLocalTags([]);
      setTagInput("");
      onClose();
    } catch (error) {
      console.error("Error al guardar la nota:", error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setLocalTags([]);
      setTagInput("");
      onClose();
    }
  };

  const handleCancel = () => {
    if (viewMode === 'EDIT' && noteToEdit) {
      // Restauramos los valores a su estado original antes de volver a la vista
      setValue("title", noteToEdit.title);
      setValue("content", noteToEdit.content);
      setValue("tags", noteToEdit.tags);
      setLocalTags(noteToEdit.tags);
      clearErrors();
      setViewMode('VIEW');
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {viewMode === 'CREATE' && 'Nueva Nota'}
              {viewMode === 'EDIT' && 'Editar Nota'}
              {viewMode === 'VIEW' && 'Detalles de la Nota'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {viewMode === 'VIEW' && noteToEdit ? (
          /* MODO VISTA */
          <div className="px-8 py-6 space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{noteToEdit.title}</h1>
              <div 
                className="prose prose-blue max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: noteToEdit.content }}
              />
            </div>

            {noteToEdit.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {noteToEdit.tags.map((tag, index) => (
                    <span key={index} className="rounded-full bg-blue-50 text-blue-600 px-4 py-2 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all duration-200 flex items-center gap-2"
              >
                Eliminar Nota
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setViewMode('EDIT')}
                  className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200"
                >
                  Editar Nota
                </button>
              </div>
            </div>
          </div>
        ) : (
          /*  MODO EDICIÓN / CREACIÓN  */
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6 animate-in fade-in duration-300">
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Título
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="w-full px-5 py-3.5 text-lg font-semibold bg-gray-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                placeholder="Un título memorable..."
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Contenido */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Contenido
                </label>
                <button
                  type="button"
                  onClick={() => setShowAiInput(!showAiInput)}
                  disabled={isSubmitting}
                  className="text-blue-600 bg-blue-50/80 hover:bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>✨</span>
                  <span>Asistente IA</span>
                </button>
              </div>

              {/* Panel de IA */}
              {showAiInput && (
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-md border border-blue-100 rounded-2xl p-4 mb-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleGenerateDraft();
                          }
                        }}
                        placeholder="Ej: Ideas para los versos de dulce agonía..."
                        disabled={isGenerating || isSubmitting}
                        className="w-full px-4 py-2.5 text-sm bg-white/80 border border-blue-200/50 rounded-xl focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                      />
                    </div>

                    {aiError && (
                      <p className="text-xs text-red-600 font-medium">
                        {aiError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleGenerateDraft}
                      disabled={isGenerating || isSubmitting}
                      className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Generando magia...</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>Generar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* RichTextEditor */}
              <RichTextEditor
                content={watch("content")}
                onChange={(newContent) =>
                  setValue("content", newContent, { shouldValidate: true })
                }
                disabled={isSubmitting}
              />
              {errors.content && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="tags"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Etiquetas
                </label>
                {localTags.length >= 5 && (
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-md">
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
                  className="flex-1 px-5 py-3 text-sm bg-gray-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder={
                    localTags.length >= 5
                      ? "Límite de etiquetas alcanzado"
                      : "Agregar etiqueta..."
                  }
                  disabled={isSubmitting || localTags.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={isSubmitting || localTags.length >= 5}
                  className="px-6 py-3 rounded-2xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Agregar
                </button>
              </div>

              {localTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {localTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-600 px-4 py-2 text-sm font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSubmitting}
                        className="hover:text-blue-800 transition-colors disabled:opacity-50"
                        aria-label={`Eliminar etiqueta ${tag}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="flex items-center justify-end gap-3 pt-4">
            <button
                type="button"
                onClick={handleCancel} 
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 hover:shadow-[0_6px_16px_rgb(59,130,246,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </>
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
