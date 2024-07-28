"use client"

import axios, { AxiosResponse } from "axios";
interface UserProfile {
    name: string;
    email: string;
    image?: {
      url: string;
    };
  }
const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;


const fetchUserProfile = async (): Promise<AxiosResponse<UserProfile>> => {
    // Return the axios.get promise with type
    return await axios.get(`${apiUrl}/userProfile`, {
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
const updateUserImage = async (formData: FormData): Promise<AxiosResponse<any>> => {
  return await axios.put(`${apiUrl}/usersImage`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


const Department = async () =>{
  try {
    return await axios.get(`${apiUrl}/department`)
  } catch (error) {
    console.error("Error Department:", error);
  }
}
const CreateDepartment = async (formData: FormData) : Promise<AxiosResponse<any>> =>{
  return await axios.post(`${apiUrl}/department`,formData,{
    withCredentials:true,
    headers:{
      "Content-Type":"multipart/form-data"
    },
  });
}



export default{
    fetchUserProfile,
    Logout,
    updateUserImage,
    Department,
    CreateDepartment
}