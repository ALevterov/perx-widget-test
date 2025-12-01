import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Col, Spin, Empty } from 'antd';
import { productStore } from '@/entities/product/model';
import { filterStore } from '@/entities/filter/model';
import { cartStore } from '@/entities/cart/model';
import { ProductCard } from '@/shared/ui/product-card';
import styles from './catalog-product-list.module.scss';

export const CatalogProductList = observer(() => {
  useEffect(() => {
    if (productStore.dealerIds.length === 0) {
      productStore.loadDealers();
    }

    if (!productStore.loading && productStore.products.length === 0) {
      productStore.loadProducts(undefined).then(() => {
        if (productStore.products.length > 0) {
          cartStore.setProducts(productStore.products);
        }
      }).catch((error) => {
        console.error('Error loading products:', error);
      });
    } else if (productStore.products.length > 0) {
      cartStore.setProducts(productStore.products);
    }
  }, []);

  const filteredProducts = productStore.getSortedProducts(filterStore.priceSort);

  if (productStore.loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className={styles.empty}>
        <Empty description="Товары не найдены" />
      </div>
    );
  }

  return (
    <>
      <div className={styles.count}>
        Найдено товаров: {filteredProducts.length}
      </div>
      <Row gutter={[16, 16]} className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
});

