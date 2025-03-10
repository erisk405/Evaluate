"use client";

import { toast } from "@/components/ui/use-toast";
import { Department, PeriodType, PrefixType } from "@/types/interface";
import axios, { AxiosResponse } from "axios";
import apiClient from "./intercaptor";
const isProduction = process.env.NODE_ENV === "production";

interface UserProfile {
  [x: string]: any;
  name: string;
  email: string;
  image?: {
    id: string;
    public_id: string;
    url: string;
  };
}

export const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_BACKEND_API_URL
  : "http://localhost:8000/api";
if (!process.env.NEXT_PUBLIC_BACKEND_API_URL) {
  console.error("API URL is not defined");
  // จัดการ error case
}

export const handleErrorOnAxios = (error: unknown) => {
  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.message
    : error instanceof Error
    ? error.message
    : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

  toast({
    title: "เกิดข้อผิดพลาด",
    description: errorMessage,
    variant: "destructive",
  });
};
// -----------------------------------------------------------
//                       prefix table
// -----------------------------------------------------------
const getPrefix = () => {
  try {
    return axios.get(`${apiUrl}/prefix`);
  } catch (error) {
    console.error("Error prefix:", error);
  }
};
const updatePrefix = (data: { prefix_id: string; prefix_name: string }) => {
  try {
    return apiClient.put(`${apiUrl}/prefix`, data);
  } catch (error) {
    console.error("API updatePrefix", { message: error });
  }
};
const createPrefix = (data: { prefix_name: string }) => {
  try {
    return apiClient.post(`${apiUrl}/prefix`, data);
  } catch (error) {
    console.error("Error prefix:", error);
  }
};
const deletePrefix = (payload: {}) => {
  try {
    return apiClient.delete(`${apiUrl}/prefix`, {
      data: payload, // Send the payload directly
    });
  } catch (error) {
    console.error("API deletePrefix", { message: error });
  }
};

// -----------------------------------------------------------
//                       untitle
// -----------------------------------------------------------
const fetchProtected = () => {
  // ดึง token จาก sessionStorage
  const token = localStorage.getItem("token");

  // ตรวจสอบว่ามี token หรือไม่
  if (!token) {
    throw new Error("No token found in sessionStorage");
  }
  // ส่งคำขอพร้อม Authorization header
  return apiClient.get(`${apiUrl}/protected`, {
    headers: {
      Authorization: `Bearer ${token}`, // เพิ่ม Bearer token
    },
  });
};

const fetchUserProfile = async (): Promise<AxiosResponse<UserProfile>> => {
  // Return the axios.get promise with type
  return await apiClient.get(`${apiUrl}/myProfile`);
};

const updateProfileName = async (payload: {
  name: string;
  prefixId: string;
  phone: string;
}) => {
  try {
    return await apiClient.put(`${apiUrl}/myProfile`, payload);
  } catch (error) {
    console.error("Error updateProfileName:", error);
  }
};

