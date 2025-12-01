import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { productStore } from '@/entities/product/model';
import { DealerFilter, PriceSort } from '@/features/filtering/ui';
import { CatalogProductList } from '@/features/product-list/ui';
import styles from './catalog-page.module.scss';

export const CatalogPage = observer(() => {
  useEffect(() => {
    if (productStore.dealerIds.length === 0) {
      productStore.loadDealers();
    }
  }, []);

  const dealers = productStore.getDealers();

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>Каталог товаров</h1>

      <div className={styles.filters}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Дилеры:</h3>
          <DealerFilter dealers={dealers} />
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Сортировка по цене:</h3>
          <PriceSort />
        </div>
      </div>

      <CatalogProductList />
    </div>
  );
});

