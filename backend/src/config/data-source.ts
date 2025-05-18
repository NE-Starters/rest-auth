import { DataSource } from "typeorm";
import { User } from "../models/user.model";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "justin",
  password: "dev",
  database: "rest-auth",
  entities: [User],
  synchronize: true,
  logging: true
});
