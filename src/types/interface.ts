type RoleLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";
interface DepartmentImage {
  url: string; // Add any additional fields that may be part of the image object
}
interface DepartmentCount {
  user: number; // Add any additional fields that may be part of the image object
}
interface Department {
  headOfDepartment?: User;
  deputyDirector?: User;
  id: string;
  department_name: string;
  image: DepartmentImage;
  _count: DepartmentCount
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
}

interface RoleRequest {
  role: Role;
  status: string;
}
// Define the type for a single permission
type Permission = {
  internal: string[];
  external: string[];
};

// Define the type for the permissions state
type Permissions = {
  [key: string]: Permission;
};

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



export type { DepartmentImage, Department, Role, User, RoleRequest, Notification ,Permissions};
