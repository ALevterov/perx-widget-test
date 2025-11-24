import { makeAutoObservable, reaction } from 'mobx';
import { Product } from '@/types';
import { fetchProducts, fetchDealers, getProductImageUrl, ApiProduct, apiProductsToReal } from '@/utils/api';
import FilterStore from './FilterStore';

class ProductStore {
  products: Product[] = [];
	filteredProducts: Product[] = [];
  dealerIds: string[] = []; // Массив ID дилеров из API
  loading = false;
  error: string | null = null;
  selectedDealerIds?: string[]; // Выбранные дилеры для фильтрации (из инициализации виджета)
  loadedForSpecificDealers = false; // Флаг: загружены ли товары только для конкретных дилеров

  constructor() {
    makeAutoObservable(this);

		reaction(
      () => ({
        dealerIds: FilterStore.dealerIds.slice(),
        productsLoaded: this.products.length 
      }),
      () => {
        this.loadFilteredProducts();
      }
			,
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
		console.log('loadProducts');
		
    this.loading = true;
    this.error = null;

    try {
      // Load dealers first (получаем массив ID дилеров), если еще не загружены
      if (this.dealerIds.length === 0) {
        await this.loadDealers();
      }
      
      const apiProducts = await fetchProducts();
      
      // Transform API products to our Product format
      // Имена дилеров извлекаем из поля dealer_name в товарах
      this.products = apiProductsToReal(apiProducts);
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

  async loadFilteredProducts() {
		console.log('loadFilteredProducts');
		
		if (!FilterStore.dealerIds.length) {
			return this.filteredProducts = [...this.products]
		}

		this.loading = true;
    this.error = null;

		try {
			let filtered = await fetchProducts(FilterStore.dealerIds);
			this.filteredProducts = apiProductsToReal(filtered)
		} catch(error) {
			this.error = error instanceof Error ? error.message : 'Ошибка загрузки товаров';
      console.error('Error loading products:', error);
		} finally {
			this.loading = false;
		}
  }

	getSortedProducts(priceSort: 'none' | 'asc' | 'desc') {
	// Sort by price
	const products = [...this.filteredProducts]
    if (priceSort === 'asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      products.sort((a, b) => b.price - a.price);
    }
		return products
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

