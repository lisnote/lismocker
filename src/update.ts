import type { Request, Response, NextFunction } from "express";
import { initMocker } from "./mocker";
import { initRecorder } from "./recorder";

const pathMapper: Record<string, Function> = {
  mocker: initMocker,
  recorder: initRecorder,
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
    fn();
    res.end("update: " + key);
    return true;
  }
}
