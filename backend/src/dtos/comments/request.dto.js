// src/dtos/comments.req.dto.js
export class GetCommentsReqDto {
  constructor(postId) {
    this.postId = postId;
  }
  static fromRequest(req) {
    return new GetCommentsReqDto(req.params.postId);
  }
}
// src/dtos/comments.req.dto.js
export class AddCommentReqDto {
  constructor({ commentBody, postId, username, userId }) {
    this.commentBody = commentBody;
    this.postId = postId;
    this.username = username;
    this.userId = userId; // ✅ tambahkan userId
  }

  static fromRequest(req) {
    return new AddCommentReqDto({
      commentBody: req.body.commentBody,
      postId: req.body.postId,
      username: req.user?.username, // bisa ambil dari JWT
      userId: req.user?.id,          // ✅ ambil dari user session/JWT
    });
  }
}


// UPDATE komentar
export class UpdateCommentReqDto {
  constructor({ commentId, commentBody, userId, username }) {
    this.commentId = commentId;
    this.commentBody = commentBody;
    this.userId = userId;
    this.username = username;
  }

  static fromRequest(req) {
    return new UpdateCommentReqDto({
      commentId: req.params.id,
      commentBody: req.body.commentBody,
      userId: req.user?.id,
      username: req.user?.username,
    });
  }
}

export class DeleteCommentReqDto {
  constructor(commentId) {
    this.commentId = commentId;
  }

static fromRequest(req) {
    return new DeleteCommentReqDto(req.params.commentId);
  }
}
