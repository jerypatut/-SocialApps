import express from 'express';
const router = express.Router();
import  { getOneComment,postAddComment,deleteComment, updateComment } from '../controller/comments.controller.js';
import  validateToken from '../middlewares/AuthMiddleware.js';


router.get('/:postId',validateToken,getOneComment);
router.post('/', validateToken, postAddComment);
router.delete('/:commentId', validateToken,deleteComment);
router.put('/:id', validateToken,updateComment)

export default router;