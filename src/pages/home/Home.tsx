import useCounter from '../../hooks/useCounter';

const Home = () => {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <>
      <div>Home</div>
      <div>Count: {count}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </>
  );
};

export default Home;
