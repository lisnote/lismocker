import type { Request, Response, NextFunction } from 'express';
export default function cors(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');
  next();
}
