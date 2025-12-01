import { makeAutoObservable } from 'mobx';
import { FilterState } from '../types';
import { getFiltersFromURL, updateURLWithFilters } from '@/shared/lib';

class FilterStore {
  dealerIds: string[] = [];
  priceSort: 'none' | 'asc' | 'desc' = 'none';

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      try {
        this.loadFromURL();
      } catch (error) {
        console.error('Error loading filters from URL:', error);
      }
    }
  }

  loadFromURL() {
    try {
      const filters = getFiltersFromURL();
      if (filters.dealerIds) {
        this.dealerIds = filters.dealerIds;
      }
      if (filters.priceSort) {
        this.priceSort = filters.priceSort;
      }
    } catch (error) {
      console.error('Error parsing filters from URL:', error);
    }
  }

  toggleDealer(dealerId: string) {
    if (this.dealerIds.includes(dealerId)) {
      this.dealerIds = this.dealerIds.filter((id) => id !== dealerId);
    } else {
      this.dealerIds = [...this.dealerIds, dealerId];
    }
    this.updateURL();
  }

  setPriceSort(sort: 'none' | 'asc' | 'desc') {
    this.priceSort = sort;
    this.updateURL();
  }

  togglePriceSort() {
    if (this.priceSort === 'none') {
      this.priceSort = 'asc';
    } else if (this.priceSort === 'asc') {
      this.priceSort = 'desc';
    } else {
      this.priceSort = 'none';
    }
    this.updateURL();
  }

  updateURL() {
    try {
      if (typeof window !== 'undefined') {
        updateURLWithFilters({
          dealerIds: this.dealerIds,
          priceSort: this.priceSort,
        });
      }
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  }

  reset() {
    this.dealerIds = [];
    this.priceSort = 'none';
    this.updateURL();
  }
}

export const filterStore = new FilterStore();

