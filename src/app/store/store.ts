// store.ts
import { Department, getCountUserAsEvaluatedType, getResultEvalEachDepartmentType, getResultEvaluateType, ImageType, PeriodType, PrefixType, Role, RoleRequest } from '@/types/interface';
import { create } from 'zustand';
import GlobalApi from '../_util/GlobalApi';

interface StoreState {
  openForm: {
    open: boolean,
    id: string | null
  };
  setOpenForm: (id: string) => void;

  showProfile: boolean
  setShowProfile: (showProfile: boolean) => void;


  notificationCounts: number;
  setNotificationCount: (count: number | ((prev: number) => number)) => void;

  countdownTime: number;
  setCountdownTime: (time: number | ((prev: number) => number)) => void;

  showNotifications: boolean
  setShowNotifications: (showNotification: boolean) => void;

  profilePopup: {
    open: boolean;
  };

  toggleProfile: () => void;

  ProfileDetail: {
    id: string | null;
    prefix: PrefixType | null;
    name: string | null;
    email: string | null;
    image: ImageType | null;
    role: Role | null;
    phone: string | null,
    department: Department | null;
    roleRequests: RoleRequest[] | null;
  };

  updateProfileDetail: (updatedFields: {
    id?: string;
    prefix?: PrefixType;
    name?: string;
    email?: string;
    image?: ImageType;
    role?: Role;
    phone?: string;
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

  resultEvaluate: getResultEvaluateType | null;
  setResultEvaluate: (resultEvaluates: getResultEvaluateType) => void

  resultCountUserAsEvaluated: getCountUserAsEvaluatedType[] | null;
  setResultCountUserAsEvaluated: (resultEvaluates: getCountUserAsEvaluatedType[]) => void



  resultEvalEachDepartment: getResultEvalEachDepartmentType[] | null;
  setResultEvalEachDepartment: (resultEvalEachDepartment: getResultEvalEachDepartmentType[]) => void


  allPeriod: PeriodType[] | null;
  fetchCurrentPeriod: () => Promise<PeriodType[]>; // Add this method to the store

}


const useStore = create<StoreState>((set) => ({
  ProfileDetail: {
    id: null,
    prefix: null,
    name: null,
    email: null,
    image: null,
    role: null,
    phone: null,
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

  showProfile: false,
  setShowProfile: (show: boolean) => {
    set((state) => ({
      ...state,
      showProfile: show
    }));
  },


  notificationCounts: 0,
  setNotificationCount: (update: number | ((prev: number) => number)) =>
    set((state) => ({
      notificationCounts: typeof update === "function"
        ? update(state.notificationCounts)
        : update,
    })),


  countdownTime: 0,
  setCountdownTime: (update: number | ((prev: number) => number)) => set((state) => ({
    countdownTime: typeof update === "function" ? update(state.countdownTime) : update,
  })),



  showNotifications: false,
  setShowNotifications: (show: boolean) => {
    set((state) => ({
      ...state,
      showNotifications: show
    }));
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
    prefix?: PrefixType;
    name?: string;
    email?: string;
    image?: ImageType;
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
  allPeriod: null,

  resultEvaluate: null,
  setResultEvaluate: (resultEvaluate) => set(() => ({
    resultEvaluate
  })),

  resultCountUserAsEvaluated: null,
  setResultCountUserAsEvaluated: (resultCountUserAsEvaluated) => set(() => ({
    resultCountUserAsEvaluated
  })),

  resultEvalEachDepartment: null,
  setResultEvalEachDepartment: (resultEvalEachDepartment) => set(() => ({
    resultEvalEachDepartment
  })),


  // function  fetchperiod เอามาไว้ store เพราะเหมือนต้องใช้บ่อย 
  // Add a method to fetch the current period directly in the store
  fetchCurrentPeriod: async () => {
    try {
      const response = await GlobalApi.getPeriod();
      if (!response) {
        throw new Error("Don't have period")
      }
      const now = new Date();

      const sortedPeriods = response?.data.sort((a: PeriodType, b: PeriodType) => {
        const startA = new Date(a.start);
        const startB = new Date(b.start);
        const endA = new Date(a.end);
        const endB = new Date(b.end);

        // เช็คว่าช่วงเวลาไหนยังไม่หมดอายุ
        const isActiveA = endA >= now;
        const isActiveB = endB >= now;

        if (isActiveA && !isActiveB) return -1; // A ยังไม่หมดอายุ แต่ B หมดแล้ว
        if (!isActiveA && isActiveB) return 1;  // B ยังไม่หมดอายุ แต่ A หมดแล้ว

        // ถ้าทั้งคู่ยังไม่หมดอายุ หรือ หมดอายุทั้งคู่
        // เรียงตามวันเริ่มต้นที่ใกล้จะถึง
        return startA.getTime() - startB.getTime();
      });
      if (sortedPeriods) {
        set({
          allPeriod: sortedPeriods
        });
      }
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
