import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '@/api/authApi';
import { KullaniciDto, LoginDto } from '@/types/auth.types';
import { message } from 'antd';

interface AuthContextType {
  user: KullaniciDto | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<KullaniciDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde token'ı kontrol et
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (data: LoginDto) => {
    try {
      const result = await authApi.login(data);
      
      if (result.success && result.data) {
        const { token, kullanici } = result.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(kullanici));
        
        setToken(token);
        setUser(kullanici);
        
        message.success('Giriş başarılı!');
      } else {
        message.error(result.message || 'Giriş başarısız!');
        throw new Error(result.message);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Giriş başarısız!');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    message.info('Çıkış yapıldı');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
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