import { Product } from '@/entities/product';

const API_BASE_URL = 'https://test-frontend.dev.int.perx.ru';

export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  logo?: string;
  dealer?: string;
  dealer_name?: string;
}

export type ApiDealer = string;

export const fetchProducts = async (dealerIds?: string[]): Promise<ApiProduct[]> => {
  let url = `${API_BASE_URL}/api/goods/`;

  if (dealerIds && dealerIds.length > 0) {
    const dealersParam = dealerIds.join(',');
    url += `?dealers=${dealersParam}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const res = await response.json();
  return res;
};

export const fetchDealers = async (): Promise<ApiDealer[]> => {
  const response = await fetch(`${API_BASE_URL}/api/dealers/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dealers: ${response.statusText}`);
  }

  const res = await response.json();
  return res;
};

export const getProductImageUrl = (logoPath?: string): string => {
  if (!logoPath) {
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }

  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    return logoPath;
  }

  if (logoPath.startsWith('/')) {
    return `${API_BASE_URL}${logoPath}`;
  }

  return `${API_BASE_URL}/logo/${logoPath}`;
};

export const apiProductsToReal = (apiProducts: ApiProduct[]): Product[] =>
  apiProducts.map((apiProduct) => ({
    id: apiProduct.id,
    title: apiProduct.name,
    price: apiProduct.price,
    image: getProductImageUrl(apiProduct.logo || apiProduct.image),
    dealerId: apiProduct.dealer,
    dealerName: apiProduct.dealer_name || `Дилер ${apiProduct.dealer || 'unknown'}`,
  }));

