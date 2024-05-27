export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8800/api"
    : "https://fgc.willma.me/api";
