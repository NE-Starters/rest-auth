import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description:
        "API endpoints for user authentication and profile management"
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local development server"
      }
    ]
  },
  apis: ["./src/routes/*.ts", "./src/controllers/**/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
