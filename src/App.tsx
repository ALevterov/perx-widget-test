import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/providers';
import { Header } from '@/widgets/header';
import { HomePage } from '@/pages/Home';
import { CatalogPage } from '@/pages/Catalog';
import { CartPage } from '@/pages/Cart';
import styles from './App.module.scss';

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className={styles.app}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};
