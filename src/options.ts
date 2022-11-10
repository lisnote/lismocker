import type { Request, Response, NextFunction } from "express";
export default function (req: Request, res: Response, next: NextFunction) {
  console.log("options access", req.method, req.path);
  res.end();
}
