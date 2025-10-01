import db from '../../models/index.js';
import redisClient from '../controller/redisClient.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/index.js';

const { sequelize, Posts, Likes } = db;


// =======================
// GET ALL POSTS
// =======================
export const getAllPosts = async (reqDto) => {
  if (!reqDto.userId) throw new UnauthorizedError('User not authenticated');
  const cacheKey = `getAllPosts:${reqDto.userId}`;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) return JSON.parse(cachedData);

  // Ambil semua post beserta totalLikes
  const listOfPosts = await Posts.findAll({
    attributes: {
      include: [[sequelize.fn('COUNT', sequelize.col('Likes.id')), 'totalLikes']],
    },
    include: [{ model: Likes, attributes: [] }],
    group: ['Posts.id'],
  });

  // Ambil post yang sudah di-like user
  const likedPostsData = await Likes.findAll({ where: { userId: reqDto.userId } });
  const likedPosts = likedPostsData.map(like => like.postId);

  const result = { listOfPosts, likedPosts };

  await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
  return result;
};


// =======================
// GET ONE POST
// =======================
export const getOnePost = async (reqDto) => {
  const post = await Posts.findByPk(reqDto.id);
  if (!post) throw new NotFoundError('Post not found');
  return post;
};

// =======================
// CREATE POST
// =======================
export const createPost = async (reqDto) => {
  console.log('Create post input:', { title:reqDto.title, postText:reqDto.postText, image:reqDto.image, username:reqDto.username, userId:reqDto.userId });

  if (!reqDto.userId || !reqDto.username) throw new UnauthorizedError('User info missing');
  if (!reqDto.title || !reqDto.postText) throw new BadRequestError('Title and postText are required');

  const postData = { title: reqDto.title, postText: reqDto.postText, username: reqDto.username, userId: reqDto.userId };
  if (reqDto.image) postData.image = reqDto.image;

  const newPost = await Posts.create(postData);

  // Hapus cache getAllPosts
  const keys = await redisClient.keys('getAllPosts:*');
  for (const key of keys) {
    await redisClient.del(key);
  }

  return newPost;
};

// =======================
// DELETE POST
// =======================
export const deletePost = async (reqDto) => {
  try {
    const post = await Posts.findByPk(reqDto.id);
    if (!post) throw new NotFoundError('Post not found');

    await post.destroy();

    // Hapus semua cache getAllPosts
    const keys = await redisClient.keys('getAllPosts:*');
    for (const key of keys) {
      await redisClient.del(key);
    }

    return { message: 'Post deleted successfully' };
  } catch (err) {
    console.error('Error in deletePost:', err);
    throw err;
  }
};
