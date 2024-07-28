// store.ts
import { Department } from '@/types/interface';
import { create } from 'zustand';

interface StoreState {
  profilePopup: {
    open: boolean;
  };
  toggleProfile: () => void;
  ProfileDetail: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  updateProfileDetail: (name: string, email: string, image: string) => void;

  
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
}

const useStore = create<StoreState>((set) => ({
  ProfileDetail: {
    name: null,
    email: null,
    image: null,
  },
  profilePopup: {
    open: false,
  },
  toggleProfile: () => set((state) => ({
    profilePopup: {
      ...state.profilePopup,
      open: !state.profilePopup.open,
    },
  })),
  updateProfileDetail: (name: string, email: string, image: string) => set((state) => ({
    ProfileDetail: {
      ...state.ProfileDetail,
      name,
      email,
      image,
    },
  })),
  
  departments: [],
  setDepartments: (departments) => set(() => ({ departments })),
}));

export default useStore;
