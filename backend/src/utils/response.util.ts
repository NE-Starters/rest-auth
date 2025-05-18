import { plainToClass } from "class-transformer";

class ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  errors?: any[];

  constructor(status: number, message: string, data?: T, errors?: any[]) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(message: string, data?: T) {
    return plainToClass(ApiResponse, new ApiResponse(200, message, data));
  }

  static error(message: string, status: number = 400, errors?: any[]) {
    return plainToClass(
      ApiResponse,
      new ApiResponse(status, message, undefined, errors)
    );
  }
}

export { ApiResponse };
