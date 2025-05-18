// lib/api.ts
import axios from "axios";
import {
  ApiResponse,
  LoginResponseData,
  VerifyOtpResponseData,
  ProfileResponseData,
  VerifyEmailResponseData,
  GenericResponseData
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API functions
export const authApi = {
  register: async (
    fullName: string,
    email: string,
    password: string
  ): Promise<ApiResponse<GenericResponseData>> => {
    const response = await api.post<ApiResponse<GenericResponseData>>(
      "/auth/register",
      {
        fullName,
        email,
        password
      }
    );
    return response.data;
  },

  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponseData>> => {
    const response = await api.post<ApiResponse<LoginResponseData>>(
      "/auth/login",
      { email, password }
    );
    return response.data;
  },

  verifyOtp: async (
    userId: string,
    otp: string
  ): Promise<ApiResponse<VerifyOtpResponseData>> => {
    const response = await api.post<ApiResponse<VerifyOtpResponseData>>(
      "/auth/verify-otp",
      { userId, otp }
    );
    return response.data;
  },

  forgotPassword: async (
    email: string
  ): Promise<ApiResponse<GenericResponseData>> => {
    const response = await api.post<ApiResponse<GenericResponseData>>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<GenericResponseData>> => {
    const response = await api.post<ApiResponse<GenericResponseData>>(
      "/auth/reset-password",
      {
        token,
        newPassword
      }
    );
    return response.data;
  },

  verifyEmail: async (
    token: string
  ): Promise<ApiResponse<VerifyEmailResponseData>> => {
    const response = await api.get<ApiResponse<VerifyEmailResponseData>>(
      `/auth/verify-email?token=${token}`
    );
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<ProfileResponseData>> => {
    const response = await api.get<ApiResponse<ProfileResponseData>>(
      "/auth/profile"
    );
    return response.data;
  }
};
