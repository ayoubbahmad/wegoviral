import { Request, Response } from 'express';
import { authService } from './service';

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await authService.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User no longer exists' });
        }

        res.status(200).json({
            status: 'success',
            user
        });
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ error: 'Failed to get user details' });
    }
};

export const checkUsername = async (req: Request, res: Response) => {
    try {
        const username = String(req.query.username || '').toLowerCase();

        if (!authService.isValidUsername(username)) {
            return res.status(200).json({
                available: false,
                reason: 'Use 3-30 lowercase letters, numbers or underscores',
            });
        }

        const available = await authService.isUsernameAvailable(username);
        res.status(200).json({
            available,
            reason: available ? undefined : 'This username is already taken',
        });
    } catch (error) {
        console.error('Check Username Error:', error);
        res.status(500).json({ error: 'Failed to check username' });
    }
};
