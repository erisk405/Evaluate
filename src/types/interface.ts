type RoleLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";
type PageNumber = number | 'ellipsis' | 'ellipsis1' | 'ellipsis2';
interface ImageType {
  id: string;
  url: string; // Add any additional fields that may be part of the image object
  public_id: String;
}
interface DepartmentCount {
  user: number; // Add any additional fields that may be part of the image object
}
interface Department {
  id: string;
  department_name: string;
  image: ImageType;
  _count: DepartmentCount
  supervise?: Supervise | null;
  user?: User[];
  // เพิ่มข้อมูลที่จำเป็นตามโครงสร้างข้อมูลจริง
}
interface dataDepartmentByAdmin {
  id: string;
  department_name: string;
  image: ImageType;
  _count: DepartmentCount
  supervise?: Supervise | null;
  user?: User[];
  // เพิ่มข้อมูลที่จำเป็นตามโครงสร้างข้อมูลจริง
}
interface UserImage {
  id: string,
  url: string,
  public_id: string
}

interface User {
  id: string,
  name: string,
  prefix?: string,
  email: string,
  image: UserImage,
  role: Role
  phone: string,
  department?: Department
  supervise?: Supervise[]
}

interface Role {
  id: string;
  description: string,
  role_name: string,
  role_level: RoleLevel;
  permissionsAsAssessor: PermissionItem[];
}

interface PermissionItem {
  assessor_role_id: string;
  evaluator_role_id: string;
  evaluatorRole?: Role; // Optional role information
  permissionForm: PermissionFormItem[]; // Replace 'any' with the specific type if known
  permission_id: string;
}
interface PermissionFormItem {
  form: {
    id: string;
    name: string;
    questions: FormQuestion[];
  };
  ingroup: boolean;

}

interface Permission {
  permission_id: string,
  assessorRole: {
    id: string,
    role_name: string
  }
  evaluatorRole: {
    id: string,
    role_name: string
  };
  permissionForm: PermissionForm[];
}

interface PermissionForm {
  form: {
    id: string;
    name: string
  };
  ingroup: boolean;
}
interface PeriodType {
  period_id: string,
  title: string,
  start: string,
  end: string
  isAction: boolean
}

interface RoleRequest {
  role: Role;
  status: string;
}

interface Notification {
  id: string;
  user: {
    image?: { url: string };
    name: string;
    email?: string;
    id?: string;
  };
  role: {
    requestRole?: string;
    role_name: string;
  };
  createdAt: string;
}

interface FormQuestion {
  id: string;
  form_id?: string;
  content: string;
}
interface TimeRange {
  from?: Date;
  to?: Date;
}

interface Supervise {
  supervise_id: string;
  user_id: string;
  department_id: string;
  user?: User;
}

interface PrefixType {
  prefix_id: string;
  prefix_name: string;
}

interface userHaveBeenEvaluatedType {
  period: { period_id: string, title: string }
  evaluator: { id: string, name: string }
}
// --------------------------------------------------------------------------------
// This is Type of all getResultEvaluateType and getResultEvaluateDetail form database
// --------------------------------------------------------------------------------
interface getResultEvaluateType {
  formResults: formResultsType[];
  headData: headDataType;
}
interface formResultsType {
  evaluatedPerForm: number;
  formId: string;
  formName: string;
  questions: resultPerQuestionsType[];
  totalAsserPerForm: number;

  total: TotalEachType[];
  totalAvgPerForm: number;
  totalSDPerForm: number;
}
interface TotalEachType {
  average: number;
  sd: number;
  total: string
}

interface resultPerQuestionsType {
  questionId: string,
  questionName: string,
  scores?: scoresType[],
  sumScore: {
    average: number,
    standardDeviation: number
  }
}

interface headDataType {
  department?: string,
  evaluatorName: string;
  periodName: string;
  roleLevel?: string;
  roleName?: string;
  success?: {
    message: string,
    success: boolean
  }
  totalAVG: number;

  totalAvg?: number;
  totalAssessorsHasPermiss: number;
  totalEvaluated: number;
  totalSD: number;
}

interface scoresType {
  average: number,
  sd: number,
  type: string
}

// ---------------------------------------------------------------------------
interface getCountUserAsEvaluatedType {
  department_id: string;
  department_name: string;
  evaluated: number; // มีที่คนที่เราประเมินสมาชิกในหน่วยงานนั้น
  evaluator: number // มีสมาชิกที่อยู่ในแผนกนั้นกี่คน
}

interface getResultEvalEachDepartmentType {
  department: string;
  id: string;
  image: ImageType;
  supervise?: Supervise;
  totalFinished: number;
  totalUnfinished: number;
  totalUsers: number
}

interface getAllSuperviseByAdminType {
  supervise_id: string;
  user: User;
  department: Department;
}


export type {
  ImageType, Department, Role,
  User, RoleRequest, Notification,
  Permission, PermissionForm,
  FormQuestion, PeriodType, PageNumber,
  TimeRange, Supervise, PrefixType, PermissionFormItem,
  PermissionItem, dataDepartmentByAdmin,
  userHaveBeenEvaluatedType,
  getResultEvaluateType,
  formResultsType,
  headDataType,
  getCountUserAsEvaluatedType,
  getResultEvalEachDepartmentType,
  getAllSuperviseByAdminType,
  scoresType
};
