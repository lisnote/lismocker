import { config } from "dotenv-flow";
import express from "express";
import destroyer from "./destroyer";
import cors from "./cors";
import options from "./options";
import update from "./update";
import mocker from "./mocker";
import recorder from "./recorder";

import type { Server } from "http";

config();
const { PORT, PROXY_BACKEND } = process.env as Record<string, string>;

let server: Server;
function startServer(port: string, proxy: string) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(destroyer);
  app.use(cors);
  app.options("*", options);
  app.use(update);
  app.use(mocker());
  app.use(recorder(proxy));
  server = app.listen(port, () =>
    console.log(`mocker started in \x1b[1;36mhttp://localhost:${port}\x1b[0m`)
  );
}

export { startServer as default, server };

startServer(PORT, PROXY_BACKEND);
