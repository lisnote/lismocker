import type { Request, Response, NextFunction } from 'express';
export default function proxySend(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.proxySend = function () {
    const allowOrigin = req.headers.origin || '*';
    const allowHeaders = req.headers['access-control-request-headers'] || '*';
    const allowMethods =
      req.headers['access-control-request-method'] || req.method || '*';
    if (req.url.includes('getStationPanking')) {
      console.error(req.path, allowOrigin, allowHeaders, allowMethods);
    }
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Headers', allowHeaders);
    res.setHeader('Access-Control-Allow-Methods', allowMethods);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', '*');
    const response = res.send(...arguments);
    res.destroy();
    return response;
  };
  next();
}
