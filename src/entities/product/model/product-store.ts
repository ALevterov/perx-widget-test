import { makeAutoObservable, reaction } from 'mobx';
import { Product, Dealer } from '../types';
import { fetchProducts, fetchDealers, apiProductsToReal, ApiProduct } from '@/shared/api';
import { filterStore } from '@/entities/filter/model';

class ProductStore {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  dealerIds: string[] = [];
  loading = false;
  error: string | null = null;
  selectedDealerIds?: string[];
  loadedForSpecificDealers = false;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => ({
        dealerIds: filterStore.dealerIds.slice(),
        productsLoaded: this.products.length,
      }),
      () => {
        this.loadFilteredProducts();
      },
      { fireImmediately: true }
    );

    this.loadDealers();
  }

  setDealerIds(dealerIds?: string[]) {
    this.selectedDealerIds = dealerIds;
  }

  async loadDealers() {
    try {
      const apiDealerIds = await fetchDealers();
      this.dealerIds = apiDealerIds;
    } catch (error) {
      console.error('Error loading dealers:', error);
    }
  }

  async loadProducts(dealerIdsForApi?: string[]) {
    this.loading = true;
    this.error = null;

    try {
      if (this.dealerIds.length === 0) {
        await this.loadDealers();
      }

      const apiProducts = await fetchProducts(dealerIdsForApi);
      this.products = apiProductsToReal(apiProducts);
      
      // Если загружались товары для конкретных дилеров, отмечаем это
      this.loadedForSpecificDealers = !!dealerIdsForApi && dealerIdsForApi.length > 0;
      
      // Сбрасываем filteredProducts, чтобы они обновились через reaction
      this.filteredProducts = [];
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Ошибка загрузки товаров';
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  }

  getDealers(): Dealer[] {
    const dealerNamesMap = new Map<string, string>();
    this.products.forEach((product) => {
      if (product.dealerId && product.dealerName && !dealerNamesMap.has(product.dealerId)) {
        dealerNamesMap.set(product.dealerId, product.dealerName);
      }
    });

    if (this.dealerIds.length > 0) {
      return this.dealerIds.map((id) => ({
        id,
        name: dealerNamesMap.get(id) || `Дилер ${id}`,
      }));
    }

    if (dealerNamesMap.size > 0) {
      return Array.from(dealerNamesMap.entries()).map(([id, name]) => ({ id, name }));
    }

    return [];
  }

  async loadFilteredProducts() {
    if (!filterStore.dealerIds.length) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const filtered = await fetchProducts(filterStore.dealerIds);
      this.filteredProducts = apiProductsToReal(filtered);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Ошибка загрузки товаров';
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  }

  getSortedProducts(priceSort: 'none' | 'asc' | 'desc'): Product[] {
    const products = [...this.filteredProducts];
    if (priceSort === 'asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      products.sort((a, b) => b.price - a.price);
    }
    return products;
  }

  getHomeProducts(): Product[] {
    const expensiveProducts = this.products.filter((p) => p.price >= 10);
    
    if (expensiveProducts.length < 5) {
      return this.products.slice(0, 8);
    }
    
    return expensiveProducts;
  }
}

export const productStore = new ProductStore();

