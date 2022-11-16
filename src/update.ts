import type { Request, Response, NextFunction } from "express";
import { initMocker } from "./mocker";
import { initRecorder } from "./recorder";
import startServer, { app, server } from "./index";
import { config } from "dotenv-flow";

const pathMapper: Record<string, (req: Request, res: Response) => void> = {
  init(req: Request, res: Response) {
    server.close();
    const env = config({ silent: true }).parsed as Record<string, string>;
    Object.entries(env).forEach(([key, value]) => {
      process.env[key] = value;
    });
    const { PORT, PROXY_BACKEND } = env;
    startServer(PORT, PROXY_BACKEND);
  },
  initMocker: () => initMocker(),
  initRecorder: () => initRecorder(),
  stop: () => server.close(),
};

export default function (req: Request, res: Response, next: NextFunction) {
  const path = req.path.replace(/\/$/, "");
  for (let key in pathMapper) {
    if (updateProxy(key, pathMapper[key], path, req, res)) return;
  }
  next();
}

function updateProxy(
  key: string,
  fn: Function,
  path: string,
  req: Request,
  res: Response
) {
  if (path === "/update/" + key) {
    console.log("update access", req.method, req.path);
    res.proxySend("update: " + key);
    fn(req, res);
    return true;
  }
}
