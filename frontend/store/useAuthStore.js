import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            userInfo: null,
            setUserInfo: (info) => set({ userInfo: info }),
            logout: () => set({ userInfo: null }),
        }),
        {
            name: 'siyara-auth',
        }
    )
);
