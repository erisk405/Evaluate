// store.ts
import { Department, Role } from '@/types/interface';
import { create } from 'zustand';

interface StoreState {
  profilePopup: {
    open: boolean;
  };
  toggleProfile: () => void;
  ProfileDetail: {
    id: string | null;
    name: string | null;
    email: string | null;
    image: string | null;
    role: Role | null;
    roleStatus: string | null;
  };
  updateProfileDetail: (updatedFields: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: Role;
    roleStatus?: string;
  }) => void;
  

  departments: Department[];
  setDepartments: (departments: Department[]) => void;

  roles: Role[];
  setRole: (roles: Role[]) => void;
}


const useStore = create<StoreState>((set) => ({
  ProfileDetail: {
    id: null,
    name: null,
    email: null,
    image: null,
    role: null,
    roleStatus: null

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
  updateProfileDetail: (updatedFields: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: Role;
    roleStatus?: string;
  }) => set((state) => ({
    ProfileDetail: {
      ...state.ProfileDetail,
      ...updatedFields,
    },
  })),


  departments: [],
  setDepartments: (departments) => set(() => ({ departments })),
  roles: [],
  setRole: (roles) => set(() => ({ roles })),
}));

export default useStore;
