// src/controllers/comments.controller.js
import * as CommentService from '../services/comments.service.js';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../helpers/sendResponse.js';
import { 
  NotFoundError,
  BadRequestError,
} from '../errors/index.js';

import {
  GetCommentsReqDto,
  AddCommentReqDto,
  DeleteCommentReqDto,
  UpdateCommentReqDto
} from '../dtos/comments/request.dto.js';

import {
  CommentResDto,
  SingleCommentResDto,
  DeleteCommentResDto,
  UpdateCommentResDto
} from '../dtos/comments/response.dto.js';

// ===================== Get Comments =====================
export const getOneComment = async (req, res, next) => {
  try {
    const reqDto = GetCommentsReqDto.fromRequest(req);
    const result = await CommentService.getCommentsByPostId(reqDto);
    const resDto = new CommentResDto(result);
    return sendResponse(res, StatusCodes.OK, true, "get one comment ", resDto);
  } catch (error) {
    next(error);
  }
};

// ===================== Add Comment =====================
export const postAddComment = async (req, res, next) => {
  try {
    const reqDto = AddCommentReqDto.fromRequest(req);
    if (!reqDto.username || !reqDto.postId) {
      throw new BadRequestError('Missing required fields: username or postId');
    }
    const result = await CommentService.addComment(reqDto);
    const resDto = new SingleCommentResDto(result);
    return sendResponse(res, StatusCodes.CREATED, true, "Comment added successfully", resDto);
  } catch (error) {
    next(error);
  }
};
// ===================== update Comment =====================
export const updateComment = async (req, res, next) => {
  try {
    const reqDto  = UpdateCommentReqDto.fromRequest(req);
    const result  = await CommentService.updateComment(reqDto);
    if (!result) {
      throw new NotFoundError('Comment not found');
    }
      const resDto = new UpdateCommentResDto(result);
     return sendResponse(res, StatusCodes.OK,true, "Comment updated successfully", resDto);
    } catch (error) {
    next(error);
  }
};

// ===================== Delete Comment =====================
export const deleteComment = async (req, res, next) => {
  try {
    const reqDto = DeleteCommentReqDto.fromRequest(req);
    const result = await CommentService.deleteComment(reqDto);

    if (!result) {
      throw new NotFoundError('Comment not found');
    }
    const resDto = new DeleteCommentResDto();
    return sendResponse(res, StatusCodes.OK,true, "Comment delete successfully", resDto);
  } catch (error) {
    next(error);
  }
};
