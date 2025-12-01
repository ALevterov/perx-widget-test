import { observer } from 'mobx-react-lite';
import { Tag, Space } from 'antd';
import { Dealer } from '@/entities/product';
import { filterStore } from '@/entities/filter/model';
import styles from './dealer-filter.module.scss';

interface DealerFilterProps {
  dealers: Dealer[];
}

export const DealerFilter = observer(({ dealers }: DealerFilterProps) => {
  if (dealers.length === 0) {
    return <span className={styles.loadingText}>Загрузка дилеров...</span>;
  }

  return (
    <Space wrap>
      {dealers.map((dealer) => (
        <Tag
          key={dealer.id}
          color={filterStore.dealerIds.includes(dealer.id) ? 'blue' : 'default'}
          onClick={() => filterStore.toggleDealer(dealer.id)}
          className={styles.dealerTag}
        >
          {dealer.name || `Дилер ${dealer.id}`}
        </Tag>
      ))}
    </Space>
  );
});

