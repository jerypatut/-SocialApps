import db from '../../models/index.js';
import redisClient from '../controller/redisClient.js';
import { BadRequestError, UnauthorizedError } from '../errors/index.js';

const { Likes, sequelize } = db;

/**
 * Toggle like/unlike sebuah post per user
 * @param {Object} reqDto
 * @param {string|number} reqDto.userId - diambil dari token auth
 * @param {string|number} reqDto.postId - id post yang ingin di-like/unlike
 * @returns {Object} { liked: boolean, totalLikes: number }
 */

export const toggleLike = async (reqDto) => {
  if (!reqDto.userId) throw new UnauthorizedError('User not authenticated');
  if (!reqDto.postId) throw new BadRequestError('PostId is required');

  const cacheKey = `postLikes:${reqDto.postId}`;
  let liked = false;
  let totalLikes = 0;

  await sequelize.transaction(async (t) => {
    const existingLike = await Likes.findOne({
      where: { postId: reqDto.postId, userId: reqDto.userId },
      transaction: t,
    });

    if (existingLike) {
      await existingLike.destroy({ transaction: t });
      liked = false;
      console.log(`User ${reqDto.userId} UNLIKED post ${reqDto.postId}`);
    } else {
      await Likes.create({ postId: reqDto.postId, userId: reqDto.userId }, { transaction: t });
      liked = true;
      console.log(`User ${reqDto.userId} LIKED post ${reqDto.postId}`);
    }

    totalLikes = await Likes.count({ where: { postId: reqDto.postId }, transaction: t });
  });

  await redisClient.setEx(cacheKey, 30, totalLikes.toString());

  // 🔥 Tambahkan ini supaya cache getAllPosts dibersihkan
  const pattern = `getAllPosts:*`;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await Promise.all(keys.map((key) => redisClient.del(key)));
    console.log('🧹 Cache getAllPosts cleared after like/unlike');
  }

  return { liked, totalLikes };
};