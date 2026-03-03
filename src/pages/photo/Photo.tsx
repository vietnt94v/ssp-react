import { useState, useRef, useEffect } from 'react';
import { getProductsPaginated, type Product } from '../../api';

const COLUMN_COUNT = 4;
const ROW_HEIGHT = 220;
const LIMIT = 19;
const OVERSCAN_ROWS = 2;

const Photo = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const rowCount = Math.ceil(products.length / COLUMN_COUNT);
  const totalHeight = rowCount * ROW_HEIGHT;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerHeight(el.clientHeight);
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    getProductsPaginated(LIMIT, 0)
      .then(({ products: data, total }) => {
        setProducts(data);
        setHasMore(data.length < total);
      })
      .catch(() => setHasMore(false));
  }, []);

  const startRow = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS,
  );
  const endRow = Math.min(
    rowCount - 1,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN_ROWS,
  );

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.scrollTop;
    setScrollTop(top);
    const bottom = top + el.clientHeight;
    if (
      bottom >= totalHeight - 200 &&
      !loadingRef.current &&
      hasMore &&
      !loading
    ) {
      loadingRef.current = true;
      setLoading(true);
      getProductsPaginated(LIMIT, products.length)
        .then(({ products: data, total }) => {
          setProducts(prev => {
            const next = [...prev, ...data];
            setHasMore(next.length < total);
            return next;
          });
        })
        .catch(() => setHasMore(false))
        .finally(() => {
          setLoading(false);
          loadingRef.current = false;
        });
    }
  };

  const visibleRows: number[] = [];
  for (let r = startRow; r <= endRow; r++) visibleRows.push(r);

  return (
    <div
      id='photo'
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: totalHeight,
          width: '100%',
          position: 'relative',
        }}
      >
        {visibleRows.map(rowIndex => (
          <div
            key={rowIndex}
            style={{
              position: 'absolute',
              left: 0,
              top: rowIndex * ROW_HEIGHT,
              height: ROW_HEIGHT,
              width: '100%',
              display: 'flex',
              boxSizing: 'border-box',
            }}
          >
            {Array.from({ length: COLUMN_COUNT }, (_, colIndex) => {
              const index = rowIndex * COLUMN_COUNT + colIndex;
              if (index >= products.length) return null;
              const product = products[index];
              return (
                <div
                  key={product.id}
                  style={{
                    flex: 1,
                    padding: 8,
                    margin: 4,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#333',
                  }}
                >
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt=''
                      style={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover',
                      }}
                      loading='lazy'
                    />
                  ) : null}
                  <div style={{ padding: 8, flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                      ID: {product.id}
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: 14,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {product.title}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {loading && (
        <p
          style={{ textAlign: 'center', padding: 16, margin: 0, color: 'red' }}
        >
          Loading...
        </p>
      )}
    </div>
  );
};

export default Photo;
