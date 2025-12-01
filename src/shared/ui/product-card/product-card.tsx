import { observer } from 'mobx-react-lite';
import { Card, Button, InputNumber, Space } from 'antd';
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Product } from '@/entities/product';
import { cartStore } from '@/entities/cart/model';
import styles from './product-card.module.scss';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = observer(({ product }: ProductCardProps) => {
  const isInCart = cartStore.isInCart(product.id);
  const quantity = cartStore.getQuantity(product.id);

  const handleAdd = () => {
    cartStore.addProduct(product);
  };

  const handleIncrement = () => {
    cartStore.incrementQuantity(product.id);
  };

  const handleDecrement = () => {
    cartStore.decrementQuantity(product.id);
  };

  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value > 0) {
      cartStore.updateQuantity(product.id, value);
    }
  };

  return (
    <Card
      className={styles.card}
      hoverable
      cover={
        <div className={styles.imageContainer}>
          <img alt={product.title} src={product.image} className={styles.image} />
        </div>
      }
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.dealer}>{product.dealerName}</div>
        <div className={styles.price}>{product.price.toLocaleString('ru-RU')}</div>

        {isInCart ? (
          <div className={styles.cartControls}>
            <Space>
              <Button icon={<MinusOutlined />} onClick={handleDecrement} size="small" />
              <InputNumber
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                size="small"
                style={{ width: 60 }}
              />
              <Button icon={<PlusOutlined />} onClick={handleIncrement} size="small" />
            </Space>
          </div>
        ) : (
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAdd}
            block
            className={styles.addButton}
          >
            В корзину
          </Button>
        )}
      </div>
    </Card>
  );
});

