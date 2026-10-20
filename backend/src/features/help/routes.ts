import { Router } from 'express';
import * as helpController from './controller';
import { protectAllowRestricted } from '../../middleware/auth.middleware';

// Readable by every signed-in member, even restricted ones (that's when help matters most)
const router = Router();

router.use(protectAllowRestricted);

router.get('/articles', helpController.listArticles);
router.get('/articles/:slug', helpController.getArticle);

// Admins (checked in the service)
router.get('/manage', helpController.listAllArticles);
router.post('/manage', helpController.createArticle);
router.put('/manage/order', helpController.reorderArticles);
router.patch('/manage/:id', helpController.updateArticle);
router.delete('/manage/:id', helpController.deleteArticle);

export default router;
