import type { Request, Response, NextFunction } from "express";
export default function destroyer(req: Request, res: Response, next: NextFunction) {
  res.proxySend = function () {
    const response = res.send(...arguments);
    res.destroy();
    return response;
  };
  next();
}
