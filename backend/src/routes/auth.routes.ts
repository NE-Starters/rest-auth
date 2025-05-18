import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getProfile
} from "../controllers/auth/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import {
  registerValidator,
  loginValidator,
  validate
} from "../validators/auth.validator";

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           type: object
 *           nullable: true
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 400
 *         message:
 *           type: string
 *           example: Bad request
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 example: Invalid value
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the user
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user
 *                 example: password123
 *             required:
 *               - fullName
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 201
 *               message: Registration successful. Check your email to verify.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: User already exists
 *               errors:
 *                 - msg: Invalid value
 */
router.post("/register", registerValidator, validate, register);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token sent to the user's email
 *         example: abc123-def456-ghi789
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 200
 *               message: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: Invalid or expired verification token
 */
router.get("/verify", verifyEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: OTP sent to user's email for login verification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 200
 *               message: OTP sent to your email
 *               data:
 *                 userId: uuid-1234-5678-9012
 *       400:
 *         description: Bad request or invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: Invalid credentials or unverified email
 *               errors:
 *                 - msg: Invalid value
 */
router.post("/login", loginValidator, validate, login);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID returned from the login endpoint
 *                 example: uuid-1234-5678-9012
 *               otp:
 *                 type: string
 *                 description: The one-time password sent to the user's email
 *                 example: 123456
 *             required:
 *               - userId
 *               - otp
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 200
 *               message: Login successful
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid OTP or user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: Invalid OTP
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: john.doe@example.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Reset link sent to user's email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 200
 *               message: Reset link sent to your email
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 404
 *               message: User not found
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset token sent to the user's email
 *         example: abc123-def456-ghi789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *                 example: newpassword123
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 200
 *               message: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: Invalid or expired reset token
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 200
 *               message: Profile fetched
 *               data:
 *                 id: uuid-1234-5678-9012
 *                 fullName: John Doe
 *                 email: john.doe@example.com
 *                 role: USER
 *                 createdAt: 2025-05-18T01:32:00Z
 *       403:
 *         description: Forbidden due to insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $refTJ
 *               example:
 *                 status: 403
 *                 message: Forbidden: Insufficient role
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 404
 *               message: User not found
 */
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(["USER", "ADMIN"]),
  getProfile
);

export { router as authRoutes };
