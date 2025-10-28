import type { Request, Response, NextFunction, RequestHandler } from 'express';
export declare const asyncHandler: <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<any>) => RequestHandler<P, ResBody, ReqBody, ReqQuery>;
//# sourceMappingURL=asyncHander.d.ts.map