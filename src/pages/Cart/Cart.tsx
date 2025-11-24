import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { List, Button, Empty, Card, Space, InputNumber, Popconfirm } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import cartStore from '../../stores/CartStore';
import productStore from '../../stores/ProductStore';
import styles from './Cart.module.scss';

const Cart: React.FC = () => {
  useEffect(() => {
    if (productStore.products.length === 0) {
      productStore.loadProducts();
    }
    cartStore.setProducts(productStore.products);
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

  if (cartStore.items.length === 0) {
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
            dataSource={cartStore.items}
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
              <span className={styles.summaryValue}>{cartStore.totalItems}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Итоговая стоимость:</span>
              <span className={styles.summaryTotal}>
                {cartStore.totalPrice.toLocaleString('ru-RU')} ₽
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
};

export default observer(Cart);

