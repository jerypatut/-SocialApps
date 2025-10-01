import express from 'express';
const router = express.Router();
import   { toggleLike }  from '../controller/likes.controller.js';
import  validateToken from '../middlewares/AuthMiddleware.js';

router.post('/', validateToken, toggleLike);

export default router;
