"use client";

import type { User } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { MOCK_USERS, MOCK_USER_CREDENTIALS } from '@/lib/types'; // For mock login

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (mobile: string, password: string) => Promise<User | null>;
  register: (mobile: string, password: string, invitationCode: string) => Promise<User | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = sessionStorage.getItem('feiwuUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (mobile: string, password: string): Promise<User | null> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = MOCK_USERS.find(u => u.mobile === mobile);
    if (foundUser && MOCK_USER_CREDENTIALS[mobile] === password) {
      setUser(foundUser);
      sessionStorage.setItem('feiwuUser', JSON.stringify(foundUser));
      setLoading(false);
      return foundUser;
    }
    setLoading(false);
    return null;
  }, []);

  const register = useCallback(async (mobile: string, password: string, invitationCode: string): Promise<User | null> => {
    setLoading(true);
    // Simulate API call & invitation code check
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Basic mobile validation (more robust needed for prod)
    if (!/^\d{11}$/.test(mobile)) {
      setLoading(false);
      throw new Error("Invalid mobile phone number format.");
    }

    // Mock invitation code validation (In real app, check MOCK_INVITATION_CODES or DB)
    if (invitationCode !== 'WELCOME123' && invitationCode !== 'FEIWU2024') {
      setLoading(false);
      throw new Error("Invalid invitation code.");
    }

    if (MOCK_USERS.find(u => u.mobile === mobile)) {
      setLoading(false);
      throw new Error("Mobile number already registered.");
    }
    
    const newUser: User = { id: `user-${Date.now()}`, mobile, role: 'user' };
    // In real app: MOCK_USERS.push(newUser); MOCK_USER_CREDENTIALS[mobile] = password; Mark invitation code as used.
    setUser(newUser);
    sessionStorage.setItem('feiwuUser', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('feiwuUser');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
