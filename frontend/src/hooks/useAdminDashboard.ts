// src/hooks/useAdminDashboard.ts
import { useState } from 'react';
import type { FormEvent } from 'react';
import { adminService } from '../services/adminService';
import type { User } from '../types/auth';
import type { Note } from '../types/note';

export function useAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Por favor ingresa un username');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchedUser(null);
      setUserNotes([]);

      const [userData, notesData] = await Promise.all([
        adminService.getUserByUsername(searchQuery.trim()),
        adminService.getUserNotes(searchQuery.trim()),
      ]);

      setSearchedUser(userData);
      setUserNotes(notesData);
    } catch (err: any) {
      console.error('Error al buscar usuario:', err);
      setError(err.response?.data?.message || 'Usuario no encontrado');
      setSearchedUser(null);
      setUserNotes([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchQuery, setSearchQuery,
    searchedUser, userNotes,
    loading, error,
    handleSearch
  };
}