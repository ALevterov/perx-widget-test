import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Carousel, Spin, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { productStore } from '@/entities/product/model';
import { ProductCard } from '@/shared/ui/product-card';
import styles from './home-product-list.module.scss';

interface CarouselArrowProps {
  onClick?: () => void;
  className: string;
  ariaLabel: string;
  Icon: typeof LeftOutlined;
}

const CarouselArrow = ({ onClick, className, ariaLabel, Icon }: CarouselArrowProps) => (
  <button className={className} onClick={onClick} aria-label={ariaLabel}>
    <Icon />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <CarouselArrow
    onClick={onClick}
    className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
    ariaLabel="Предыдущий слайд"
    Icon={LeftOutlined}
  />
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <CarouselArrow
    onClick={onClick}
    className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
    ariaLabel="Следующий слайд"
    Icon={RightOutlined}
  />
);

export const HomeProductList = observer(() => {
  useEffect(() => {
    if (productStore.products.length === 0) {
      productStore.loadProducts();
    }
  }, []);

  const products = productStore.getHomeProducts();

  if (productStore.loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <Empty description="Товары не найдены" />
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Рекомендуемые товары</h1>
      <Carousel
        className={styles.carousel}
        dots={true}
        arrows={true}
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
        slidesToShow={Math.min(5, products.length)}
        slidesToScroll={1}
        infinite={products.length > 5}
        swipe={true}
        draggable={true}
        touchMove={true}
        adaptiveHeight={false}
        responsive={[
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4,
              infinite: products.length > 4,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              infinite: products.length > 3,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              infinite: products.length > 2,
            },
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              infinite: products.length > 1,
            },
          },
        ]}
      >
        {products.map((product) => (
          <div key={product.id} className={styles.slide}>
            <ProductCard product={product} />
          </div>
        ))}
      </Carousel>
    </div>
  );
});

