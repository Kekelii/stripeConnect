import type { Request, Response, NextFunction, RequestHandler } from 'express';

interface RequestWithUserId extends Request {
	userId: string;
}
const addUserId: RequestHandler = (req, res, next) => {
	(req as RequestWithUserId).userId = '68d4a203177e0c284c4dd7df';
	next();
};

export default addUserId;
