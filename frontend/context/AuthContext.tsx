"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  UserData,
  UserRole,
  ApiResponse,
  LoginResponseData,
  VerifyOtpResponseData,
  GenericResponseData
} from "@/types/auth";

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ userId: string } | undefined>;
  logout: () => void;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  verifyOtp: (userId: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response: ApiResponse<{ user: UserData }> =
            await authApi.getProfile();
          if (response.status === 200 && response.data) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          localStorage.removeItem("token");
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response: ApiResponse<LoginResponseData> = await authApi.login(
        email,
        password
      );

      if (response.status === 200 && response.data) {
        return { userId: response.data.userId };
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const verifyOtp = async (userId: string, otp: string) => {
    setError(null);
    try {
      const response: ApiResponse<VerifyOtpResponseData> =
        await authApi.verifyOtp(userId, otp);

      if (response.status === 200 && response.data) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);

        if (response.data.user.role === UserRole.ADMIN) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(response.message || "OTP verification failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    setError(null);
    try {
      const response: ApiResponse<GenericResponseData> = await authApi.register(
        fullName,
        email,
        password
      );

      if (response.status === 200) {
        router.push("/verification-sent");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const forgotPassword = async (email: string) => {
    setError(null);
    try {
      const response: ApiResponse<GenericResponseData> =
        await authApi.forgotPassword(email);

      if (response.status === 200) {
        router.push("/reset-otp-sent");
      } else {
        setError(response.message || "Failed to send reset token");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset token");
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setError(null);
    try {
      const response: ApiResponse<GenericResponseData> =
        await authApi.resetPassword(token, newPassword);

      if (response.status === 200) {
        router.push("/?reset=success");
      } else {
        setError(response.message || "Password reset failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Password reset failed");
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    verifyOtp,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
