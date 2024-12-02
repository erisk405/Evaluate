// store.ts
import { Department, PeriodType, PrefixType, Role, RoleRequest } from '@/types/interface';
import { create } from 'zustand';
import GlobalApi from '../_util/GlobalApi';

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
    department: Department | null;
    roleRequests: RoleRequest[] | null;
  };
  updateProfileDetail: (updatedFields: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: Role;
    roleRequests?: RoleRequest[];
    department?: Department;
  }) => void;


  departments: Department[];
  setDepartments: (departments: Department[]) => void;

  roles: Role[];
  setRole: (roles: Role[]) => void;

  prefixes: PrefixType[];
  setPrefix: (prefixes: PrefixType[]) => void;


  currentlyEvaluationPeriod: PeriodType | null;
  setCurrentlyEvaluationPeriod: (CurrentlyEvaluationPeriod: PeriodType) => void;
  fetchCurrentPeriod: () => Promise<PeriodType[]>; // Add this method to the store

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
    department?: Department;
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

  prefixes: [],
  setPrefix: (prefixes) => set(() => ({ prefixes })),


  currentlyEvaluationPeriod: null,
  setCurrentlyEvaluationPeriod: (currentlyEvaluationPeriod) => set(() => ({
    currentlyEvaluationPeriod
  })),


  // function  fetchperiod เอามาไว้ store เพราะเหมือนต้องใช้บ่อย 
  // Add a method to fetch the current period directly in the store
  fetchCurrentPeriod: async () => {
    try {
      const response = await GlobalApi.getPeriod();

      const sortedPeriods = response?.data.sort(
        (a: PeriodType, b: PeriodType) => {
          const now = new Date();
          const endA = new Date(a.end);
          const endB = new Date(b.end);

          const isPastA = endA < now;
          const isPastB = endB < now;

          if (isPastA === isPastB) {
            const startA = new Date(a.start);
            const startB = new Date(b.start);
            return (
              Math.abs(startA.getTime() - now.getTime()) -
              Math.abs(startB.getTime() - now.getTime())
            );
          }

          return isPastA ? 1 : -1;
        }
      );

      const currentPeriod = sortedPeriods.find((p: PeriodType) => {
        const now = new Date();
        const start = new Date(p.start);
        const end = new Date(p.end);
        return start <= now && now <= end;
      });

      if (currentPeriod) {
        set({
          currentlyEvaluationPeriod: currentPeriod
        });
      }

      return sortedPeriods; // Return sorted periods
    } catch (error) {
      console.error({ message: error });
      throw error;
    }
  }
}));

export default useStore;
