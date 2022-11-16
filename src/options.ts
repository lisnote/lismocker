import type { Request, Response, NextFunction } from "express";
export default function options(req: Request, res: Response, next: NextFunction) {
  res.proxySend();
}
