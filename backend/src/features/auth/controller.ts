import { Request, Response } from 'express';
import { authService } from './service';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, name } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Please provide email, password and username' });
        }

        const isTaken = await authService.isEmailOrUsernameTaken(email, username);
        if (isTaken) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        const result = await authService.registerUser({ email, password, username, name });

        res.status(201).json({
            status: 'success',
            ...result
        });
    } catch (error: any) {
        console.error('Register Error:', error);
        res.status(500).json({
            error: 'Failed to register user',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const result = await authService.loginUser(email, password);

        if (!result) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error: any) {
        console.error('Login Error:', error);
        res.status(500).json({
            error: 'Failed to login',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

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
