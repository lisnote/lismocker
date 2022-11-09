import axios from "axios";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { dataLoader } from "./mocker";

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
        // 代理请求
        res.status(proxyRes.status);
        Object.entries(proxyRes.headers).forEach(([key, value]) => {
          res.setHeader(key, value as string);
        });
        res.setHeader("access-control-allow-origin", "*");
        res.send(proxyRes.data);
        // 创建 mocker 记录
        if (proxyRes.status != "200") return;
        const dir = join(__dirname, "data/recorder");
        const file = req.path.replaceAll("/", "_") + ".json";
        const jsonData: Record<string, any> = {};
        jsonData[req.method] = {};
        jsonData[req.method][req.path] = proxyRes.data;
        mkdir(dir, { recursive: true })
          .then(() => {
            return writeFile(
              join(dir, file),
              JSON.stringify(jsonData, null, 2),
              "utf8"
            );
          })
          .then(() => dataLoader());
      })
      .catch((e) => res.send(e));
  };
}
