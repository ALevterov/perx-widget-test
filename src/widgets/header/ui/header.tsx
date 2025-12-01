import { useNavigate, useMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Badge, Button } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { cartStore } from '@/entities/cart/model';
import styles from './header.module.scss';

export const Header = observer(() => {
  const navigate = useNavigate();
  const isHomeActive = !!useMatch('/');
  const isCatalogActive = !!useMatch('/catalog');
  const isCartActive = !!useMatch('/cart');

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>🛍️ Perx Catalog</div>
        <nav className={styles.nav}>
          <Button
            type={isHomeActive ? 'primary' : 'default'}
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            Главная
          </Button>
          <Button
            type={isCatalogActive ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => navigate('/catalog')}
          >
            Каталог
          </Button>
          <Badge count={cartStore.totalItems} showZero={false}>
            <Button
              type={isCartActive ? 'primary' : 'default'}
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
});

