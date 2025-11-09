import { NextFunction, Request, Response } from "express";

export function dummyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  (req as any).user = { id: "local-dev", name: "Dev User" };
  console.log(`[dummyMiddleware] ${req.method} ${req.path} user=local-dev`);
  next();
}
