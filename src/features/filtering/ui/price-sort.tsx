import { observer } from 'mobx-react-lite';
import { Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { filterStore } from '@/entities/filter/model';
import styles from './price-sort.module.scss';

export const PriceSort = observer(() => {
  const priceSortIcon =
    filterStore.priceSort === 'asc' ? (
      <ArrowUpOutlined />
    ) : filterStore.priceSort === 'desc' ? (
      <ArrowDownOutlined />
    ) : undefined;

  const priceSortText =
    filterStore.priceSort === 'none'
      ? 'Не активно'
      : filterStore.priceSort === 'asc'
      ? 'По возрастанию'
      : 'По убыванию';

  return (
    <Button
      type={filterStore.priceSort !== 'none' ? 'primary' : 'default'}
      icon={priceSortIcon}
      onClick={() => filterStore.togglePriceSort()}
      className={styles.sortButton}
    >
      {priceSortText}
    </Button>
  );
});

