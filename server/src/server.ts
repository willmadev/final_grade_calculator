import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./api/router";
import { config } from "./config/env";

const main = async () => {
  const app = Express();

  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "development"
          ? "http://localhost:5173"
          : "https://fgc.willma.me",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use("/api", router);

  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
};

main();
