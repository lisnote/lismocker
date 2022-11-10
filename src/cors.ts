import type { Request, Response, NextFunction } from "express";
export default function (req: Request, res: Response, next: NextFunction) {
  [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
    "Access-Control-Expose-Headers",
  ].forEach((v) => {
    res.setHeader(v, "*");
  });
  next();
}
