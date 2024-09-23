import { create } from 'zustand';

type UseDrawersProps = {
  activeDrawerId: string | null;
  setActiveDrawerId: (id: string | null) => void;
};

export const useDrawers = create<UseDrawersProps>((set) => ({
  activeDrawerId: null,
  setActiveDrawerId: (id) => set({ activeDrawerId: id }),
}));
