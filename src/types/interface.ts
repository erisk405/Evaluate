interface DepartmentImage {
  url: string; // Add any additional fields that may be part of the image object
}
interface DepartmentCount {
  user: number; // Add any additional fields that may be part of the image object
}
interface Department {
  id: number;
  department_name: string;
  image: DepartmentImage;
  _count:DepartmentCount

  // เพิ่มข้อมูลที่จำเป็นตามโครงสร้างข้อมูลจริง
}

export type { DepartmentImage, Department };
