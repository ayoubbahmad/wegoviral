import { Router } from 'express';
import * as feedController from './controller';
import { protect, requireCanInteract } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

// Muted members can read, bookmark and delete their own content, but not interact

router.get('/spaces', feedController.listSpaces);

router.get('/posts', feedController.listPosts);
router.get('/posts/top', feedController.listTopPosts);
router.post('/posts', requireCanInteract, feedController.createPost);
router.delete('/posts/:id', feedController.deletePost);
router.patch('/posts/:id/pin', feedController.pinPost);

router.put('/posts/:id/like', requireCanInteract, feedController.likePost);
router.delete('/posts/:id/like', requireCanInteract, feedController.unlikePost);
router.put('/posts/:id/bookmark', feedController.bookmarkPost);
router.delete('/posts/:id/bookmark', feedController.unbookmarkPost);
router.post('/posts/:id/vote', requireCanInteract, feedController.votePoll);

router.get('/posts/:id/comments', feedController.listComments);
router.post('/posts/:id/comments', requireCanInteract, feedController.createComment);
router.delete('/comments/:id', feedController.deleteComment);

router.post('/uploads', requireCanInteract, feedController.createUpload);

export default router;
