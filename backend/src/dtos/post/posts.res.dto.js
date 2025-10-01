export class PostsResDto {
  constructor({ listOfPosts, likedPosts }) {
    this.listOfPosts = listOfPosts;
    this.likedPosts = likedPosts;
  }
}

export class SinglePostResDto {
  constructor(post) {
    this.post = post;
  }
}

export class DeletePostResDto {
  constructor() {
    this.message = 'DELETED SUCCESSFULLY';
  }
}
