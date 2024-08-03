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

const getRole = async () => {
  try {
    return await axios.get(`${apiUrl}/Role`);
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
const getDepartmentById = async (departmentId: any) => {
  try {
    return await axios.get(`${apiUrl}/department/${departmentId}`);
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

export default {
  fetchUserProfile,
  Logout,
  updateUserImage,
  getDepartment,
  CreateDepartment,
  updateDepartmentImage,
  getRole,
  getAllUsers,
  getDepartmentById
};
