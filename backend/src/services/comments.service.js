// src/services/comments.service.js
import db from "../../models/index.js";
import redisClient from "../controller/redisClient.js";
import NotFoundError from "../errors/not-found.js";

const { Comments, Posts } = db;

/**
 * Ambil semua komentar berdasarkan postId
 */
export const getCommentsByPostId = async (reqDto) => {
  const cacheKey = `comments:${reqDto.postId}`;

  // cek cache dulu
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // ambil dari database
  const comments = await Comments.findAll({
    where: { postId: reqDto.postId },
  });

  // kalau ga ada komentar
  if (!comments || comments.length === 0) {
    const error = new Error("Komentar tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  // simpan ke cache
  await redisClient.setEx(cacheKey, 60, JSON.stringify(comments));
  return comments;
};

/**
 * Tambah komentar baru pada post
 */
export const addComment = async (reqDto) => {
  // validasi apakah post ada
  const post = await Posts.findByPk(reqDto.postId);
  if (!post) {
    const error = new Error("Post tidak ditemukan, tidak bisa memberi komentar");
    error.statusCode = 404;
    throw error;
  }

  const newComment = await Comments.create({
    commentBody: reqDto.commentBody,
    postId: reqDto.postId,
    username: reqDto.username,
    userId: reqDto.userId,
  });

  if (!newComment) {
    const error = new Error("Gagal membuat komentar");
    error.statusCode = 500;
    throw error;
  }

  // hapus cache supaya data baru muncul
  await redisClient.del(`comments:${reqDto.postId}`);

  return newComment;
};

/**
 * update komentar berdasarkan id
 */
export const updateComment = async (reqDto)  => {
    const comment = await Comments.findByPk(reqDto.commentId)
    console.log(typeof reqDto.commentId, reqDto.commentId);
    if(!comment) {
    throw new NotFoundError('comment not found');
    }
    if (comment.userId !== reqDto.userId) {
      throw new NotFoundError('not allow edit this comment')
  }
  // update body komentar
  comment.commentBody = reqDto.commentBody || comment.commentBody;
  await comment.save();

  // hapus cache biar nanti get ambil data baru
  await redisClient.del(`comments:${comment.postId}`);

  return comment;
};


/**
 * Hapus komentar berdasarkan ID
 */
export const deleteComment = async (reqDto) => {
  const comment = await Comments.findByPk(reqDto.commentId);
  if (!comment) {
    const error = new Error("Komentar tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  await Comments.destroy({ where: { id: reqDto.commentId } });
  await redisClient.del(`comments:${comment.postId}`);

  return true;
};
