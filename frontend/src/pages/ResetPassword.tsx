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

    try {
      setError('');
      await authService.resetPassword(id, token, data.newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  // Verificar si id y token existen
  if (!id || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 max-w-md w-full mx-4">
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Enlace Inválido
            </h2>
            
            <p className="text-gray-600 mb-8">
              El enlace de recuperación no es válido o ha expirado.
              Por favor solicita un nuevo enlace de recuperación.
            </p>

            <Link
              to="/forgot-password"
              className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgb(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Solicitar Nuevo Enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 max-w-md w-full mx-4">
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Nueva Contraseña
              </h1>
              <p className="text-sm text-gray-600">
                Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                  className={`w-full px-5 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.newPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgb(59,130,246,0.4)] disabled:bg-blue-400 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    Restableciendo...
                  </span>
                ) : (
                  'Restablecer Contraseña'
                )}
              </button>
            </form>

            {/* Link de regreso */}
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </>
        ) : (
          /* Mensaje de éxito */
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Contraseña Restablecida!
            </h2>
            
            <p className="text-gray-600 mb-2">
              Tu contraseña ha sido actualizada exitosamente.
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgb(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Ir al Inicio de Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
