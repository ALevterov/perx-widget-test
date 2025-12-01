export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  dealerId: string | undefined;
  dealerName: string;
}

export interface Dealer {
  id: string;
  name: string;
}

export type DealerId = string;

