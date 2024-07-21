// store.ts
import { create } from 'zustand';

interface StoreState {
  profilePopup: {
    open: boolean;
  };
  toggleProfile: () => void;
}

const useStore = create<StoreState>((set) => ({
  profilePopup: {
    open: false,
  },
  toggleProfile: () => set((state) => ({
    profilePopup: {
      ...state.profilePopup,
      open: !state.profilePopup.open,
    },
  })),
}));

export default useStore;
