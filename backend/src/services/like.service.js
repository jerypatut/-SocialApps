import db from '../../models/index.js';
import redisClient from '../controller/redisClient.js';
import { BadRequestError, UnauthorizedError } from '../errors/index.js';

const { Likes } = db;

export const toggleLike = async (reqDto) => {
  if (!reqDto.userId) throw new UnauthorizedError('User not authenticated');
  if (!reqDto.postId) throw new BadRequestError('PostId is required');

  const cacheKey = `postLikes:${reqDto.postId}`;

  // Toggle like/unlike
  const [like, created] = await Likes.findOrCreate({
    where: { postId: reqDto.postId, userId: reqDto.userId },
  });

  if (!created) {
    // Jika sudah like, hapus untuk unlike
    await like.destroy();
  }

  // Hapus cache Redis supaya bisa refresh
  await redisClient.del(cacheKey);

  // Hitung total like terbaru langsung dari database
  const totalLikes = await Likes.count({ where: { postId: reqDto.postId } });

  // Simpan total like ke Redis (misal 60 detik)
  await redisClient.setEx(cacheKey, 30, totalLikes.toString());

  return {
    liked: created,    // status like/unlike user saat ini
    totalLikes,        // jumlah like global
  };
};
