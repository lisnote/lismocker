import { appendFileSync, mkdirSync } from "fs";
import { join, parse } from "path";
import moment from "moment";

import type { Request, Response, NextFunction } from "express";

export default function options(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { method, url, headers } = req;
  const time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
  writeLog({ method, url, headers });
  next();
}

async function writeLog(
  log: Record<string, unknown>,
  path: string = join(
    __dirname,
    "logs",
    moment().utcOffset(8).format("YYYY-MM-DD") + ".log"
  )
) {
  mkdirSync(parse(path).dir, { recursive: true });
  appendFileSync(path, JSON.stringify(log, null, 2) + "\n");
}
