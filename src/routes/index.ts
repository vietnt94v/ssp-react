import { createBrowserRouter } from 'react-router';
import DefaultLayout from '../layouts/DefaultLayout';
import { Guest, Home } from '../pages';

const router = createBrowserRouter([
  {
    path: '/',
    Component: DefaultLayout,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/guest',
        Component: Guest,
      },
    ],
  },
]);

export default router;
