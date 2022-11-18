export class Post {
  postId: string;
  slug: string;
  createDate: number;
  title: string;
  content: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}