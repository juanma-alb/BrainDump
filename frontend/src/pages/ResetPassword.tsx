import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordFormSchema, type ResetPasswordFormValues } from '../schemas/authSchemas';
import { authService } from '../services/authService';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!id || !token) {
      setError('Enlace de recuperación inválido');
      return;
    }
    if (data.newPassword !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    try {
      setConfirmError('');
      setError('');
      await authService.resetPassword(id, token, data.newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 md:p-10 animate-in slide-in-from-bottom-8 fade-in duration-500">
      {(!id || !token) ? (
        <div className="text-center py-4 animate-in zoom-in-95 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 shadow-[0_0_30px_rgb(239,68,68,0.2)]">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Enlace Inválido</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 px-2">El enlace de recuperación no es válido o ha expirado. Por favor solicita uno nuevo.</p>
          <Link to="/forgot-password" className="block w-full py-4 px-6 bg-gray-800 hover:bg-black text-white font-semibold rounded-2xl transition-all duration-200 shadow-[0_8px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.3)] active:scale-[0.98]">
            Solicitar Nuevo Enlace
          </Link>
        </div>
      ) : !isSuccess ? (
        <>
          <button 
            onClick={() => navigate('/')}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Nueva Contraseña</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4">Crea una nueva contraseña segura para tu cuenta.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-center animate-in shake">{error}</div>}

            <div className="space-y-4">
              <div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  {...register('newPassword')}
                  className={`w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white border-2 rounded-2xl focus:outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${errors.newPassword ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500'}`}
                  placeholder="Nueva contraseña"
                />
                {errors.newPassword && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium px-2">{errors.newPassword.message}</p>}
              </div>

              <div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError('');
                  }}
                  className={`w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white border-2 rounded-2xl focus:outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${confirmError ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500'}`}
                  placeholder="Confirmar contraseña"
                />
                {confirmError && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium px-2">{confirmError}</p>}
              </div>
            </div>

            <div className="flex items-center px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-slate-600 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200"></div>
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">Mostrar contraseñas</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gray-800 hover:bg-black text-white font-semibold rounded-2xl transition-all duration-200 disabled:bg-gray-800 disabled:cursor-not-allowed shadow-[0_8px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.3)] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </span>
                ) : 'Restablecer Contraseña'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center py-4 animate-in zoom-in-95 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 shadow-[0_0_30px_rgb(74,222,128,0.2)]">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">¡Contraseña Restablecida!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 px-2">Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión de forma segura.</p>
          <button onClick={() => navigate('/')} className="w-full py-4 px-6 bg-gray-800 hover:bg-black text-white font-semibold rounded-2xl transition-all duration-200 shadow-[0_8px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.3)] active:scale-[0.98]">
            Ir al Inicio de Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;