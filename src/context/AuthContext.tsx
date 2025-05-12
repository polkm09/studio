
"use client";

import type { User, InvitationCode } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { MOCK_USERS, MOCK_USER_CREDENTIALS, MOCK_INVITATION_CODES } from '@/lib/types'; 

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
    
    if (!/^\d{11}$/.test(mobile)) {
      setLoading(false);
      throw new Error("无效的手机号码格式。");
    }

    const codeEntryIndex = MOCK_INVITATION_CODES.findIndex(c => c.code === invitationCode.toUpperCase());
    
    if (codeEntryIndex === -1) {
      setLoading(false);
      throw new Error("邀请码无效。");
    }

    const codeEntry = MOCK_INVITATION_CODES[codeEntryIndex];

    if (!codeEntry.isValid || codeEntry.usedBy) {
      setLoading(false);
      throw new Error("邀请码无效或已被使用。");
    }

    if (MOCK_USERS.find(u => u.mobile === mobile)) {
      setLoading(false);
      throw new Error("手机号码已被注册。");
    }
    
    const newUser: User = { id: `user-${Date.now()}`, mobile, role: 'user' };
    MOCK_USERS.push(newUser); // Add user to mock list
    MOCK_USER_CREDENTIALS[mobile] = password; // Add credentials to mock list

    // Mark invitation code as used
    MOCK_INVITATION_CODES[codeEntryIndex] = {
      ...codeEntry,
      isValid: false,
      usedBy: newUser.id,
    };
    
    // Note: In a real app, MOCK_USERS, MOCK_USER_CREDENTIALS, and MOCK_INVITATION_CODES updates
    // would be persistent database operations. Here they modify in-memory arrays.
    // For MOCK_INVITATION_CODES, if admin page is open, it won't reflect change until refresh.

    setUser(newUser); // Set current user for the session
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

