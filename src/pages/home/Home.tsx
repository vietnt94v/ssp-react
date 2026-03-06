import { useCallback, useMemo, useState } from 'react';
import { throttle } from '../../utils';

const Home = () => {
  const [count, setCount] = useState(0);
  const [lastInvocation, setLastInvocation] = useState<
    'leading' | 'trailing' | null
  >(null);

  const handleScroll = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const throttledHandleScroll = useMemo(
    () =>
      throttle(handleScroll, 1500, {
        onLeading: () => {
          console.log('[Leading]', new Date().toISOString());
          setLastInvocation('leading');
        },
        onTrailing: () => {
          console.log('[Trailing]', new Date().toISOString());
          setLastInvocation('trailing');
        },
      }),
    [handleScroll],
  );

  return (
    <>
      <div style={{ padding: 8 }}>
        Throttle count: {count} · Last: {lastInvocation ?? '—'}
      </div>
      <div
        style={{ height: '100vh', overflow: 'auto' }}
        onScroll={throttledHandleScroll}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} style={{ height: '100px' }}>
            {index + 1}
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
