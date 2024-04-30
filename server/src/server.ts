import Express from "express";
import { config } from "./config/env";

const main = async () => {
  const app = Express();

  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
};

main();
