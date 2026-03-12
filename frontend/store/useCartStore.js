import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],
            shippingAddress: {},
            paymentMethod: 'Stripe',

            addItem: (item) => {
                const existItem = get().cartItems.find((x) => x._id === item._id && x.size === item.size && x.color === item.color);
                if (existItem) {
                    set({
                        cartItems: get().cartItems.map((x) =>
                            x._id === existItem._id && x.size === existItem.size && x.color === existItem.color ? item : x
                        ),
                    });
                } else {
                    set({ cartItems: [...get().cartItems, item] });
                }
            },

            removeItem: (id, size, color) => {
                set({
                    cartItems: get().cartItems.filter((x) => !(x._id === id && x.size === size && x.color === color)),
                });
            },

            saveShippingAddress: (data) => set({ shippingAddress: data }),
            savePaymentMethod: (data) => set({ paymentMethod: data }),
            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: 'siyara-cart',
        }
    )
);
