import { Request, Response } from 'express';
import { authService } from './service';
import { permissionsFor } from '../../lib/permissions';
import { getSettings } from '../../lib/settings';
import { prisma } from '../../lib/prisma';

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await authService.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User no longer exists' });
        }

        const { status, statusReason, statusUntil, onboarding: step } = req.user;
        const [settings, joining] = await Promise.all([
            getSettings(),
            prisma.userProfile.findUniqueOrThrow({
                where: { id: req.user.id },
                select: {
                    joinStatus: true,
                    specialMember: true,
                    rulesAcceptedVersion: true,
                    application: { select: { reviewNote: true } },
                },
            }),
        ]);
        res.status(200).json({
            status: 'success',
            user: {
                ...user,
                // Effective values: expired restrictions already count as lifted
                status,
                statusReason,
                statusUntil,
                permissions: permissionsFor(user.role),
                onboarding: {
                    step,
                    joinStatus: joining.joinStatus,
                    specialMember: joining.specialMember,
                    guideVersion: settings.guideVersion,
                    rulesAcceptedVersion: joining.rulesAcceptedVersion,
                    // Shown to applicants who weren't approved
                    rejectionNote: joining.joinStatus === 'REJECTED' ? joining.application?.reviewNote ?? null : null,
                },
            },
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
