import dotenv from "dotenv";
import express from "express";
import cors from "./cors";
import mocker from "./mocker";
import recorder from "./recorder";

dotenv.config();

const port = process.env.PORT as string;
const proxyBackend = process.env.PROXY_BACKEND as string;

function startMocker(port: string, proxy: string) {
  const app = express();
  app.use(express.json());
  app.use(cors);
  app.use(mocker());
  app.use(recorder(proxy));
  app.listen(port, () =>
    console.log(`mocker started in \x1b[1;36mhttp://localhost:${port}\x1b[0m`)
  );
}

export default startMocker;

startMocker(port, proxyBackend);
