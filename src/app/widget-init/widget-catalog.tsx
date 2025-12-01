import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../providers/app-provider';
import { Header } from '@/widgets/header';
import { HomePage } from '@/pages/Home';
import { CatalogPage } from '@/pages/Catalog';
import { CartPage } from '@/pages/Cart';
import { productStore } from '@/entities/product/model';
import { cartStore } from '@/entities/cart/model';
import { WidgetConfig } from '@/entities/widget';
import 'antd/dist/reset.css';
import '../../index.scss';

export class WidgetCatalog {
  private container: HTMLElement | null = null;
  private root: ReactDOM.Root | null = null;
  private config: WidgetConfig | null = null;

  constructor(config: WidgetConfig) {
    this.config = config;
  }

  run() {
    if (!this.config) {
      console.error('WidgetCatalog: config is required');
      return;
    }

    const { el, dealers } = this.config;

    const container = this.findContainer(el);
    if (!container) {
      console.error(`WidgetCatalog: Container "${String(el)}" not found`);
      return;
    }

    this.container = container;

    this.initializeData(dealers).then(() => {
      this.render();
    });
  }

  private findContainer(el: string | HTMLElement): HTMLElement | null {
    if (typeof el === 'string') {
      if (el.startsWith('#')) {
        return document.getElementById(el.substring(1));
      } else if (el.startsWith('.')) {
        return document.querySelector(el) as HTMLElement;
      } else {
        return document.querySelector(el) as HTMLElement;
      }
    } else if (el instanceof HTMLElement) {
      return el;
    }
    return null;
  }

  private async initializeData(dealers?: string[]): Promise<void> {
    if (dealers && dealers.length > 0) {
      productStore.setDealerIds(dealers);
      await productStore.loadProducts(dealers);
    } else {
      await productStore.loadProducts();
    }

    if (productStore.products.length > 0) {
      cartStore.setProducts(productStore.products);
    }
  }

  private render() {
    if (!this.container) return;

    this.root = ReactDOM.createRoot(this.container);

    this.root.render(
      <React.StrictMode>
        <AppProvider>
          <div style={{ width: '100%', minHeight: '100vh' }}>
            <HashRouter>
              <Header />
              <main style={{ padding: 0, margin: 0, width: '100%' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/cart" element={<CartPage />} />
                </Routes>
              </main>
            </HashRouter>
          </div>
        </AppProvider>
      </React.StrictMode>
    );
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.container = null;
    this.config = null;
  }
}

if (typeof window !== 'undefined') {
  (window as any).WidgetCatalog = WidgetCatalog;
}

export default WidgetCatalog;

