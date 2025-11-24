export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  dealerId: string | undefined;
  dealerName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  dealerIds: string[];
  priceSort: 'none' | 'asc' | 'desc';
}

export interface WidgetConfig {
  el: string | HTMLElement; // Селектор или DOM элемент
  dealers?: string[]; // Массив ID дилеров
}

export type Dealer = string

