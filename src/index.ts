import { config } from "dotenv-flow";
import express from "express";
import cors from "./cors";
import options from "./options";
import update from "./update";
import mocker from "./mocker";
import recorder from "./recorder";

config();
const { PORT, PROXY_BACKEND } = process.env as Record<string, string>;

function startMocker(port: string, proxy: string) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors);
  app.options("*", options);
  app.use(update);
  app.use(mocker());
  app.use(recorder(proxy));
  app.listen(port, () =>
    console.log(`mocker started in \x1b[1;36mhttp://localhost:${port}\x1b[0m`)
  );
}

export default startMocker;

startMocker(PORT, PROXY_BACKEND);
