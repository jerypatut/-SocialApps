import { StatusCodes } from 'http-status-codes';
import * as LikesService from '../services/like.service.js';
import { ToggleLikeReqDto } from '../dtos/likes/likes.req.dto.js';
import { ToggleLikeResDto } from '../dtos/likes/like.res.dto.js';
import { sendResponse } from '../helpers/sendResponse.js';
export const toggleLike = async (req, res, next) => {
  try {
    const reqDto = ToggleLikeReqDto.fromRequest(req);
    const result = await LikesService.toggleLike(reqDto);
    const resDto = new ToggleLikeResDto(result);
    return sendResponse(res, StatusCodes.OK,true, "like", resDto);
  } catch (error) {
   next(error);
  }
};
