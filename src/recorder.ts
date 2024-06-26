import axios, { AxiosResponse } from "axios";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { initMocker } from "./mocker";
import { config } from "dotenv-flow";

import type { Request, Response } from "express";

let target: string;
function createRecorder(proxy: string) {
  target = proxy;
  return async function recorder(req: Request, res: Response) {
    console.log("recorder access", req.method, req.path);
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
      .then((proxyRes:AxiosResponse) => {
        // 代理请求
        res.status(proxyRes.status);
        Object.entries(proxyRes.headers).forEach(([key, value]) => {
          res.setHeader(key, value as string);
        });
        res.proxySend(proxyRes.data);
        // 创建 mocker 记录
        if (proxyRes.status != 200) return;
        const dir = join(__dirname, "data/recorder");
        const file = req.path.replaceAll("/", "_") + ".json";
        const jsonData: Record<string, any> = {};
        jsonData[req.method] = {};
        jsonData[req.method][req.path] = proxyRes.data;
        mkdirSync(dir, { recursive: true });
        writeFileSync(
          join(dir, file),
          JSON.stringify(jsonData, null, 2),
          "utf8"
        );
        initMocker();
      })
      .catch((e) => res.proxySend(e));
  };
}
function initRecorder() {
  const { PROXY_BACKEND } = config({ silent: true }).parsed as Record<
    string,
    string
  >;
  target = PROXY_BACKEND;
}
export { createRecorder as default, initRecorder };
