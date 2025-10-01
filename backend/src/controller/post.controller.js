import { StatusCodes } from 'http-status-codes';
import * as PostService from '../services/posts.service.js';
import { sendResponse } from '../helpers/sendResponse.js';
import {
  GetAllPostsReqDto,
  GetPostByIdReqDto,
  CreatePostReqDto,
  DeletePostReqDto,
} from '../dtos/post/posts.req.dto.js';
import {
  PostsResDto,
  SinglePostResDto,
  DeletePostResDto,
} from '../dtos/post/posts.res.dto.js';
import upload from '../upload/multer.js';

// ==================================================
// Get All Posts
// ==================================================
export const getAllPosts = async (req, res, next) => {
  try {
    const reqDto = GetAllPostsReqDto.fromRequest(req);
    const result = await PostService.getAllPosts(reqDto);
    const resDto = new PostsResDto(result);
    return sendResponse(res, StatusCodes.OK,true, "get all data posts", resDto);
  } catch (error) {
    next(error);
  }
};

// ==================================================
// Get Post By Id
// ==================================================
export const getPostById = async (req, res, next) => {
  try {
    const reqDto = GetPostByIdReqDto.fromRequest(req);
    const result = await PostService.getOnePost(reqDto);
    const resDto = new SinglePostResDto(result);
return sendResponse(res, StatusCodes.OK,true, "get one post oke", resDto);
  } catch (error) {
    next(error);
  }
};

// ==================================================
// Create Post
// ==================================================
export const createPost = async (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return next(err);
    try {
      const reqDto = await CreatePostReqDto.fromRequest(req);
      const result = await PostService.createPost(reqDto);
      const resDto = new SinglePostResDto(result);
      return sendResponse(res, StatusCodes.CREATED,true, "kreate posts successfully", resDto);
    } catch (error) {
      next(error);
    }
  });
};

// ==================================================
// Delete Post
// ==================================================
export const deletePost = async (req, res, next) => {
  try {
    const reqDto = DeletePostReqDto.fromRequest(req);
    await PostService.deletePost(reqDto);
    const resDto = new DeletePostResDto();
    return sendResponse(res, StatusCodes.OK,true, "delete post oke!", resDto);
  } catch (error) {
    next(error);
  }
};
