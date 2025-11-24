const CART_STORAGE_KEY = 'perx_cart';
const CART_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

export interface StoredCart {
  items: Array<{ productId: string; quantity: number }>;
  timestamp: number;
}

export const saveCartToStorage = (items: Array<{ productId: string; quantity: number }>): void => {
  const data: StoredCart = {
    items,
    timestamp: Date.now(),
  };
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
};

export const loadCartFromStorage = (): Array<{ productId: string; quantity: number }> | null => {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    if (!data) return null;

    const stored: StoredCart = JSON.parse(data);
    const now = Date.now();

    // Check if cart expired
    if (now - stored.timestamp > CART_EXPIRY_TIME) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }

    return stored.items;
  } catch {
    return null;
  }
};

export const clearCartStorage = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

