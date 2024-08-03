// store.ts
import { Department, Role } from '@/types/interface';
import { create } from 'zustand';

interface StoreState {
  profilePopup: {
    open: boolean;
  };
  toggleProfile: () => void;
  ProfileDetail: {
    id:string | null;
    name: string | null;
    email: string | null;
    image: string | null;
    role: Role | null; 
  };
  updateProfileDetail: (id:string,name: string, email: string, image: string, role: Role) => void; 

  departments: Department[];
  setDepartments: (departments: Department[]) => void;

  roles: Role[];
  setRole: (roles: Role[]) => void;
}


const useStore = create<StoreState>((set) => ({
  ProfileDetail: {
    id:null,
    name: null,
    email: null,
    image: null,
    role:  null,
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
  updateProfileDetail: (id:string,name: string, email: string, image: string, role: Role) => set((state) => ({
    ProfileDetail: {
      ...state.ProfileDetail,
      id,
      name,
      email,
      image,
      role,
    },
  })),

  departments: [],
  setDepartments: (departments) => set(() => ({ departments })),
  roles: [],
  setRole: (roles) => set(() => ({ roles })),
}));

export default useStore;
