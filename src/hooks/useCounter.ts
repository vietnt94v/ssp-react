import React from 'react';

const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = React.useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
};

export default useCounter;
