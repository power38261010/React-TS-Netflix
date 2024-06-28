// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import {encryptProfile, decryptProfile} from './crypto/cryptoJS'
import { ProfileUpdate } from '../app/interfaces/ProfileUpdate';
import { Subscription } from '../app/interfaces/Subscription';

const secret = process.env.REACT_APP_API_KEY;
const audit = process.env.REACT_APP_API_AUD;

export interface Profile {
  id: number;
  role: string;
  username: string;
  email: string;
  isPaid?: boolean;
  subscriptionId?: number;
  subscription?: Subscription;
  expirationDate?: Date;
}
interface AuthContextType {
  profile: Profile | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string,email: string, password: string, subscriptionId: number) => Promise<boolean>;
  updateProfile : (id: number, userData: ProfileUpdate) => Promise<boolean>;
  refreshProfile: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
  verifyTokenInServer: () => Promise<boolean>;
}

interface DecodedToken {
  unique_name: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setProfile(decryptProfile(storedProfile));
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { Username: username, PasswordHash: password });
      let { token } = response.data;
      let user = response.data.profile
      if ( verifySign(token) ) {
        setCredentials (token,user)
        return true;
      }
      return false;
    } catch (error : any) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (username: string,email: string, password: string, subscriptionId: number): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', { Username: username, Email:email, PasswordHash: password , SubscriptionId: subscriptionId});
      let { token } = response.data;
      let user = response.data.profile
      if ( verifySign(token) ) {
        setCredentials (token,user)
        return true;
      }
      return false;
    } catch (error : any) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  };

  const updateProfile = async (id: number, userData: ProfileUpdate): Promise<boolean> =>{
    try {
      let response = await api.put(`/users/${id}`, userData);
      let { token } = response.data;
      let user = response.data.profile
      if ( verifySign(token) ) {
        setCredentials (token,user)
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return false;
    }
  }

  const refreshProfile = async (): Promise<boolean> =>{
    try {
      let response = await api.get(`/users/${profile?.id}`);
      let user = response.data;
      let token = localStorage.getItem('token');
      if ( user !== null && !!token) {
        removeCredentials();
        setCredentials (token,user)
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating user with ID ${profile?.id}:`, error);
      return false;
    }
  }


  const logout = async () => {
    await api.post('/auth/logout').then(()=> removeCredentials () );
  };

  const verifySign = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
      let  {aud, iss} = decoded;
      return (aud === audit && iss === secret);
  };

  // validate-jwt
  const verifyTokenInServer = async () : Promise<boolean> => {
    try {
        if ( token && verifySign( token)  ) {
          let response = await api.post('/auth/validate-jwt', { token : token })
          if (response.request?.status === 200 &&  response.data.isValidated) return true
        }
        removeCredentials()
        return false;
      } catch (error) {
        removeCredentials()
        console.error('Error al usar el path /auth/validate-jwt:', error);
        return false;
      }
  };

  const removeCredentials = () => {
    setToken(null);
    setProfile(null)
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
  };

  const setCredentials = (token:string , profile:Profile) => {
    setToken(token);
    setProfile(profile);
    localStorage.setItem('token', token);
    let encryptedProfile = encryptProfile (profile)
    localStorage.setItem('profile', encryptedProfile);
  };

  const isAuthenticated = (): boolean => {
    return !!token
  };

  return (
    <AuthContext.Provider value={{ profile, token, login, register, updateProfile, logout, isAuthenticated, verifyTokenInServer, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useToken = (): string | null => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useToken must be used within an AuthProvider');
  }
  return context.token;
};
