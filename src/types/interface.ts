type RoleLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";
interface DepartmentImage {
  url: string; // Add any additional fields that may be part of the image object
}
interface DepartmentCount {
  user: number; // Add any additional fields that may be part of the image object
}
interface Department {
  id: string;
  department_name: string;
  image: DepartmentImage;
  _count: DepartmentCount
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
  email: string,
  image: UserImage,
  role: Role
  phone: string,
  department?: Department
}

interface Role {
  id: string;
  description: string,
  role_name: string,
  role_level: RoleLevel;
  permissionsAsAssessor: Permission[]
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


type PageNumber = number | 'ellipsis' | 'ellipsis1' | 'ellipsis2';
export type { DepartmentImage, Department, Role, User, RoleRequest, Notification, Permission, PermissionForm, FormQuestion, PeriodType, PageNumber };
