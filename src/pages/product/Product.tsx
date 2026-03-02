import { useState } from 'react';
import useProduct from '../../hooks/useProduct';

const Product = () => {
  const [query, setQuery] = useState('');
  const [productId, setProductId] = useState(0);
  const {
    products,
    productById,
    loading,
    error,
    loadProducts,
    searchProducts,
    loadProductById,
  } = useProduct();

  const handleSearch = () => searchProducts(query);
  const handleLoadProductById = () => loadProductById(productId);
  const handleRefresh = () => {
    setQuery('');
    loadProducts();
  };

  return (
    <>
      <div>
        <button type='button' onClick={handleRefresh}>
          Fetch Products
        </button>
      </div>
      <div>
        <input
          type='text'
          placeholder='query product by name'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button type='button' onClick={handleSearch}>
          Search
        </button>
      </div>
      <div>
        <input
          type='number'
          placeholder='enter product id'
          value={productId}
          onChange={e => setProductId(Number(e.target.value))}
        />
        <button type='button' onClick={handleLoadProductById}>
          Fetch Product by ID
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.title}</h3>
            <p>
              {product.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </p>
          </li>
        ))}
      </ul>
      {productById && (
        <div>
          <h3>{productById?.title}</h3>
          <p>
            {productById?.price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        </div>
      )}
    </>
  );
};

export default Product;
