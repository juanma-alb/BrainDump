import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/authSchemas';
import { authService } from '../services/authService';

function ForgotPassword() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setError('');
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el correo de recuperación');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#111111] transition-colors duration-500 relative overflow-hidden font-sans">
      
      {/* Esferas de luz ambientales */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* ================= TARJETA PRINCIPAL ================= */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 md:p-10 animate-in slide-in-from-bottom-8 fade-in duration-500">
          
          {!isSuccess ? (
            <>
              {/* Botón de retroceso hacia Login */}
              <button 
                onClick={() => navigate('/login')}
                className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Volver al Login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>

              {/* Header del Formulario */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                  Recuperar acceso
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                  Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-center animate-in shake">
                    {error}
                  </div>
                )}

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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-[0_8px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.3)] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enviando...
                      </span>
                    ) : (
                      'Enviar enlace'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200"
                >
                  Cancelar y volver
                </Link>
              </div>
            </>
          ) : (
            /* ================= ESTADO DE ÉXITO ================= */
            <div className="text-center py-4 animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 shadow-[0_0_30px_rgb(74,222,128,0.2)]">
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                ¡Correo Enviado!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Hemos enviado un enlace de recuperación a tu correo electrónico.
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 px-2">
                Por favor revisa tu bandeja de entrada o carpeta de spam y sigue las instrucciones.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 px-6 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98]"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;