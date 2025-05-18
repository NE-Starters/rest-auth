import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const logDirectory = process.env.LOG_DIR || "./logs";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: `${logDirectory}/audit.log`, level: "info" }),
    new winston.transports.Console({ level: "info" }),
  ],
});

export { logger };