import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock users for demo
const mockUsers = {
  'admin@rachna.com': {
    id: '1',
    email: 'admin@rachna.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  },
  'csm@rachna.com': {
    id: '2',
    email: 'csm@rachna.com',
    name: 'Sarah CSM',
    role: 'csm',
    password: 'csm123',
    createdAt: new Date().toISOString(),
  },
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password, role) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser = mockUsers[email.toLowerCase()];

        if (
          mockUser &&
          mockUser.password === password &&
          mockUser.role === role
        ) {
          // Remove password before storing user
          const { password: _, ...userWithoutPassword } = mockUser;

          set({
            user: userWithoutPassword,
            isAuthenticated: true,
          });

          return true;
        }

        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
