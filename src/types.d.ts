import { Send } from "express";

declare global {
  namespace Express {
    export interface Response {
      proxySend?: Send<ResBody, this>;
    }
  }
}

export {};
