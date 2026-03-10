import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/animations/ParticleBackground';


function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      const response = await authService.register(data);
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#111111] transition-colors duration-500 relative overflow-hidden font-sans">
      
      <ParticleBackground />
      
      {/* efecto de luz */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* form */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 md:p-10 animate-in slide-in-from-bottom-8 fade-in duration-500">
          
          <button 
            onClick={() => navigate('/login')}
            className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Volver al Login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
                <svg className="w-8 h-8 text-grey-400 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Registrate en BrainDump
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-center animate-in shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white border-2 rounded-2xl focus:outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.email ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500'
                  }`}
                  placeholder="Correo electrónico"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium px-2">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  id="username"
                  type="text"
                  {...register('username')}
                  className={`w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white border-2 rounded-2xl focus:outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.username ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500'
                  }`}
                  placeholder="Nombre de usuario"
                />
                {errors.username && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium px-2">{errors.username.message}</p>
                )}
              </div>

              <div>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white border-2 rounded-2xl focus:outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.password ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500'
                  }`}
                  placeholder="Contraseña"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium px-2">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                      w-full py-4 px-6 text-white font-semibold rounded-2xl 
                      transition-all duration-200 active:scale-[0.98]
                      
                      bg-gray-800 hover:bg-black 
                      
                      disabled:bg-gray-400 disabled:cursor-not-allowed 
                      
                      shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]"

              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Registrando...
                  </span>
                ) : (
                  'Comenzar ahora'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
            <p className="text-m text-gray-500 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-black-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}

export default Register;