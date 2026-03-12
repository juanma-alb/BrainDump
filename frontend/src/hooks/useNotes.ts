import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';
import type { Note } from '../types/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Estados de Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [filterFavorite, filterTag, startDate, endDate]);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await noteService.getNotes(page, 9, {
        search: debouncedSearch || undefined,
        isFavorite: filterFavorite ? true : undefined,
        tag: filterTag || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setNotes(result.items);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error al cargar las notas:', err);
      setError('No se pudieron cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterFavorite, filterTag, startDate, endDate]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleToggleFavorite = async (noteToToggle: Note) => {
    const updatedStatus = !noteToToggle.isFavorite;
    setNotes(currentNotes => 
      currentNotes.map(n => n.id === noteToToggle.id ? { ...n, isFavorite: updatedStatus } : n)
    );

    try {
      await noteService.updateNote(noteToToggle.id, { 
        title: noteToToggle.title,
        content: noteToToggle.content,
        tags: noteToToggle.tags,
        isFavorite: updatedStatus 
      });
      fetchNotes(); 
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      setNotes(currentNotes => 
        currentNotes.map(n => n.id === noteToToggle.id ? { ...n, isFavorite: !updatedStatus } : n)
      );
    }
  };

  return {
    notes, loading, error, page, totalPages, setPage,
    searchQuery, setSearchQuery, filterFavorite, setFilterFavorite,
    filterTag, setFilterTag, startDate, setStartDate, endDate, setEndDate,
    handleToggleFavorite, fetchNotes
  };
}