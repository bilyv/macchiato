import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api/core';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginExternalUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isExternalUser: () => boolean;
  isAdminOrExternalUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const responseText = await response.text();

        let errorMessage = 'Login failed';
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = responseText || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);
      const userData = data.data;

      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginExternalUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/external-users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const responseText = await response.text();

        let errorMessage = 'Login failed';
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = responseText || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);
      const userData = data.data;

      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect to external user dashboard
      navigate('/external-user/dashboard');
    } catch (error) {
      console.error('External user login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isExternalUser = () => {
    return user?.role === 'external_user';
  };

  const isAdminOrExternalUser = () => {
    return user?.role === 'admin' || user?.role === 'external_user';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginExternalUser,
      logout,
      isAdmin,
      isExternalUser,
      isAdminOrExternalUser
    }}>
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

export default useAuth;
