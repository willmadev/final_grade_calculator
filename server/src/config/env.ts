import dotenv from "dotenv";

dotenv.config();

class ConfigError extends Error {
  constructor(envVariable: string) {
    super(`Environment variable ${envVariable} not defined`);
  }
}

if (!process.env.SENDGRID_API_KEY) {
  throw new ConfigError("SENDGRID_API_KEY");
}
if (!process.env.VERIFY_ID_SECRET) {
  throw new ConfigError("VERIFY_ID_SECRET");
}

const config = {
  clientUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "https://fgc.willma.me",
  serverUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8800"
      : "https://fgc.willma.me",
  port: process.env.PORT || 8800,
  secrets: {
    sendgrid: process.env.SENDGRID_API_KEY,
    verifyId: process.env.VERIFY_ID_SECRET,
  },
} as const;

export { config };
