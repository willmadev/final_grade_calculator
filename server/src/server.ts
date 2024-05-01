import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import router from "./api/router";
import { config } from "./config/env";

const main = async () => {
  const app = Express();

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use("/api", router);

  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
};

main();
