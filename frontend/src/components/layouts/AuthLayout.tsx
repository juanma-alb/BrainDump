import { Outlet } from 'react-router-dom';
import ParticleBackground from '../animations/ParticleBackground';
import { useTheme } from '../../context/ThemeContext';

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#111111] transition-colors duration-500 relative overflow-hidden font-sans">
      
      <ParticleBackground />
      
      {/*  luz ambiental */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-gray-200/50 dark:border-slate-700/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
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

      <div className="relative z-10 w-full max-w-md px-6">
        <Outlet />
      </div>
    </div>
  );
}