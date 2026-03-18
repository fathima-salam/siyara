import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlistItems: [],
            addToWishlist: (product) => {
                const items = get().wishlistItems;
                const exists = items.find((x) => x._id === product._id);
                if (!exists) {
                    set({ wishlistItems: [...items, product] });
                }
            },
            removeFromWishlist: (id) => {
                const items = get().wishlistItems;
                set({ wishlistItems: items.filter((x) => x._id !== id) });
            },
            isInWishlist: (id) => {
                return get().wishlistItems.some((x) => x._id === id);
            },
            clearWishlist: () => set({ wishlistItems: [] }),
        }),
        {
            name: 'siyara-wishlist',
        }
    )
);
