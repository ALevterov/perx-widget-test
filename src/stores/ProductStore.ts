import { makeAutoObservable } from 'mobx';
import { Product } from '../types';
import { fetchProducts, fetchDealers, getProductImageUrl, ApiProduct } from '../utils/api';

class ProductStore {
  products: Product[] = [];
  dealerIds: string[] = []; // Массив ID дилеров из API
  loading = false;
  error: string | null = null;
  selectedDealerIds?: string[]; // Выбранные дилеры для фильтрации (из инициализации виджета)
  loadedForSpecificDealers = false; // Флаг: загружены ли товары только для конкретных дилеров

  constructor() {
    makeAutoObservable(this);
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
      // Load dealers first (получаем массив ID дилеров), если еще не загружены
      if (this.dealerIds.length === 0) {
        await this.loadDealers();
      }

      // Load products - используем переданные dealerIds или selectedDealerIds из виджета
      // Если ничего не передано, загружаем все товары
      const dealerIdsToFetch = dealerIdsForApi || this.selectedDealerIds;
      this.loadedForSpecificDealers = !!dealerIdsToFetch && dealerIdsToFetch.length > 0;
      
      const apiProducts = await fetchProducts(dealerIdsToFetch);
      
      // Transform API products to our Product format
      // Имена дилеров извлекаем из поля dealer_name в товарах
      this.products = apiProducts.map((apiProduct: ApiProduct) => ({
        id: apiProduct.id,
        title: apiProduct.name,
        price: apiProduct.price,
        image: getProductImageUrl(apiProduct.logo || apiProduct.image),
        dealerId: apiProduct.dealer,
        dealerName: apiProduct.dealer_name || `Дилер ${apiProduct.dealer}`,
      }));
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Ошибка загрузки товаров';
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  }

  getDealers(): Array<{ id: string; name: string }> {
    // Создаем карту имен дилеров из товаров
    const dealerNamesMap = new Map<string, string>();
    this.products.forEach((product) => {
      if (product.dealerId && product.dealerName && !dealerNamesMap.has(product.dealerId)) {
        dealerNamesMap.set(product.dealerId, product.dealerName);
      }
    });
    
    // Используем список дилеров из API, имена берем из товаров или дефолтные
    if (this.dealerIds.length > 0) {
      return this.dealerIds.map((id) => ({
        id,
        name: dealerNamesMap.get(id) || `Дилер ${id}`,
      }));
    }
    
    // Fallback: если нет дилеров из API, извлекаем из товаров
    if (dealerNamesMap.size > 0) {
      return Array.from(dealerNamesMap.entries()).map(([id, name]) => ({ id, name }));
    }
    
    return [];
  }

  getFilteredProducts(dealerIds: string[], priceSort: 'none' | 'asc' | 'desc'): Product[] {
    let filtered = [...this.products];

    // Filter by dealers
    if (dealerIds.length > 0) {
      filtered = filtered.filter((p) => dealerIds.includes(p.dealerId));
    }

    // Sort by price
    if (priceSort === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  getHomeProducts(): Product[] {
    // Get products with price >= 10
    const expensiveProducts = this.products.filter((p) => p.price >= 10);
    
		// If less than 5, return any 8 products
    if (expensiveProducts.length < 5) {
      return this.products.slice(0, 8);
    }
    
    return expensiveProducts;
  }
}

export default new ProductStore();

