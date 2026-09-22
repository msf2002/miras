import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
);

// ✅ selectorها — بدون setState، بدون حلقه
export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );