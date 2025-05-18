import { Request, Response, NextFunction } from "express";
import authService from "../../services/auth/auth.service";
import { ApiResponse } from "../../utils/response.util";
import { CustomException } from "../../exceptions/custom.exception";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await authService.register(fullName, email, password);
    res.status(201).json(ApiResponse.success(result.message));
  } catch (error: any) {
    next(new CustomException(error.message, error.status || 500));
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;
    const result = await authService.verifyEmail(token as string);
    res.status(200).json(ApiResponse.success(result.message));
  } catch (error: any) {
    next(new CustomException(error.message, error.status || 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(ApiResponse.success(result.message));
  } catch (error: any) {
    next(new CustomException(error.message, error.status || 500));
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp, userId } = req.body;
    console.log("Verifying OTP for userId:", userId);
    const result = await authService.verifyOtp(userId, otp);
    res.status(200).json(ApiResponse.success("Login successful", result));
  } catch (error: any) {
    next(new CustomException(error.message, error.status || 500));
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(ApiResponse.success(result.message));
  } catch (error: any) {
    next(new CustomException(error.message, error.status || 500));
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    const result = await authService.resetPassword(
      token as string,
      newPassword
    );
    res.status(200).json(ApiResponse.success(result.message));
  } catch (error: any) {
    next(new CustomException(error.message, error.status || 500));
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const result = await authService.getProfile(userId);
    res.status(200).json(ApiResponse.success("Profile fetched", result));
  } catch (error: any) {
    next(new CustomException(error.message, error.status || 500));
  }
};
