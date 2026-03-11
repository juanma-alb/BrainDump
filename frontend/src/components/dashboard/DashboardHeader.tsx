import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface DashboardHeaderProps {
  onNewNote: () => void;
}

export default function DashboardHeader({ onNewNote }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
              {user?.role === 'USER' ? 'Mis Notas' : 'Todas las notas'}              
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">
              Hola, {user?.username}
            </p>
          </div>

          <div className="flex items-center gap-3">
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

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-6 py-2.5 text-sm font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
                Panel Admin
              </Link>
            )}

            {user?.role === 'USER' && (
              <button onClick={onNewNote} className="rounded-full bg-blue-500 text-white px-6 py-2.5 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
                + Nueva Nota
              </button>
            )}

            <button onClick={handleLogout} className="rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}