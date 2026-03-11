// src/hooks/useNoteModal.ts
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Note } from "../types/note";
import { createNoteSchema, updateNoteSchema } from "../schemas/noteSchemas";
import type { CreateNoteFormValues, UpdateNoteFormValues } from "../schemas/noteSchemas";
import { noteService } from "../services/noteService";

export type UnifiedFormValues = {
  title: string;
  content: string;
  tags: string[];
};

interface UseNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note;
  onSave: () => void;
}

export function useNoteModal({ isOpen, onClose, noteToEdit, onSave }: UseNoteModalProps) {
  const [tagInput, setTagInput] = useState("");
  const [localTags, setLocalTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiError, setAiError] = useState("");
  const [viewMode, setViewMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('CREATE');

  const isEditing = Boolean(noteToEdit);
  const schema = isEditing ? updateNoteSchema : createNoteSchema;

  const form = useForm<UnifiedFormValues>({
    defaultValues: { title: "", content: "", tags: [] },
  });

  const { reset, setValue, clearErrors, setError } = form;

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
  }, [noteToEdit, setValue, reset, isOpen]);

  const handleDelete = async () => {
    if (!noteToEdit) return;
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
            setError(err.path[0] as keyof UnifiedFormValues, { type: "manual", message: err.message });
          }
        });
        return;
      }

      if (isEditing && noteToEdit) {
        await noteService.updateNote(noteToEdit.id, validation.data as UpdateNoteFormValues);
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
    if (!form.formState.isSubmitting) {
      reset();
      setLocalTags([]);
      setTagInput("");
      onClose();
    }
  };

  const handleCancel = () => {
    if (viewMode === 'EDIT' && noteToEdit) {
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

  return {
    viewMode, setViewMode, form,
    tagInput, setTagInput, localTags,
    showAiInput, setShowAiInput, aiTopic, setAiTopic, aiError, isGenerating,
    handleDelete, handleAddTag, handleRemoveTag, handleKeyDown,
    handleGenerateDraft, onSubmit, handleClose, handleCancel
  };
}