import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 8800,
} as const;

export { config };
