import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotFoundAnimation from '../components/animations/404';


export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 py-10">
      
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 md:p-12 w-full">
        
        <div className="flex justify-center mb-6 md:mb-8">
          <NotFoundAnimation />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
          Error 404
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 transition-colors">
          Te has perdido en el espacio
        </h2>
        
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 px-2 md:px-4">
          La nota o página que estás buscando no existe o fue eliminada.
        </p>

        {user ? (
          <Link 
            to="/dashboard" 
            className="inline-flex w-full justify-center py-3.5 md:py-4 px-6 bg-gray-800 hover:bg-black text-white text-sm md:text-base font-semibold rounded-2xl transition-all duration-200 shadow-[0_8px_20px_rgb(59,30,46,0.3)] active:scale-[0.98]"
          >
            Volver a mis notas
          </Link>
        ) : (
          <Link 
            to="/" 
            className="inline-flex w-full justify-center py-3.5 md:py-4 px-6 bg-gray-800 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 text-sm md:text-base font-semibold rounded-2xl transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            Ir al inicio de sesión
          </Link>
        )}
      </div>
      
    </div>
  );
}