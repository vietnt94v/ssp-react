import { useEffect, useRef, useState } from 'react';
import { getProductsPaginated } from '../../api';
import { throttle } from '../../utils';

const LIMIT = 32;
const SKIP = 0;
const COLUMN_COUNT = 4;
const ROW_HEIGHT = 150;
const OVERSCAN_ROWS = 2;
const SCROLL_THROTTLE_MS = 80;

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
  const [loadingMore, setLoadingMore] = useState(false);
  const allowFetchMoreProducts = useRef(true);
  const productContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const totalHeightRef = useRef(0);
  const productsLengthRef = useRef(0);
  const hasMoreRef = useRef(true);

  const rowCount = Math.ceil(products.length / COLUMN_COUNT);
  const totalHeight = rowCount * ROW_HEIGHT;

  useEffect(() => {
    totalHeightRef.current = rowCount * ROW_HEIGHT;
    productsLengthRef.current = products.length;
    hasMoreRef.current = hasMore;
  }, [products.length, hasMore, rowCount]);

  useEffect(() => {
    const el = productContainerRef.current;
    if (!el) return;
    setContainerHeight(el.clientHeight);
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    getProductsPaginated(LIMIT, SKIP)
      .then(({ products: data, total }) => {
        setProducts(data);
        setHasMore(data.length < total);
      })
      .catch(() => setHasMore(false));
  }, []);

  const throttledScrollRef = useRef<() => void>(null);
  useEffect(() => {
    throttledScrollRef.current = throttle(() => {
      const productsContainer = productContainerRef.current;
      if (!productsContainer) return;
      const top = productsContainer.scrollTop;
      const clientHeight = productsContainer.clientHeight;
      const scrollBottom = top + clientHeight;
      setScrollTop(top);
      setContainerHeight(clientHeight);
      if (
        totalHeightRef.current > 0 &&
        scrollBottom >= totalHeightRef.current - 200 &&
        hasMoreRef.current &&
        allowFetchMoreProducts.current
      ) {
        allowFetchMoreProducts.current = false;
        setLoadingMore(true);
        getProductsPaginated(LIMIT, productsLengthRef.current)
          .then(({ products: data, total }) => {
            setProducts(prev => {
              const next = [...prev, ...data];
              const hasMoreNext = next.length < total;
              hasMoreRef.current = hasMoreNext;
              setHasMore(hasMoreNext);
              return next;
            });
          })
          .catch(() => {
            setHasMore(false);
            hasMoreRef.current = false;
          })
          .finally(() => {
            allowFetchMoreProducts.current = true;
            setLoadingMore(false);
          });
      }
    }, SCROLL_THROTTLE_MS);
  }, []);
  const handleScroll = () => throttledScrollRef.current?.();

  const startRow = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS,
  );
  const endRow = Math.min(
    rowCount - 1,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN_ROWS,
  );
  const visibleRowIndices = Array.from(
    { length: endRow - startRow + 1 },
    (_, i) => startRow + i,
  );

  return (
    <>
      <div
        style={{
          height: '100vh',
          overflow: 'auto',
        }}
        ref={productContainerRef}
        onScroll={handleScroll}
      >
        <div
          style={{
            height: totalHeight + (loadingMore ? ROW_HEIGHT : 0),
            position: 'relative',
          }}
        >
          {visibleRowIndices.map(rowIndex => {
            const rowStartIndex = rowIndex * COLUMN_COUNT;
            return (
              <div
                key={rowIndex}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: rowIndex * ROW_HEIGHT,
                  height: ROW_HEIGHT,
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${COLUMN_COUNT}, 1fr)`,
                  gap: 0,
                }}
              >
                {Array.from({ length: COLUMN_COUNT }, (_, colIndex) => {
                  const productIndex = rowStartIndex + colIndex;
                  if (productIndex >= products.length) return null;
                  const product = products[productIndex];
                  return (
                    <div
                      key={product.id}
                      style={{
                        minWidth: 0,
                        height: ROW_HEIGHT,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 18,
                          flexShrink: 0,
                          padding: '4px 6px',
                        }}
                      >
                        {product.id}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          minHeight: 0,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            loading='lazy'
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              width: 'auto',
                              height: 'auto',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {loadingMore && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: totalHeight,
                height: ROW_HEIGHT,
                width: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(${COLUMN_COUNT}, 1fr)`,
                gap: 0,
              }}
            >
              {Array.from({ length: COLUMN_COUNT }, (_, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    minWidth: 0,
                    height: ROW_HEIGHT,
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      padding: '4px 6px',
                      height: 24,
                      backgroundColor: '#e0e0e0',
                      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      minHeight: 0,
                      backgroundColor: '#e0e0e0',
                      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
