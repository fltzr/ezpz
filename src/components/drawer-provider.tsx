import { AppLayoutProps } from '@cloudscape-design/components';
import { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react';

type OpenDrawerData = {
  drawerName: string;
  content: ReactNode;
  width?: number;
};

type DrawerContextProps = {
  activeDrawerId: string | null;
  drawerContent?: AppLayoutProps.Drawer;
  panelWidth?: number;
  openDrawer: (info: OpenDrawerData) => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: PropsWithChildren) => {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [drawerContent, setDrawerContent] = useState<AppLayoutProps.Drawer | undefined>(
    undefined
  );
  const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined);

  const openDrawer = ({
    drawerName = 'default',
    content,
    width = 200,
  }: OpenDrawerData) => {
    setActiveDrawerId(drawerName);
    setDrawerContent({
      id: drawerName,
      content,
      ariaLabels: {
        drawerName,
      },
      trigger: {},
    });
    setPanelWidth(width);
  };

  const closeDrawer = () => {
    setActiveDrawerId(null);
    setDrawerContent(undefined);
  };

  return (
    <DrawerContext.Provider
      value={{
        activeDrawerId,
        drawerContent,
        panelWidth,
        openDrawer,
        closeDrawer,
      }}>
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
