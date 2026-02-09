import { Router } from 'express';
import * as libraryController from './controller';

const router = Router();

router.get('/metadata', libraryController.getMetadata);

export default router;