const forgotPassowrd = async (email: string) => {
  try {
    return await axios.get(`${apiUrl}/forgot-password/${email}`);
  } catch (error) {
    console.error("Error forgotPassowrd:", { message: error });
  }
};
const resetPassword = async (payload: {
  newPassword?: string;
  token: string;
}) => {
  try {
    const { token, ...rest } = payload;
    return await axios.put(`${apiUrl}/reset-password`, rest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error resetPassword:", { message: error });
  }
};
// -----------------------------------------------------------
//                       for user
// -----------------------------------------------------------
// New function to update user image
const updateUserImage = async (
  formData: FormData
): Promise<AxiosResponse<any>> => {
  return await apiClient.put(`${apiUrl}/usersImage`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// New function to update user image
const updateUserImageForAdmin = async (
  formData: FormData,
  userId:string
): Promise<AxiosResponse<any>> => {
  return await apiClient.put(`${apiUrl}/imageUser/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getAllUsers = async () => {
  try {
    return await apiClient.get(`${apiUrl}/allUsers`, {
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
  return await apiClient.put(
    `${apiUrl}/department-image/${department.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipath/form-data",
      },
    }
  );
};

//  ใช้ ที่หน้า department & role path menagement ตอนที่จะเลือกเข้าuser คนไหนเข้าหน่วยงาน
const addUsersToDepartment = async (payload: any) => {
  try {
    return await apiClient.put(`${apiUrl}/usersToDepartment`, payload, {
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });
  } catch (error) {
    console.error("Error usersToDepartment:", error);
  }
};
type updateUserProfileByAdminProp = {
  userId: string;
  name: string;
  department?: string | null;
  email: string;
  role: string;
  prefixId: string;
  phone: string;
};
const updateUserProfileByAdmin = async (
  payload: updateUserProfileByAdminProp
) => {
  try {
    return await apiClient.put(`${apiUrl}/userProfile`, payload, {
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });
  } catch (error) {
    console.error("Error userProfile:", error);
  }
};

const changePassword = async (
  payload: { old_pass?: string; new_pass: string },
  userId?: string
) => {
  try {
    const response = await apiClient.put(
      `${apiUrl}/password${userId ? `/${userId}` : ""}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error changePassword:", error);
    return handleErrorOnAxios(error);
  }
};

const deleteUserByAdmin = async (payload: {}) => {
  try {
    return await apiClient.delete(`${apiUrl}/user`, {
      data: payload,
    });
  } catch (error) {
    handleErrorOnAxios(error);
  }
};
// -----------------------------------------------------------
//                       Role Table
// -----------------------------------------------------------
const createRole = (payload: any) => {
  try {
    return apiClient.post(`${apiUrl}/role`, payload);
  } catch (error) {
    console.error("Error role:", error);
  }
};
const updateRole = (payload: any) => {
  try {
    return apiClient.put(`${apiUrl}/role`, payload);
  } catch (error) {
    console.error("Error role:", error);
  }
};

const deleteRole = (id: string) => {
  try {
    return apiClient.delete(`${apiUrl}/role`, {
      data: { id },
    });
  } catch (error) {
    handleErrorOnAxios(error);
  }
};

const getRole = async () => {
  try {
    return await apiClient.get(`${apiUrl}/role`);
  } catch (error) {
    console.error("Error role:", error);
  }
};
// function api สำหรับ user เมื่อต้องการร้องขอ role
const sendRoleRequest = async (userId: any, roleId: any) => {
  try {
    return await apiClient.post(`${apiUrl}/sendRoleRequest`, {
      userId, // userId จะต้องเป็นค่าที่มาจากการล็อกอิน
      roleId,
    });
  } catch (error) {}
};

// function api สำหรับ Admin ที่ใช้ในการจัดการกับ การ Approve หรือ Reject เมื่อ user ร้องขอ role
const resolveRole = async (
  requestId: string,
  status: string,
  userId: string
) => {
  try {
    return await apiClient.patch(`${apiUrl}/resolveRole`, {
      requestId,
      status,
      userId,
    });
  } catch (error) {
    console.error({ message: error });
  }
};

// -----------------------------------------------------------
//                       Department Table
// -----------------------------------------------------------

const getDepartment = async () => {
  try {
    return await axios.get(`${apiUrl}/department`);
  } catch (error) {
    console.error("Error Department:", error);
  }
};

const getDepartmentForAdmin = async () => {
  try {
    return await apiClient.get(`${apiUrl}/department/admin`);
  } catch (error) {
    console.error("Error Department:", error);
  }
};
const getDepartmentById = async (departmentId: string) => {
  // console.log(`page=${pageIndex}&size=${pageSize}`);
  try {
    const url = `${apiUrl}/department/${departmentId}`;
    return await apiClient.get(url);
  } catch (error) {
    console.error("Error Department:", error);
  }
};
const getDepartmentByIdForAdmin = async (departmentId: string) => {
  // console.log(`page=${pageIndex}&size=${pageSize}`);
  try {
    const url = `${apiUrl}/department/admin/${departmentId}`;
    return await apiClient.get(url);
  } catch (error) {
    console.error("Error Department:", error);
  }
};
const CreateDepartment = async (
  formData: FormData
): Promise<AxiosResponse<any>> => {
  return await apiClient.post(`${apiUrl}/department`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateDepartment = async (data: any) => {
  try {
    // console.log("formData",data);

    return await apiClient.put(`${apiUrl}/department`, data, {
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};
const joinDepartment = async (departmentId: string) => {
  try {
    return await apiClient.put(
      `${apiUrl}/usersDepartment`,
      { departmentId },
      {
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
      }
    );
  } catch (error) {
    handleErrorOnAxios(error);
  }
};

const deleteDepartment = async (departmentId: string) => {
  try {
    return await apiClient.delete(`${apiUrl}/department/${departmentId}`, {
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });
  } catch (error) {
    handleErrorOnAxios(error);
  }
};
// -----------------------------------------------------------
//                       Form Table
// -----------------------------------------------------------
const createForm = async (name: string) => {
  try {
    return await apiClient.post(`${apiUrl}/form`, {
      name,
    });
  } catch (error) {
    console.error("API create form", { message: error });
  }
};

const getForm = () => {
  try {
    return axios.get(`${apiUrl}/form`);
  } catch (error) {
    console.error("API get form", { message: error });
  }
};

const updateForm = async (data: { id: string; name: string }) => {
  try {
    return apiClient.put(`${apiUrl}/form`, {
      data,
    });
  } catch (error) {
    console.error("API update form", { message: error });
  }
};

const deleteForm = async (id: string) => {
  try {
    return apiClient.delete(`${apiUrl}/form`, {
      data: { id },
    });
  } catch (error) {
    console.error("API delete form", { message: error });
  }
};

// -----------------------------------------------------------
//                       Permission Table
// -----------------------------------------------------------

const createPermission = async (data: any, assessorID: string) => {
  try {
    return apiClient.post(`${apiUrl}/permission`, { data, assessorID });
  } catch (error) {
    console.error("API delete form", { message: error });
  }
};

const updatePermission = (permissions: any) => {
  try {
    return apiClient.put(`${apiUrl}/permissionRole`, permissions);
  } catch (error) {}
};

const deletePermissionForm = (id: string) => {
  try {
    return apiClient.delete(`${apiUrl}/permissionForm`, {
      data: { id },
    });
  } catch (error) {}
};

// -----------------------------------------------------------
//                       Question Table
// -----------------------------------------------------------
const createQuestion = (data: { content: string; formId: string }) => {
  try {
    return apiClient.post(`${apiUrl}/question`, data);
  } catch (error) {
    console.error("API createQuestion", { message: error });
  }
};
const getQuestion = (formId: string) => {
  try {
    return apiClient.get(`${apiUrl}/questions/${formId}`);
  } catch (error) {
    console.error("API getQuestion", { message: error });
  }
};
const deleteQuestion = (payload: {}) => {
  try {
    return apiClient.delete(`${apiUrl}/question`, {
      data: payload,
    });
  } catch (error) {
    console.error("API deleteQuestion", { message: error });
  }
};

const updateQuestion = (payload: {}) => {
  try {
    return apiClient.put(`${apiUrl}/question`, payload);
  } catch (error) {
    console.error("API updateQuestion", { message: error });
  }
};

// -----------------------------------------------------------
//                       Period Table
// -----------------------------------------------------------
const createPeriod = (payload: {
  title: string;
  start: string;
  end: string;
}) => {
  try {
    return apiClient.post(`${apiUrl}/period`, payload);
  } catch (error) {
    // console.error("API createPeriod", { message: error });
  }
};
const getPeriod = () => {
  try {
    return apiClient.get(`${apiUrl}/periods`);
  } catch (error) {
    console.error("API createPeriod", { message: error });
  }
};
const deletePeriod = (id: string) => {
  try {
    return apiClient.delete(`${apiUrl}/period/${id}`);
  } catch (error) {
    console.error("API createPeriod", { message: error });
  }
};
const updatePeriod = (payload: PeriodType) => {
  try {
    return apiClient.put(`${apiUrl}/period`, payload);
  } catch (error) {
    console.error("API createPeriod", { message: error });
  }
};

// -----------------------------------------------------------
//                       supervises Table
// -----------------------------------------------------------
const getSupervises = () => {
  try {
    return apiClient.get(`${apiUrl}/supervises`);
  } catch (error) {
    console.error("API getSupervises", { message: error });
  }
};

const createSupervise = (payload: { userId: string; departmentId: string }) => {
  try {
    return apiClient.post(`${apiUrl}/supervise`, payload);
  } catch (error) {
    // console.error("API createPeriod", { message: error });
  }
};
const updateSupervise = (payload: {
  superviseId: string;
  userId: string;
  departmentId: string;
}) => {
  try {
    return apiClient.put(`${apiUrl}/supervise`, payload);
  } catch (error) {
    // console.error("API createPeriod", { message: error });
    handleErrorOnAxios(error)
  }
};

const deleteSupervise = (superviseId: string) => {
  try {
    return apiClient.delete(`${apiUrl}/supervise/${superviseId}`);
  } catch (error) {
    handleErrorOnAxios(error)
  }
};

// -----------------------------------------------------------
//                       Evaluate Table
// -----------------------------------------------------------
type createEvaluateType = {
  period_id: string;
  assessor_id: string;
  evaluator_id: string;
  questions: { questionId: string; score: string }[];
};
const createEvaluate = (payload: createEvaluateType) => {
  try {
    return apiClient.post(`${apiUrl}/evaluate`, payload);
  } catch (error) {
    console.error("API evaluate", { message: error });
  }
};
type updateEvaluateType = {
  evaluate_id: string | undefined;
  details: detailsType[];
};
type detailsType = {
  id: string;
  score: number;
};
const updateEvaluate = (payload: updateEvaluateType) => {
  try {
    return apiClient.put(`${apiUrl}/evaluate`, payload);
  } catch (error) {
    console.error({ message: error });
  }
};

type findUserEvaluatedType = {
  period_id: string;
};
const findUserEvaluated = (payload: findUserEvaluatedType) => {
  try {
    return apiClient.get(`${apiUrl}/findUserEval/${payload.period_id}`);
  } catch (error) {
    console.error("API createPeriod", { message: error });
  }
};
type getResultEvaluateProp = {
  period_id: string;
};
const getResultEvaluate = (payload: getResultEvaluateProp) => {
  if (!payload.period_id) {
    throw new Error("Missing evaluator_id or period_id");
  }
  try {
    return apiClient.get(`${apiUrl}/resultEvaluate/${payload.period_id}`);
  } catch (error) {
    console.error("API resultEvaluate", { message: error });
  }
};
type getCountUserAsEvaluatedProp = {
  period_id: string;
};
const getCountUserAsEvaluated = (payload: getCountUserAsEvaluatedProp) => {
  try {
    return apiClient.get(`${apiUrl}/countUserEvaluated/${payload.period_id}`);
  } catch (error) {
    console.error("API getCountUserAsEvaluated", { message: error });
  }
};

const getResultEvaluatePerDepart = (period_id: string) => {
  try {
    return apiClient.get(`${apiUrl}/resultEvaluatePerDepart/${period_id}`);
  } catch (error) {
    console.error("API getResultEvaluatePerDepart", { message: error });
  }
};

const getResultEvaluateDetail = (period_id: string) => {
  try {
    return apiClient.get(`${apiUrl}/resultEvaluateDetail/${period_id}`);
  } catch (error) {
    console.error("API getResultEvaluateDetail", { message: error });
  }
};
type updateVisionOfFormProp = {
  formId: string;
  stackFormLevel: typeOfStach[];
};
type typeOfStach = {
  role_id: string;
  visionLevel: "VISION_1" | "VISION_2" | "UNSET";
};
const updateVisionOfForm = (payload: updateVisionOfFormProp) => {
  try {
    return apiClient.put(`${apiUrl}/roleFormVision`, payload);
  } catch (error) {
    console.error("API getResultEvaluateDetail", { message: error });
  }
};

const getResultEvaluateDetailForAdmin = (period_id: string, userId: string) => {
  try {
    return apiClient.get(
      `${apiUrl}/resultEvaluateDetail/${period_id}/${userId}`
    );
  } catch (error) {
    console.error("API getResultEvaluateDetailForAdmin", { message: error });
    return handleErrorOnAxios(error);
  }
};

const getAllResultIndividualOverview = async (
  period_id: string,
  userId?: string
) => {
  if (!period_id) {
    throw new Error("period_id is required");
  }
  try {
    const url = `${apiUrl}/allResultEvaluateOverview/${period_id}${
      userId ? `/${userId}` : ""
    }`;

    const response = await apiClient.get(url);

    return response;
  } catch (error) {
    console.error("API getAllResultIndividualOverview", { message: error });
    return handleErrorOnAxios(error);
  }
};

type deleteUserEvaluationProp = {
  allUserId: string[];
  periodId: string;
};
const deleteUserEvaluation = (payload: deleteUserEvaluationProp) => {
  try {
    return apiClient.delete(`${apiUrl}/evaluate`, {
      data: payload, // Send the payload directly
    });
  } catch (error) {
    console.error("API deleteUserEvaluation", { message: error });
    return handleErrorOnAxios(error);
  }
};
// -----------------------------------------------
//               History API
// ----------------------------------------------
const getResultEvaluateFormHistory = (period_id: string) => {
  try {
    return apiClient.get(`${apiUrl}/resultEvaluateFormHistory/${period_id}`);
  } catch (error) {
    console.error("API getResultEvaluateFormHistory", { message: error });
    return handleErrorOnAxios(error);
  }
};

const saveEvaluationToHistory = (payload: { period_id: string }) => {
  try {
    return apiClient.post(`${apiUrl}/history`, payload);
  } catch (error) {
    console.error("API saveEvaluationToHistory", { message: error });
    return handleErrorOnAxios(error);
  }
};

const getResultEvaluateFormHistoryForAdmin = (
  period_id: string,
  userId: string
) => {
  try {
    return apiClient.get(
      `${apiUrl}/resultEvaluateFormHistory/${period_id}/${userId}`
    );
  } catch (error) {
    console.error("API getResultEvaluateFormHistoryForAdmin", {
      message: error,
    });
    return handleErrorOnAxios(error);
  }
};

const deleteHistory = (period_id: string) => {
  try {
    return apiClient.delete(`${apiUrl}/history/${period_id}`);
  } catch (error) {
    console.error("API deletedHistory", {
      message: error,
    });
    return handleErrorOnAxios(error);
  }
};

// -----------------------------------------------
//               Export API
// ----------------------------------------------
const getExportEvaluationByUserId = (period_id: string, userId: string) => {
  try {
    return apiClient.get(`${apiUrl}/export/${period_id}/${userId}`, {
      responseType: "arraybuffer",
    });
  } catch (error) {
    console.error("API getExportEvaluationByUserId", { message: error });
    return handleErrorOnAxios(error);
  }
};

export default {
  fetchUserProfile,
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
  fetchProtected,
  getPrefix,
  createForm,
  getForm,
  updateForm,
  deleteForm,
  createPermission,
  createRole,
  deleteRole,
  updatePermission,
  deletePermissionForm,
  createQuestion,
  getQuestion,
  deleteQuestion,
  updateQuestion,
  createPeriod,
  getPeriod,
  deletePeriod,
  updatePeriod,
  updateRole,
  createSupervise,
  updateSupervise,
  getDepartmentByIdForAdmin,
  getDepartmentForAdmin,
  createPrefix,
  deletePrefix,
  createEvaluate,
  updateUserProfileByAdmin,
  updatePrefix,
  findUserEvaluated,
  getResultEvaluate,
  getCountUserAsEvaluated,
  getResultEvaluatePerDepart,
  getSupervises,
  updateProfileName,
  forgotPassowrd,
  resetPassword,
  getResultEvaluateDetail,
  updateVisionOfForm,
  updateEvaluate,
  getResultEvaluateDetailForAdmin,
  getResultEvaluateFormHistory,
  saveEvaluationToHistory,
  getResultEvaluateFormHistoryForAdmin,
  getExportEvaluationByUserId,
  getAllResultIndividualOverview,
  deleteUserEvaluation,
  changePassword,
  deleteHistory,
  joinDepartment,
  deleteUserByAdmin,
  deleteDepartment,
  deleteSupervise,
  updateUserImageForAdmin
};
