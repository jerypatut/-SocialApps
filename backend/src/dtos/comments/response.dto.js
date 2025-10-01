// src/dtos/comments.res.dto.js
export class CommentResDto {
  constructor(comments) {
    this.success = true;
    this.count = comments.length || 0;
    this.data = comments;
  }
}

export class SingleCommentResDto {
  constructor(comment) {
    this.success = true;
    this.data = comment;
  }
}

export class UpdateCommentResDto {
  constructor(comment) {
    Object.assign(this, comment); // semua field comment langsung di root
  }
}
export class DeleteCommentResDto {
  constructor(message = 'DELETED SUCCESSFULLY') {
    this.success = true;
    this.message = message;
  }
}
