import { supabase } from './supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
}

// Auth functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with magic link
  signInWithMagicLink: async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Profile functions
export const profiles = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<AuthUser>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Check if user is admin
  isAdmin: async (userId: string) => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('profile_id', userId)
      .single();
    return { isAdmin: !!data, error };
  },
};

// Helper function to convert Supabase user to AuthUser
export const convertUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
  };
};

// Helper function to get user role
export const getUserRole = async (userId: string): Promise<string> => {
  const { data } = await profiles.getProfile(userId);
  return data?.role || 'user';
};
