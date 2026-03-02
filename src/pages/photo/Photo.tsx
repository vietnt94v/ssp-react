import { useState, useRef, useEffect } from 'react';

const COLUMN_COUNT = 4;
const ROW_HEIGHT = 180;
const INITIAL_ITEM_COUNT = 24;
const BATCH_SIZE = 20;
const OVERSCAN_ROWS = 2;

const getPicsumUrl = (index: number, size = 300) =>
  `https://picsum.photos/seed/${index}/${size}/${size}`;

const Photo = () => {
  const [itemCount, setItemCount] = useState(INITIAL_ITEM_COUNT);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastLoadAtRef = useRef(0);

  const rowCount = Math.ceil(itemCount / COLUMN_COUNT);
  const totalHeight = rowCount * ROW_HEIGHT;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerHeight(el.clientHeight);
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
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
    if (bottom >= totalHeight - 200 && itemCount >= lastLoadAtRef.current) {
      lastLoadAtRef.current = itemCount + BATCH_SIZE;
      setItemCount(prev => prev + BATCH_SIZE);
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
              if (index >= itemCount) return null;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    padding: 4,
                    boxSizing: 'border-box',
                    position: 'relative',
                  }}
                >
                  <p style={{ position: 'absolute', bottom: 10, right: 15, margin: 0 }}>{index}</p>
                  <img
                    src={getPicsumUrl(index)}
                    alt=''
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8,
                      display: 'block',
                    }}
                    loading='lazy'
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Photo;
