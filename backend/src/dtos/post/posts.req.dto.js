export class GetAllPostsReqDto {
  constructor({ userId }) {
    this.userId = userId;
  }

  static fromRequest(req) {
    return new GetAllPostsReqDto({ userId: req.user?.id || req.user?.userId });
  }
}

export class GetPostByIdReqDto {
  constructor({ id }) {
    this.id = id;
  }

  static fromRequest(req) {
    return new GetPostByIdReqDto({ id: req.params.id });
  }
}

export class CreatePostReqDto {
  constructor({ title, postText, image, username, userId }) {
    this.title = title;
    this.postText = postText;
    this.image = image;
    this.username = username;
    this.userId = userId
  }

  static async fromRequest(req) {
    const { title, postText } = req.body;
    const userId = req.user?.id;
    const username = req.user?.username;
    const image = req.file ? `/assets/${req.file.filename}` : null;

    return new CreatePostReqDto({ title, postText, image, username, userId });
  }
}

export class DeletePostReqDto {
  constructor({ id }) {
    this.id= id;
  }

  static fromRequest(req) {
    return new DeletePostReqDto({ id: req.params.id});
  }
}
