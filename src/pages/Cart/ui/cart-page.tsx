import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { List, Button, Empty, Card, Space, InputNumber, Popconfirm, Spin } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { cartStore } from '@/entities/cart/model';
import { productStore } from '@/entities/product/model';
import styles from './cart-page.module.scss';

export const CartPage = observer(() => {
  useEffect(() => {
    const loadData = async () => {
      try {
        // Всегда загружаем товары перед синхронизацией корзины
        if (productStore.products.length === 0) {
          await productStore.loadProducts();
        }
        // Синхронизируем корзину с загруженными товарами
        if (productStore.products.length > 0) {
          cartStore.setProducts(productStore.products);
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };
    loadData();
  }, []);

  const handleQuantityChange = (productId: string, value: number | null) => {
    if (value !== null && value > 0) {
      cartStore.updateQuantity(productId, value);
    }
  };

  const handleRemove = (productId: string) => {
    cartStore.removeProduct(productId);
  };

  const handleClearCart = () => {
    cartStore.clearCart();
  };

  // Filter out items with invalid products
  const validItems = cartStore.items.filter((item) => item.product && item.product.id);

  if (productStore.loading) {
    return (
      <div className={styles.cart}>
        <h1 className={styles.title}>Корзина</h1>
        <div className={styles.empty}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (validItems.length === 0) {
    return (
      <div className={styles.cart}>
        <h1 className={styles.title}>Корзина</h1>
        <div className={styles.empty}>
          <Empty
            image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
            description="Корзина пуста"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <div className={styles.header}>
        <h1 className={styles.title}>Корзина</h1>
        <Popconfirm
          title="Очистить корзину?"
          description="Вы уверены, что хотите удалить все товары?"
          onConfirm={handleClearCart}
          okText="Да"
          cancelText="Нет"
        >
          <Button danger icon={<DeleteOutlined />}>
            Очистить корзину
          </Button>
        </Popconfirm>
      </div>

      <div className={styles.content}>
        <div className={styles.list}>
          <List
            dataSource={validItems}
            renderItem={(item) => (
              <List.Item>
                <Card className={styles.itemCard}>
                  <div className={styles.itemContent}>
                    <div className={styles.itemImage}>
                      <img src={item.product.image} alt={item.product.title} />
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.product.title}</h3>
                      <div className={styles.itemDealer}>{item.product.dealerName}</div>
                      <div className={styles.itemPrice}>
                        {item.product.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div className={styles.itemControls}>
                      <Space>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => cartStore.decrementQuantity(item.product.id)}
                          size="small"
                        />
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.product.id, value)}
                          size="small"
                          style={{ width: 80 }}
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => cartStore.incrementQuantity(item.product.id)}
                          size="small"
                        />
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemove(item.product.id)}
                          size="small"
                        >
                          Удалить
                        </Button>
                      </Space>
                      <div className={styles.itemTotal}>
                        Итого: {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>

        <Card className={styles.summary}>
          <div className={styles.summaryContent}>
            <div className={styles.summaryRow}>
              <span>Товаров в корзине:</span>
              <span className={styles.summaryValue}>
                {validItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Итоговая стоимость:</span>
              <span className={styles.summaryTotal}>
                {validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <Button type="primary" size="large" block className={styles.checkoutButton}>
              Оформить заказ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
});

