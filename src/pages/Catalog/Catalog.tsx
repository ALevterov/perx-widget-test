import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Col, Tag, Button, Spin, Empty, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import productStore from '../../stores/ProductStore';
import filterStore from '../../stores/FilterStore';
import cartStore from '../../stores/CartStore';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Catalog.module.scss';

const Catalog: React.FC = () => {
  useEffect(() => {
    // Загружаем дилеров сразу, чтобы они отображались в фильтре
    if (productStore.dealerIds.length === 0) {
      productStore.loadDealers();
    }

    // В каталоге загружаем все товары (без фильтра), чтобы фильтр работал правильно
    // Перезагружаем, если товары еще не загружены или загружены только для конкретных дилеров
    if (!productStore.loading && (productStore.products.length === 0 || productStore.loadedForSpecificDealers)) {
      // Загружаем все товары (undefined = без фильтра по дилерам), фильтрация будет на клиенте
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

  // Observer will automatically track changes to these reactive values
  const dealers = productStore.getDealers() || [];
  const filteredProducts = productStore.products.length > 0 
    ? productStore.getFilteredProducts(filterStore.dealerIds, filterStore.priceSort)
    : [];

  const handlePriceSort = () => {
    filterStore.togglePriceSort();
  };

  const priceSortIcon = filterStore.priceSort === 'asc' 
    ? <ArrowUpOutlined /> 
    : filterStore.priceSort === 'desc' 
    ? <ArrowDownOutlined /> 
    : undefined;

  const priceSortText = filterStore.priceSort === 'none' 
    ? 'Не активно' 
    : filterStore.priceSort === 'asc' 
    ? 'По возрастанию' 
    : filterStore.priceSort === 'desc' 
    ? 'По убыванию' 
    : 'Не активно';

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>Каталог товаров</h1>

      <div className={styles.filters}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Дилеры:</h3>
          <Space wrap>
            {dealers.length > 0 ? (
              dealers.map((dealer) => (
                <Tag
                  key={dealer.id}
                  color={filterStore.dealerIds.includes(dealer.id) ? 'blue' : 'default'}
                  onClick={() => filterStore.toggleDealer(dealer.id)}
                  className={styles.dealerTag}
                >
                  {dealer.name || `Дилер ${dealer.id}`}
                </Tag>
              ))
            ) : (
              <span className={styles.loadingText}>Загрузка дилеров...</span>
            )}
          </Space>
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Сортировка по цене:</h3>
          <Button
            type={filterStore.priceSort !== 'none' ? 'primary' : 'default'}
            icon={priceSortIcon}
            onClick={handlePriceSort}
            className={styles.sortButton}
          >
            {priceSortText}
          </Button>
        </div>
      </div>

      {productStore.loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.empty}>
          <Empty description="Товары не найдены" />
        </div>
      ) : (
        <>
          <div className={styles.count}>
            Найдено товаров: {filteredProducts.length}
          </div>
          <Row gutter={[16, 16]} className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <Col
                key={product.id}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default observer(Catalog);

