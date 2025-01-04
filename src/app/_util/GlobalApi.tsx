"use client";

import { toast } from "@/components/ui/use-toast";
import { Department, PeriodType, PrefixType } from "@/types/interface";
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
    return axios.put(`${apiUrl}/prefix`, data, { withCredentials: true });
  } catch (error) {
    console.error("API updatePrefix", { message: error });
  }
};
const createPrefix = (data: { prefix_name: string }) => {
  try {
    return axios.post(`${apiUrl}/prefix`, data, { withCredentials: true });
  } catch (error) {
    console.error("Error prefix:", error);
  }
};
const deletePrefix = (payload: {}) => {
  try {
    return axios.delete(`${apiUrl}/prefix`, {
      data: payload, // Send the payload directly
      withCredentials: true,
    });
  } catch (error) {
    console.error("API deletePrefix", { message: error });
  }
};

// -----------------------------------------------------------
//                       untitle
// -----------------------------------------------------------
const fetchProtected = () => {
  return axios.get(`${apiUrl}/protected`, {
    withCredentials: true,
  });
};

const fetchUserProfile = async (): Promise<AxiosResponse<UserProfile>> => {
  // Return the axios.get promise with type
  return await axios.get(`${apiUrl}/myProfile`, {
    withCredentials: true, // ส่ง cookies ไปด้วย
  });
};

