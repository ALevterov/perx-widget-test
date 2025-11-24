import { FilterState } from '@/types';

// Helper to get search params from hash or regular URL
const getSearchParams = (): URLSearchParams => {
  // Check if we're using hash routing
  const hash = window.location.hash;
  if (hash && hash.includes('?')) {
    const hashParts = hash.split('?');
    if (hashParts.length > 1) {
      return new URLSearchParams(hashParts[1]);
    }
  }
  // Fallback to regular search params
  return new URLSearchParams(window.location.search);
};

export const getFiltersFromURL = (): Partial<FilterState> => {
  const params = getSearchParams();
  const filters: Partial<FilterState> = {};

  const dealerIds = params.get('dealers');
  if (dealerIds) {
    filters.dealerIds = dealerIds.split(',').filter(Boolean);
  }

  const priceSort = params.get('priceSort');
  if (priceSort === 'asc' || priceSort === 'desc') {
    filters.priceSort = priceSort;
  }

  return filters;
};

export const updateURLWithFilters = (filters: FilterState): void => {
  const params = new URLSearchParams();

  if (filters.dealerIds.length > 0) {
    params.set('dealers', filters.dealerIds.join(','));
  }

  if (filters.priceSort !== 'none') {
    params.set('priceSort', filters.priceSort);
  }

  // Check if we're using hash routing
  const hash = window.location.hash;
  const isHashRouter = hash && hash.startsWith('#/');

  if (isHashRouter) {
    // Extract current path from hash
    const currentPath = hash.split('?')[0] || '#/';
    const newHash = params.toString()
      ? `${currentPath}?${params.toString()}`
      : currentPath;
    window.history.pushState({}, '', `${window.location.pathname}${newHash}`);
  } else {
    // Regular routing
    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;
    window.history.pushState({}, '', newURL);
  }
};

