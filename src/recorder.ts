import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import axios from "axios";

import type { Request, Response, NextFunction } from "express";

export default function (target: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    axios({
      baseURL: target,
      method: req.method,
      url: req.originalUrl,
      headers: {
        ...req.headers,
        host: target.replace(/https?:\/\//, ""),
      },
      data: req.body,
    })
      .catch((e) => e.response)
      .then((proxyRes) => {
        res.status(proxyRes.status);
        Object.entries(proxyRes.headers).forEach(([key, value]) => {
          res.setHeader(key, value as string);
        });
        res.setHeader("access-control-allow-origin", "*");
        res.send(proxyRes.data);
      })
      .catch((e) => res.send(e));
  };
}

// export default createProxyMiddleware({
//   target: 'https://api.github.com',
//   changeOrigin: true,
//   selfHandleResponse: true,
//   onProxyRes: responseInterceptor(async (respBuffer, proxyRes, req) => {
//     const pathName = req.url.replace(/\?.*/, '');
//     const data = respBuffer.toString('utf8');
//     const dir = join(__dirname, 'data/recorder');
//     const file = req.url.replace(/\?.*/, '').replaceAll('/', '_') + '.json';
//     const jsonData = {};
//     jsonData[req.method] = {};
//     jsonData[req.method][pathName] = JSON.parse(data);
//     mkdir(dir, { recursive: true }).then(() => {
//       writeFile(join(dir, file), JSON.stringify(jsonData, null, 2), 'utf8');
//     });
//     return respBuffer;
//   }),
// });
