import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password, role) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Optional: Check if role matches what's expected for this login portal
      if (role && data.role !== role && role !== 'admin') { 
         if(data.role !== role) {
             console.error(`Role mismatch: expected ${role}, got ${data.role}`);
             return false;
         }
      }

      // If we are logging into admin portal, ensure user is admin
      if (role === 'admin' && data.role !== 'admin') {
         console.error('Access denied: Not an admin');
         return false;
      }

      set({
        user: data,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  register: async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      set({
        user: data,
        isAuthenticated: true,
      });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
