import { AppDataSource } from "../../config/data-source";
import { User } from "../../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../../config/email.config";
import { v4 as uuidv4 } from "uuid";
import { authenticator } from "otplib";
import { logger } from "../../config/audit.config";
import { CustomException } from "../../exceptions/custom.exception";
import { createClient } from "redis";

const userRepository = AppDataSource.getRepository(User);
const redisClient = createClient();
redisClient.connect();

class AuthService {
  constructor() {
    if (!process.env.OTP_SECRET) {
      throw new Error("OTP_SECRET is not defined in .env");
    }
  }

  async register(fullName: string, email: string, password: string) {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) throw new CustomException("User already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken
    });
    await userRepository.save(user);

    logger.info("User registered", { userId: user.id, email });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<a href="http://localhost:3000/api/auth/verify?token=${verificationToken}">Verify Email</a>`
    });

    return { message: "Registration successful. Check your email to verify." };
  }

  async verifyEmail(token: string) {
    const user = await userRepository.findOne({
      where: { verificationToken: token }
    });
    if (!user)
      throw new CustomException("Invalid or expired verification token", 400);

    user.isVerified = true;
    user.verificationToken = null;
    await userRepository.save(user);

    logger.info("Email verified", { userId: user.id });
    return { message: "Email verified successfully" };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !user.isVerified)
      throw new CustomException("Invalid credentials or unverified email", 400);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new CustomException("Invalid credentials", 400);

    const otp = authenticator.generate(process.env.OTP_SECRET!);
    console.log("Generated OTP:", otp);
    await redisClient.setEx(`otp:${user.id}`, 300, otp);

    logger.info("OTP sent for login", { userId: user.id, email });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      html: `<p>Your OTP is: <strong>${otp}</strong>. Valid for 5 minutes.</p>`
    });

    return { message: "OTP sent to your email", userId: user.id }; // Add userId
  }

  async verifyOtp(userId: string, otp: string) {
    const storedOtp = await redisClient.get(`otp:${userId}`);
    if (!storedOtp) throw new CustomException("OTP expired or not found", 400);

    const isValid = otp === storedOtp; // Direct comparison for now
    if (!isValid) throw new CustomException("Invalid OTP", 400);

    await redisClient.del(`otp:${userId}`);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) throw new CustomException("User not found", 404);

    const token = jwt.sign(
      { id: userId, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    logger.info("Login successful with OTP", { userId });
    return { token };
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new CustomException("User not found", 404);

    const resetToken = uuidv4();
    user.resetToken = resetToken;
    await userRepository.save(user);

    logger.info("Password reset requested", { userId: user.id, email });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `<a href="http://localhost:3000/api/auth/reset?token=${resetToken}">Reset Password</a>`
    });

    return { message: "Reset link sent to your email" };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await userRepository.findOne({ where: { resetToken: token } });
    if (!user) throw new CustomException("Invalid or expired reset token", 400);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    await userRepository.save(user);

    logger.info("Password reset successful", { userId: user.id });
    return { message: "Password reset successfully" };
  }

  async getProfile(userId: string) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) throw new CustomException("User not found", 404);
    logger.info("Profile accessed", { userId });
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}

export default new AuthService();
