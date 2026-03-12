import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],
            shippingAddress: {},
            paymentMethod: 'cod',

            addItem: (item) => {
                const price = Number(item.price ?? item.pricing?.offerPrice ?? item.pricing?.sellingPrice ?? 0);
                const name = item.productName ?? item.name ?? '';
                const image = item.image ?? item.thumbnails?.[0] ?? item.variants?.[0]?.images?.[0] ?? item.images?.[0];
                const normalized = { ...item, price, name, image, qty: item.qty ?? 1 };
                const existItem = get().cartItems.find((x) => x._id === item._id && (x.size || '') === (item.size || '') && (x.color || '') === (item.color || ''));
                if (existItem) {
                    set({
                        cartItems: get().cartItems.map((x) =>
                            x._id === existItem._id && x.size === existItem.size && x.color === existItem.color ? normalized : x
                        ),
                    });
                } else {
                    set({ cartItems: [...get().cartItems, normalized] });
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
