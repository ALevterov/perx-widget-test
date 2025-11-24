import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Badge, Button } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import cartStore from '@/stores/CartStore';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>Perx Catalog</div>
        <nav className={styles.nav}>
          <Button
            type={location.pathname === '/' ? 'primary' : 'default'}
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            Главная
          </Button>
          <Button
            type={location.pathname === '/catalog' ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => navigate('/catalog')}
          >
            Каталог
          </Button>
          <Badge count={cartStore.totalItems} showZero={false}>
            <Button
              type={location.pathname === '/cart' ? 'primary' : 'default'}
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate('/cart')}
            >
              Корзина
            </Button>
          </Badge>
        </nav>
      </div>
    </header>
  );
};

export default observer(Header);

