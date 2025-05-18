import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import express, { Request, Response, NextFunction } from "express";
import { authRoutes } from "./routes/auth.routes";
import dotenv from "dotenv";
import { setupSwagger } from "./config/swagger.setup";
import { ApiResponse } from "./utils/response.util";
import { CustomException } from "./exceptions/custom.exception";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Mount authentication routes
app.use("/api/auth", authRoutes);
setupSwagger(app);
// Error handling middleware
app.use(
  (err: CustomException, req: Request, res: Response, next: NextFunction) => {
    res
      .status(err.status || 500)
      .json(ApiResponse.error(err.message, err.status, err.details));
  }
);

// Initialize database and start server
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected and synchronized successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
