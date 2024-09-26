import { AppLayoutProps } from '@cloudscape-design/components';
import { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react';

type DrawerContextProps = {
  activeDrawerId: string | null;
  drawerContent: AppLayoutProps.Drawer | undefined;
  openDrawer: (drawer: ReactNode, drawerName?: string) => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: PropsWithChildren) => {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [drawerContent, setDrawerContent] = useState<AppLayoutProps.Drawer | undefined>(
    undefined
  );

  const openDrawer = (content: ReactNode, drawerName = 'default') => {
    setActiveDrawerId(drawerName);
    setDrawerContent({
      id: drawerName,
      content,
      ariaLabels: {
        drawerName,
      },
      trigger: {},
    });
  };

  const closeDrawer = () => {
    setActiveDrawerId(null);
    setDrawerContent(undefined);
  };

  return (
    <DrawerContext.Provider
      value={{ activeDrawerId, drawerContent, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDrawer = (): DrawerContextProps => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer must be used within <DrawerProvider />!');
  }

  return context;
};
