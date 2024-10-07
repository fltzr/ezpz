import { AppLayoutProps } from '@cloudscape-design/components';
import { create } from 'zustand';

type LayoutStateProps = {
  contentType: AppLayoutProps.ContentType;
  setContentType: (type: AppLayoutProps.ContentType) => void;
};

export const useLayoutState = create<LayoutStateProps>((set) => ({
  contentType: 'default',
  setContentType: (type) => set({ contentType: type }),
}));
