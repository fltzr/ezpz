import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { getCookie } from './common/utils/cookies';

export const App = () => {
  useEffect(() => {
    console.log(getCookie('Cookie1'));
  }, []);

  return <RouterProvider router={router} />;
};
