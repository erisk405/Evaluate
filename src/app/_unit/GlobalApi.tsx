"use client"

import axios, { AxiosResponse } from "axios";
interface UserProfile {
    name: string;
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


export default{
    fetchUserProfile,
    Logout
}