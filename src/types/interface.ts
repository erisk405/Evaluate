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
  _count:DepartmentCount
  // เพิ่มข้อมูลที่จำเป็นตามโครงสร้างข้อมูลจริง
}
interface UserImage{
  id:string,
  url:string,
  public_id:string
}

interface User{
  id:string,
  name:string,
  email:string,
  image:UserImage,
  role:Role
  phone:string
}

interface Role {
  id:string;
  description:string,
  role_name:string
}

interface RoleRequest{
  id:string;
  role:Role;
  status:string;
  createAt:Date;
  updateAt:Date;
}

export type { DepartmentImage, Department,Role ,User,RoleRequest};
