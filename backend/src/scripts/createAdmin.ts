import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/user.model";
import { UserRole } from "../enums/IRole";
import bcrypt from "bcrypt";

async function createAdmin() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    const userRepository = AppDataSource.getRepository(User);
    const existingAdmin = await userRepository.findOne({
      where: { role: UserRole.ADMIN }
    });

    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      return;
    }

    const admin = new User();
    admin.fullName = "Admin User";
    admin.email = "ijustin20075@gmail.com";
    admin.password = await bcrypt.hash("Admin@123", 10); // Secure password
    admin.isVerified = true; // Admin is pre-verified
    admin.role = UserRole.ADMIN;

    await userRepository.save(admin);
    console.log("Admin user created successfully:", admin.email);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

createAdmin();
