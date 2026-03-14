import { createContext, useContext, useState } from 'react';
import type { User, AuthResponse } from '../types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
          return parsedUser;
        } else {
          localStorage.clear();
        }
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      localStorage.clear();
    }
    return null;
  });

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    toast(`¡Bienvenido de nuevo, ${data.user.username}!`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast('Sesión cerrada. ¡Hasta pronto!');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};