const updateProfileName = async (payload: {
  name: string;
  prefixId: string;
}) => {
  try {
    return await axios.put(`${apiUrl}/myProfile`, payload, {
      withCredentials: true, // ส่ง cookies ไปด้วย
    });
  } catch (error) {
    console.error("Error updateProfileName:", error);
  }
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

const forgotPassowrd = async (email: string) => {
  try {
    return await axios.get(`${apiUrl}/forgot-password/${email}`);
  } catch (error) {
    console.error("Error forgotPassowrd:", { message: error });
  }
};
const resetPassword = async (payload: {
  newPassword?: string;
  token: string | string[];
}) => {
  try {
    return await axios.put(`${apiUrl}/reset-password`, payload);
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

//  ใช้ ที่หน้า department & role path menagement ตอนที่จะเลือกเข้าuser คนไหนเข้าหน่วยงาน
const addUsersToDepartment = async (payload: any) => {
  try {
    return await axios.put(`${apiUrl}/usersToDepartment`, payload, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });
  } catch (error) {
    console.error("Error usersToDepartment:", error);
  }
};

const updateUserProfileByAdmin = async (payload: any) => {
  try {
    return await axios.put(`${apiUrl}/userProfile`, payload, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });
  } catch (error) {
    console.error("Error userProfile:", error);
  }
};

// -----------------------------------------------------------
//                       Role Table
// -----------------------------------------------------------
const createRole = (payload: any) => {
  try {
    return axios.post(`${apiUrl}/role`, payload, { withCredentials: true });
  } catch (error) {
    console.error("Error role:", error);
  }
};
const updateRole = (payload: any) => {
  try {
    return axios.put(`${apiUrl}/role`, payload, { withCredentials: true });
  } catch (error) {
    console.error("Error role:", error);
  }
};

const deleteRole = (id: string) => {
  try {
    return axios.delete(`${apiUrl}/role`, {
      data: { id },
      withCredentials: true,
    });
  } catch (error) {}
};

const getRole = async () => {
  try {
    return await axios.get(`${apiUrl}/role`, { withCredentials: true });
  } catch (error) {
    console.error("Error role:", error);
  }
};
// function api สำหรับ user เมื่อต้องการร้องขอ role
const sendRoleRequest = async (userId: any, roleId: any) => {
  try {
    return await axios.post(
      `${apiUrl}/sendRoleRequest`,
      {
        userId, // userId จะต้องเป็นค่าที่มาจากการล็อกอิน
        roleId,
      },
      {
        withCredentials: true,
      }
    );
  } catch (error) {}
};

// function api สำหรับ Admin ที่ใช้ในการจัดการกับ การ Approve หรือ Reject เมื่อ user ร้องขอ role
const resolveRole = async (
  requestId: string,
  status: string,
  userId: string
) => {
  try {
    return await axios.patch(
      `${apiUrl}/resolveRole`,
      {
        requestId,
        status,
        userId,
      },
      {
        withCredentials: true,
      }
    );
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
    return await axios.get(`${apiUrl}/department/admin`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error Department:", error);
  }
};
const getDepartmentById = async (departmentId: string) => {
  // console.log(`page=${pageIndex}&size=${pageSize}`);
  try {
    const url = `${apiUrl}/department/${departmentId}`;
    return await axios.get(url, { withCredentials: true });
  } catch (error) {
    console.error("Error Department:", error);
  }
};
const getDepartmentByIdForAdmin = async (departmentId: string) => {
  // console.log(`page=${pageIndex}&size=${pageSize}`);
  try {
    const url = `${apiUrl}/department/admin/${departmentId}`;
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

const updateDepartment = async (data: any) => {
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

// -----------------------------------------------------------
//                       Form Table
// -----------------------------------------------------------
const createForm = async (name: string) => {
  try {
    return await axios.post(
      `${apiUrl}/form`,
      {
        name,
      },
      {
        withCredentials: true,
      }
    );
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
    return axios.put(
      `${apiUrl}/form`,
      {
        data,
      },
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("API update form", { message: error });
  }
};

const deleteForm = async (id: string) => {
  try {
    return axios.delete(`${apiUrl}/form`, {
      data: { id },
      withCredentials: true,
    });
  } catch (error) {
    console.error("API delete form", { message: error });
  }
};

// -----------------------------------------------------------
//                       Permission Table
// -----------------------------------------------------------

const createPermission = async (data: any, assessorID: string) => {
  console.log(data);

  try {
    return axios.post(
      `${apiUrl}/permission`,
      { data, assessorID },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("API delete form", { message: error });
  }
};

const updatePermission = (permissions: any) => {
  console.log(permissions);

  try {
    return axios.put(`${apiUrl}/permissionRole`, permissions, {
      withCredentials: true,
    });
  } catch (error) {}
};

const deletePermissionForm = (id: string) => {
  try {
    return axios.delete(`${apiUrl}/permissionForm`, {
      data: { id },
      withCredentials: true,
    });
  } catch (error) {}
};

// -----------------------------------------------------------
//                       Question Table
// -----------------------------------------------------------
const createQuestion = (data: { content: string; formId: string }) => {
  try {
    return axios.post(`${apiUrl}/question`, data, { withCredentials: true });
  } catch (error) {
    console.error("API createQuestion", { message: error });
  }
};
const getQuestion = (formId: string) => {
  try {
    return axios.get(`${apiUrl}/questions/${formId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("API getQuestion", { message: error });
  }
};
const deleteQuestion = (payload: {}) => {
  try {
    return axios.delete(`${apiUrl}/question`, {
      data: payload, // Send the payload directly
      withCredentials: true,
    });
  } catch (error) {
    console.error("API deleteQuestion", { message: error });
  }
};

const updateQuestion = (payload: {}) => {
  try {
    return axios.put(`${apiUrl}/question`, payload, { withCredentials: true });
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
    return axios.post(`${apiUrl}/period`, payload, { withCredentials: true });
  } catch (error) {
    // console.error("API createPeriod", { message: error });
  }
};
const getPeriod = () => {
  try {
    return axios.get(`${apiUrl}/periods`, { withCredentials: true });
  } catch (error) {
    console.error("API createPeriod", { message: error });
  }
};
const deletePeriod = (id: string) => {
  try {
    return axios.delete(`${apiUrl}/period/${id}`, { withCredentials: true });
  } catch (error) {
    console.error("API createPeriod", { message: error });
  }
};
const updatePeriod = (payload: PeriodType) => {
  try {
    return axios.put(`${apiUrl}/period`, payload, { withCredentials: true });
  } catch (error) {
    console.error("API createPeriod", { message: error });
  }
};

// -----------------------------------------------------------
//                       supervises Table
// -----------------------------------------------------------
const getSupervises = () => {
  try {
    return axios.get(`${apiUrl}/supervises`, { withCredentials: true });
  } catch (error) {
    console.error("API getSupervises", { message: error });
  }
};

const createSupervise = (payload: { userId: string; departmentId: string }) => {
  try {
    return axios.post(`${apiUrl}/supervise`, payload, {
      withCredentials: true,
    });
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
    return axios.put(`${apiUrl}/supervise`, payload, {
      withCredentials: true,
    });
  } catch (error) {
    // console.error("API createPeriod", { message: error });
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
    return axios.post(`${apiUrl}/evaluate`, payload, {
      withCredentials: true,
    });
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
    return axios.put(`${apiUrl}/evaluate`, payload, {
      withCredentials: true,
    });
  } catch (error) {
    console.error({ message: error });
  }
};

type findUserEvaluatedType = {
  period_id: string;
};
const findUserEvaluated = (payload: findUserEvaluatedType) => {
  try {
    return axios.get(`${apiUrl}/findUserEval/${payload.period_id}`, {
      withCredentials: true,
    });
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
    return axios.get(`${apiUrl}/resultEvaluate/${payload.period_id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("API resultEvaluate", { message: error });
  }
};
type getCountUserAsEvaluatedProp = {
  period_id: string;
};
const getCountUserAsEvaluated = (payload: getCountUserAsEvaluatedProp) => {
  try {
    return axios.get(`${apiUrl}/countUserEvaluated/${payload.period_id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("API getCountUserAsEvaluated", { message: error });
  }
};

const getResultEvaluatePerDepart = (period_id: string) => {
  try {
    return axios.get(`${apiUrl}/resultEvaluatePerDepart/${period_id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("API getResultEvaluatePerDepart", { message: error });
  }
};

const getResultEvaluateDetail = (period_id: string) => {
  try {
    return axios.get(`${apiUrl}/resultEvaluateDetail/${period_id}`, {
      withCredentials: true,
    });
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
    return axios.put(`${apiUrl}/roleFormVision`, payload, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("API getResultEvaluateDetail", { message: error });
  }
};

const getResultEvaluateDetailForAdmin = (period_id: string, userId: string) => {
  try {
    return axios.get(`${apiUrl}/resultEvaluateDetail/${period_id}/${userId}`, {
      withCredentials: true,
    });
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

    const response = await axios.get(url, {
      withCredentials: true,
    });

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
    return axios.delete(`${apiUrl}/evaluate`, {
      data: payload, // Send the payload directly
      withCredentials: true,
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
    return axios.get(`${apiUrl}/resultEvaluateFormHistory/${period_id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("API getResultEvaluateFormHistory", { message: error });
    return handleErrorOnAxios(error);
  }
};

const saveEvaluationToHistory = (payload: { period_id: string }) => {
  try {
    return axios.post(`${apiUrl}/history`, payload, {
      withCredentials: true,
    });
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
    return axios.get(
      `${apiUrl}/resultEvaluateFormHistory/${period_id}/${userId}`,
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("API getResultEvaluateFormHistoryForAdmin", {
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
    return axios.get(`${apiUrl}/export/${period_id}/${userId}`, {
      withCredentials: true,
      responseType: "arraybuffer",
    });
  } catch (error) {
    console.error("API getExportEvaluationByUserId", { message: error });
    return handleErrorOnAxios(error);
  }
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
};
