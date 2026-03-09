import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const parsedUser = JSON.parse(userStr);
        
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
          setUser(parsedUser);
        } else {
          localStorage.clear();
        }
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      localStorage.clear();
    }
  }, []);

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
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
