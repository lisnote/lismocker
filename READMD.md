# LisMocker

一个 mocker, 一个 restful api 的代理及记录工具

## 功能

1. 将 data 文件夹中的 json/json5 格式文件数据加载为接口数据
2. 代理后端接口, 允许跨域访问并将代理到的接口数据记录到 data/recorder 文件夹中
3. 控制开关, 通过访问接口对 LisMocker 进行重启, 重新加载环境数据, 关闭/启用中间件操作
4. 日志记录

## 控制

LisMocker 提供了通过 web 访问进行控制的功能, 可以通过浏览器或是 curl 等工具对 LisMocker 进行控制.

使用方式例如, init 是初始化指令, 进行初始化可以访问 `http://localhost:8000/update/init`

- 指令一览

  init: 初始化所有

  initMocker: 初始化 mocker 模块

  removeMocker: 禁用 mocker 模块

  installMocker: 启用 mocker 模块

  initRecorder: 初始化 recorder 模块

  stop: 关闭 LisMocker
