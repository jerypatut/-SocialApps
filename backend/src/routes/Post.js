import express from 'express';
const router = express.Router();
import {
    getAllPosts,
    getPostById,
    createPost, 
    deletePost
} from '../controller/post.controller.js';
import validateToken from '../middlewares/AuthMiddleware.js';

// GET all posts
router.get('/', validateToken, getAllPosts);

// GET post by ID
router.get('/:id', validateToken,getPostById);

// CREATE post
router.post('/', validateToken,createPost);

// DELETE post
router.delete('/:id', validateToken, deletePost);

export default router;
