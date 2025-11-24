import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Cart from './pages/Cart/Cart';
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={ruRU}>
      <div className={styles.app}>
        <BrowserRouter>
          <Header />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </ConfigProvider>
  );
};

export default App;

