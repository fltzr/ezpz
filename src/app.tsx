import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { getCookie } from './common/utils/cookies';
import { useTheme } from './common/hooks/use-theme';

export const App = () => {
  useTheme();

  useEffect(() => {
    console.log(getCookie('Cookie1'));
  }, []);

  return <RouterProvider router={router} />;
};
