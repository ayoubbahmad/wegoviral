import { Router } from 'express';
import * as feedController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/spaces', feedController.listSpaces);

router.get('/posts', feedController.listPosts);
router.get('/posts/top', feedController.listTopPosts);
router.post('/posts', feedController.createPost);
router.delete('/posts/:id', feedController.deletePost);
router.patch('/posts/:id/pin', feedController.pinPost);

router.put('/posts/:id/like', feedController.likePost);
router.delete('/posts/:id/like', feedController.unlikePost);
router.put('/posts/:id/bookmark', feedController.bookmarkPost);
router.delete('/posts/:id/bookmark', feedController.unbookmarkPost);
router.post('/posts/:id/vote', feedController.votePoll);

router.get('/posts/:id/comments', feedController.listComments);
router.post('/posts/:id/comments', feedController.createComment);
router.delete('/comments/:id', feedController.deleteComment);

router.post('/uploads', feedController.createUpload);

export default router;
