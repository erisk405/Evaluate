"use client";

import { Department } from "@/types/interface";
import axios, { AxiosResponse } from "axios";
interface UserProfile {
  [x: string]: any;
  name: string;
  email: string;
  image?: {
    url: string;
  };
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;

const fetchProtected = () =>{
  return axios.get(`${apiUrl}/protected`,{
    withCredentials: true,
  })
}

const fetchUserProfile = async (): Promise<AxiosResponse<UserProfile>> => {
  // Return the axios.get promise with type
  return await axios.get(`${apiUrl}/myProfile`, {
    withCredentials: true, // ส่ง cookies ไปด้วย
  });
};



const Logout = async () => {
  try {
    return await axios.post(
      `${apiUrl}/sign-out`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// New function to update user image
const updateUserImage = async (
  formData: FormData
): Promise<AxiosResponse<any>> => {
  return await axios.put(`${apiUrl}/usersImage`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getAllUsers = async () => {
  try {
    return await axios.get(`${apiUrl}/allUsers`, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipath/form-data",
      },
    });
  } catch (error) {
    console.error("Error role:", error);
  }
};

const findUserEmptyDepartment = async () => {
  try {
    return await axios.get(`${apiUrl}/findUserEmplyDepartment`);
  } catch (error) {
    console.error("Error role:", error);
  }
};

const updateDepartmentImage = async (
  formData: FormData,
  department: Department
): Promise<AxiosResponse<any>> => {
  return await axios.put(
    `${apiUrl}/department-image/${department.id}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipath/form-data",
      },
    }
  );
};

const addUsersToDepartment = async (payload: any) => {
  return await axios.put(`${apiUrl}/usersToDepartment`, payload, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json", // Set content type to JSON
    },
  });
};

const getRole = async () => {
  try {
    return await axios.get(`${apiUrl}/Role`,{withCredentials: true});
  } catch (error) {
    console.error("Error role:", error);
  }
};

const getDepartment = async () => {
  try {
    return await axios.get(`${apiUrl}/department`);
  } catch (error) {
    console.error("Error Department:", error);
  }
};
const getDepartmentById = async (departmentId: any , pageIndex :number, pageSize :number) => {
  // console.log(`page=${pageIndex}&size=${pageSize}`);
  try {
    const url = `${apiUrl}/department/${departmentId}?page=${pageIndex}&size=${pageSize}`;
    return await axios.get(url, { withCredentials: true });
  } catch (error) {
    console.error("Error Department:", error);
  }
};
const CreateDepartment = async (
  formData: FormData
): Promise<AxiosResponse<any>> => {
  return await axios.post(`${apiUrl}/department`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateDepartment = async (data:any) => {
  try {
    // console.log("formData",data);
    
    return await axios.put(`${apiUrl}/department`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

// function api สำหรับ user เมื่อต้องการร้องขอ role
const sendRoleRequest = async (userId : any, roleId :any) => {
  try {
    return await axios.post(`${apiUrl}/sendRoleRequest`, {
      userId,// userId จะต้องเป็นค่าที่มาจากการล็อกอิน
      roleId,
    },{
      withCredentials: true,
    });
  } catch (error) {
    
  }
}


// function api สำหรับ Admin ที่ใช้ในการจัดการกับ การ Approve หรือ Reject เมื่อ user ร้องขอ role
const resolveRole = async (requestId : string, status : string, userId :string) =>{
  try {
    return await axios.patch(`${apiUrl}/resolveRole`, {
      requestId,
      status,
      userId,
    },{
      withCredentials: true,
    });
  } catch (error) {
    console.error({message : error});
    
  }
}

export default {
  fetchUserProfile,
  Logout,
  updateUserImage,
  getDepartment,
  CreateDepartment,
  updateDepartmentImage,
  getRole,
  getAllUsers,
  getDepartmentById,
  updateDepartment,
  findUserEmptyDepartment,
  addUsersToDepartment,
  resolveRole,
  sendRoleRequest,
  fetchProtected
};
