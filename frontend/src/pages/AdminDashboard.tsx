import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { adminService } from '../services/adminService';
import NoteCard from '../components/NoteCard';
import type { User } from '../types/auth';
import type { Note } from '../types/note';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Navigation Bar - Estilo iOS */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">
                Bienvenido · {user?.username} 
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Botón de Tema (Sol / Luna) */}
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 ease-out hover:scale-[1.05] active:scale-[0.95]"
                aria-label="Alternar modo oscuro"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 animate-in spin-in duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-in spin-in-[-180deg] duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
              >
                ← Todas las notas
              </button>
              
              <button
                onClick={handleLogout}
                className="rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Barra de Búsqueda Premium */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg
                  className="h-6 w-6 text-gray-400 dark:text-gray-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuario por username..."
                className="w-full pl-16 pr-32 py-5 bg-white/90 dark:bg-slate-800/90 dark:text-white backdrop-blur-xl border border-gray-200/50 dark:border-slate-700 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute inset-y-0 right-2 px-8 m-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-[1.5rem] transition-all duration-200 shadow-[0_4px_12px_rgb(147,51,234,0.3)] hover:shadow-[0_6px_16px_rgb(147,51,234,0.4)] disabled:bg-purple-400 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Buscar'
                )}
              </button>
            </div>
          </form>

          {/* Mensaje de Error */}
          {error && (
            <div className="max-w-2xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex items-start gap-3 transition-colors">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium transition-colors">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {searchedUser && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tarjeta de Usuario */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-[2rem] p-6 mb-8 border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {searchedUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                      {searchedUser.username}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">{searchedUser.email}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    searchedUser.role === 'ADMIN'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {searchedUser.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 transition-colors">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">Usuario ID</p>
                  <p className="text-sm text-gray-900 dark:text-white font-mono transition-colors">{searchedUser.id}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 transition-colors">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">Fecha de Registro</p>
                  <p className="text-sm text-gray-900 dark:text-white transition-colors">{formatDate(searchedUser.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Grid de Notas */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                  Notas del usuario
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
                  {userNotes.length} {userNotes.length === 1 ? 'nota' : 'notas'}
                </span>
              </div>

              {userNotes.length === 0 ? (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-[2rem] p-12 text-center border border-white/20 dark:border-slate-700/50 transition-colors">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    Sin notas
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors">
                    Este usuario no ha creado ninguna nota todavía
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userNotes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado Inicial */}
        {!searchedUser && !loading && !error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-6 transition-colors">
              <svg
                className="w-12 h-12 text-purple-600 dark:text-purple-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Busca un usuario
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
              Ingresa el username de un usuario para ver su información y notas
            </p>
          </div>
        )}
      </main>
    </div>
  );
}