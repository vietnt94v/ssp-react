import { useState, useCallback } from 'react';
import {
  getProducts,
  getProductById,
  searchProducts as apiSearchProducts,
  type Product,
} from '../api';

const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productById, setProductById] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProductById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setProductById(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        loadProducts();
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await apiSearchProducts(query);
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [loadProducts],
  );

  return {
    products,
    productById,
    loading,
    error,
    loadProducts,
    loadProductById,
    searchProducts,
  };
};

export default useProduct;
