import { useEffect, useRef, useState } from 'react';
import { getProductsPaginated } from '../../api';

const LIMIT = 6;
const SKIP = 0;
const ROW_HEIGHT = 220;
const OVERSCAN_ROWS = 2;

interface ProductProps {
  id: number;
  title: string;
  description: string;
  price: number;
  tags: string[];
  thumbnail?: string;
}

const Product = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const allowFetchMoreProducts = useRef(true);
  const productContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    getProductsPaginated(LIMIT, SKIP)
      .then(({ products: data, total }) => {
        setProducts(data);
        setHasMore(data.length < total);
      })
      .catch(() => setHasMore(false));
  }, []);

  const handleScroll = () => {
    const productsContainer = productContainerRef.current;
    if (!productsContainer) return;

    const productsContainerScrollTop = productsContainer.scrollTop;
    const productsContainerClientHeight = productsContainer.clientHeight;
    const productsContainerScrollHeight = productsContainer.scrollHeight;
    setScrollTop(productsContainerScrollTop);
    setContainerHeight(productsContainerClientHeight);

    if (
      productsContainerScrollTop + productsContainerClientHeight >=
        productsContainerScrollHeight - 0 &&
      hasMore &&
      allowFetchMoreProducts.current
    ) {
      allowFetchMoreProducts.current = false;
      getProductsPaginated(LIMIT, products.length)
        .then(({ products: data, total }) => {
          setProducts(prev => {
            const next = [...prev, ...data];
            setHasMore(next.length < total);
            return next;
          });
        })
        .catch(() => {
          setHasMore(false);
        })
        .finally(() => {
          allowFetchMoreProducts.current = true;
        });
    }
  };

  const visibleRows: number[] = [];
  const startRow = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS,
  );
  const endRow = Math.min(
    products.length - 1,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN_ROWS,
  );
  for (let r = startRow; r <= endRow; r++) visibleRows.push(r);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          height: '100vh',
          overflow: 'auto',
        }}
        ref={productContainerRef}
        onScroll={handleScroll}
      >
        {visibleRows.map(row => (
          <div
            key={row}
            style={{ border: '1px solid #ccc', padding: 20, borderRadius: 6 }}
          >
            <div>{products[row].id}</div>
            <div>{products[row].title}</div>
            <div>{products[row].price}</div>
            <div>{products[row].tags.join(', ')}</div>
            <div>{products[row].description}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;
