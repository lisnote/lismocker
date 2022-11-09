import { stat } from "fs/promises";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import json5 from "json5";

import type { Request, Response, NextFunction } from "express";

const data: Record<string, any> = {};
export default function mocker() {
  dataLoader();
  return function (req: Request, res: Response, next: NextFunction) {
    if (data[req.method] && data[req.method][req.path]) {
      console.log("mocker access", req.method, req.path);
      res.send(data[req.method][req.path]);
      return;
    }
    next();
  };
}

// 加载 mock 数据到 data 对象
export async function dataLoader(dir = join(__dirname, "data")) {
  readdirSync(dir).forEach(async (file) => {
    const fullPath = join(dir, file);
    stat(fullPath).then((state) => {
      if (state.isDirectory()) {
        dataLoader(fullPath);
      } else if (/\.json5?$/.test(fullPath)) {
        const jsonData = json5.parse(readFileSync(fullPath).toString());
        Object.entries(jsonData).forEach(([key, value]) => {
          data[key] = data[key] ?? {};
          Object.assign(data[key], value);
        });
      }
    });
  });
}