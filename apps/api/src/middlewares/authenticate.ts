import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../features/auth/services';

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				role: 'ADMIN' | 'REGISTRAR';
			};
		}
	}
}

const readCookie = (cookieHeader: string | undefined, cookieName: string) => {
	if (!cookieHeader) return undefined;

	const match = cookieHeader
		.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${cookieName}=`));

	if (!match) return undefined;

	return decodeURIComponent(match.slice(cookieName.length + 1));
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const bearerToken = req.headers.authorization?.startsWith('Bearer ')
		? req.headers.authorization.slice(7)
		: undefined;
	const cookieToken = readCookie(req.headers.cookie, 'lm_auth_token');
	const token = bearerToken ?? cookieToken;

	if (!token) {
		res.status(401).json({ success: false, error: 'Unauthorized' });
		return;
	}

	const payload = verifyToken(token);

	if (!payload) {
		res.status(401).json({ success: false, error: 'Unauthorized' });
		return;
	}

	req.user = {
		id: payload.id,
		email: payload.email,
		role: payload.role,
	};

	next();
};
