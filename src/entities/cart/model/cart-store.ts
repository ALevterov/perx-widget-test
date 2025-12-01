import { makeAutoObservable } from 'mobx';
import { Product } from '@/entities/product';
import { CartItem } from '../types';
import { saveCartToStorage, loadCartFromStorage, clearCartStorage } from '@/shared/lib';

class CartStore {
  items: CartItem[] = [];
  products: Product[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  setProducts(products: Product[]) {
    this.products = products;
    this.syncWithStorage();
  }

  loadFromStorage() {
    // Просто загружаем данные из localStorage, но не заполняем items
    // до тех пор, пока не загрузятся продукты через setProducts
    // Это предотвращает создание items с пустыми продуктами
  }

  syncWithStorage() {
    const stored = loadCartFromStorage();
    if (stored && stored.length > 0) {
      this.items = stored
        .map((item) => {
          const product = this.products.find((p) => p.id === item.productId);
          if (product) {
            return { product, quantity: item.quantity };
          }
          return null;
        })
        .filter((item): item is CartItem => item !== null);
      this.saveToStorage();
    } else {
      // Если хранилище пустое, очищаем items
      this.items = [];
    }
  }

  saveToStorage() {
    const data = this.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    saveCartToStorage(data);
  }

  addProduct(product: Product) {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }

    this.saveToStorage();
  }

  removeProduct(productId: string) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveToStorage();
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveToStorage();
    }
  }

  incrementQuantity(productId: string) {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      item.quantity += 1;
      this.saveToStorage();
    }
  }

  decrementQuantity(productId: string) {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeProduct(productId);
      }
      this.saveToStorage();
    }
  }

  clearCart() {
    this.items = [];
    clearCartStorage();
  }

  get totalItems() {
    return this.items
      .filter((item) => item.product && item.product.id)
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.items
      .filter((item) => item.product && item.product.id)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  isInCart(productId: string): boolean {
    return this.items.some(
      (item) => item.product && item.product.id && item.product.id === productId
    );
  }

  getQuantity(productId: string): number {
    const item = this.items.find(
      (item) => item.product && item.product.id && item.product.id === productId
    );
    return item ? item.quantity : 0;
  }
}

export const cartStore = new CartStore();

