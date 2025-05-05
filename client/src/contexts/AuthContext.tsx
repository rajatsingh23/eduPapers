import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { loginUser, registerUser, logoutUser, getCurrentUser, forgotPassword, resetPassword } from '../lib/api';
import { useToast } from '@/components/ui/use-toast';


export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  forgot: async () => {},
  reset: async () => {},
  logout: async () => {},
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to login');
      toast({
        title: "Login failed",
        description: error.response?.data?.message || 'Failed to login',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forgot = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await forgotPassword(email);
      toast({
        title: "Success",
        description: "Link to change password sent on your email.",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to login');
      toast({
        title: "Login failed",
        description: error.response?.data?.message || 'Failed to login',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await registerUser(name, email, password);
      setUser(userData);
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to register');
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || 'Failed to register',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.response?.data?.message || 'Failed to logout',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //reset password
  const reset = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await resetPassword(token, password);
      toast({
        title: "Success",
        description: "Password reset successfully.",
      });
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to login');
      toast({
        title: "Login failed",
        description: error.response?.data?.message || 'Failed to login',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, forgot, reset, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
