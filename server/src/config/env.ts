import dotenv from "dotenv";

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("Invalid Tokens");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Invalid Tokens");
}

const config = {
  port: process.env.PORT || 8800,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
} as const;

export { config };
