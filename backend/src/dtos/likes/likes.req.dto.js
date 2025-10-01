export class ToggleLikeReqDto {
  constructor({ postId, userId }) {
    this.postId = postId;
    this.userId = userId;
  }

  static fromRequest(req) {
    return new ToggleLikeReqDto({
      postId: req.body?.postId,
      userId: req.user?.id,
    });
  }
}
