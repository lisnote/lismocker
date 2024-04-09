import { config } from "dotenv-flow";
import express from "express";
import proxySend from "./proxySend";
import options from "./options";
import logger from "./logger";
import update from "./update";
import createMocker from "./mocker";
import createRecorder from "./recorder";

import type { Express } from "express";
import type { Server } from "http";

config();
const { PORT, PROXY_BACKEND } = process.env as Record<string, string>;

let app: Express;
let server: Server;
function startServer(port: string, proxy: string) {
  app = express();
  app.use(express.raw({ type: "*/*" }));
  app.use(proxySend);
  app.options("*", options);
  app.use(logger);
  app.use(update);
  app.use(createMocker());
  app.use(createRecorder(proxy));
  server = app.listen(port, () =>
    console.log(`mocker started in \x1b[1;36mhttp://localhost:${port}\x1b[0m`)
  );
}

export { startServer as default, app, server };

startServer(PORT, PROXY_BACKEND);
