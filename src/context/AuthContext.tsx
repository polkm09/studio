
"use client";

import type { User } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  validateUserCredentials, 
  getUserByMobile, 
  addUser as addUserService 
} from '@/services/userService';
import { 
  getInvitationCodeByCode, 
  useInvitationCode as useInvitationCodeService 
} from '@/services/invitationCodeService';

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
    setLoading(true);
    const storedUser = sessionStorage.getItem('feiwuUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Optional: Add validation here to ensure parsedUser is a valid User object
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        sessionStorage.removeItem('feiwuUser');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (mobile: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const validatedUser = await validateUserCredentials(mobile, password);
      if (validatedUser) {
        setUser(validatedUser);
        sessionStorage.setItem('feiwuUser', JSON.stringify(validatedUser));
        return validatedUser;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (mobile: string, password: string, invitationCodeInput: string): Promise<User | null> => {
    setLoading(true);
    try {
      if (!/^\d{11}$/.test(mobile)) {
        throw new Error("无效的手机号码格式。");
      }

      const existingUser = await getUserByMobile(mobile);
      if (existingUser) {
        throw new Error("手机号码已被注册。");
      }
      
      const codeToValidate = invitationCodeInput.trim().toUpperCase();
      const codeEntry = await getInvitationCodeByCode(codeToValidate);

      if (!codeEntry) {
        throw new Error("邀请码无效。");
      }

      if (!codeEntry.isValid || codeEntry.usedBy) {
        throw new Error("邀请码无效或已被使用。");
      }

      // Attempt to add user first. If this fails, invitation code is not used.
      const newUser = await addUserService(mobile, password);
      
      // If user added successfully, then mark invitation code as used
      await useInvitationCodeService(codeEntry.id, newUser.id);
      
      // No automatic login after registration, user should proceed to login page
      // setUser(newUser); 
      // sessionStorage.setItem('feiwuUser', JSON.stringify(newUser));
      return newUser; 
    } finally {
      setLoading(false);
    }
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
