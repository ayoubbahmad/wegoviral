import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const protect = async (req: any, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'You are not logged in. Please log in to get access.' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        // Attach user ID to request
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token or token expired.' });
    }
};
