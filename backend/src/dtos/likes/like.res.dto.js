export class ToggleLikeResDto {
  constructor({ liked, totalLikes }) {
    this.liked = liked;
    this.totalLikes = totalLikes;
  }
}
