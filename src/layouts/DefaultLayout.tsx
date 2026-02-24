import { Outlet } from 'react-router';

const DefaultLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
