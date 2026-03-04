import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  tags: string[];
  thumbnail?: string;
}

export const getUserById = async (id: number): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const getPostsByUser = async (userId: number): Promise<Post[]> => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data.posts;
};

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get('/products', {});
  return res.data.products;
};

export const getProductsPaginated = async (
  limit: number,
  skip: number,
): Promise<{ products: Product[]; total: number; skip: number }> => {
  const res = await api.get<{
    products: Product[];
    total: number;
    skip: number;
  }>('/products', { params: { limit, skip } });
  return {
    products: res.data.products,
    total: res.data.total,
    skip: res.data.skip,
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const res = await api.get('/products/search', {
    params: {
      q: query,
    },
  });
  return res.data.products;
};
