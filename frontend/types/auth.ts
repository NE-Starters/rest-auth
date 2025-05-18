export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  errors?: any[];
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface LoginResponseData {
  userId: string;
}

export interface VerifyOtpResponseData {
  token: string;
  user: UserData;
}

export interface ProfileResponseData {
  user: UserData;
}

export interface VerifyEmailResponseData {
  user: UserData;
}

export interface VerifyOtpResponseData {
  token: string;
  user: UserData;
}

export interface GenericResponseData {
  // For endpoints like register, forgotPassword, resetPassword that may not return specific data
}
