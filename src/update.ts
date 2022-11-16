import type { Request, Response, NextFunction } from "express";
import { initMocker } from "./mocker";
import { initRecorder } from "./recorder";
import startServer, { app, server } from "./index";
import { config } from "dotenv-flow";

// key 作为路由, value 作为要运行的函数, 访问 localhost:$PORT/update/:key 执行函数
const pathMapper: Record<string, (req: Request, res: Response) => void> = {
  init() {
    server.close();
    const env = config({ silent: true }).parsed as Record<string, string>;
    Object.entries(env).forEach(([key, value]) => {
      process.env[key] = value;
    });
    const { PORT, PROXY_BACKEND } = env;
    startServer(PORT, PROXY_BACKEND);
    loadRouteHandleMapper();
  },
  initMocker: () => initMocker(),
  removeMocker: () => removeHandle("mocker"),
  installMocker: () => installHandle("mocker"),
  initRecorder: () => initRecorder(),
  stop: () => server.close(),
};

export default function update(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const path = req.path.replace(/\/$/, "");
  for (let key in pathMapper) {
    if (updateProxy(key, pathMapper[key], path, req, res)) return;
  }
  next();
}

// update 代理函数, 处理 pathMapper 中的函数使其更符合输出
function updateProxy(
  key: string,
  fn: Function,
  path: string,
  req: Request,
  res: Response
) {
  if (path === "/update/" + key) {
    console.log("update access", req.method, req.path);
    res.proxySend("update: " + key);
    fn(req, res);
    return true;
  }
}

// 启用 & 禁用 express 中间件
let routeHandleMapper: Record<string, Function> = {};
function loadRouteHandleMapper() {
  app._router.stack.forEach((route: any) => {
    routeHandleMapper[route.name] = route.handle;
  });
}
setTimeout(loadRouteHandleMapper, 0);
function removeHandle(routeName: string) {
  const route = app._router.stack.find((v: any) => v.name === routeName);
  route.handle = function (req: Request, res: Response, next: NextFunction) {
    next();
  };
}
function installHandle(routeName: string) {
  const route = app._router.stack.find((v: any) => v.name === routeName);
  route.handle = routeHandleMapper[routeName];
}
