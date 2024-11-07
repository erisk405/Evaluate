// store.ts
import { Department, Role, RoleRequest } from '@/types/interface';
import { create } from 'zustand';

interface StoreState {
  openForm: {
    open: boolean,
    id: string | null
  };
  setOpenForm: (id: string) => void;

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
    department: string | null;
    roleRequests: RoleRequest[] | null;
  };
  updateProfileDetail: (updatedFields: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: Role;
    roleRequests?: RoleRequest[];
    department?: string;
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
    roleRequests: null,
    department: null
  },

  openForm: {
    open: false,
    id: null
  },
  setOpenForm: (id: string) => set(() => ({
    openForm: {
      open: true,
      id
    }
  })),

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
    roleRequests?: RoleRequest[];
    department?: string;
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
