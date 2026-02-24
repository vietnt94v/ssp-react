import { useEffect, useState } from 'react';

const ChildComponent = () => {
  const handleResize = () => {
    console.log('resize');
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>ChildComponent</div>;
};

const Home = () => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div>
      <button onClick={() => setIsShow(!isShow)}>Toggle</button>

      {isShow ? <ChildComponent /> : null}
    </div>
  );
};

export default Home;
