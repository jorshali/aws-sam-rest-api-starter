class Post {
  constructor(data) {
    console.log(data);
    
    this.postId = data.postId;
    this.slug = data.slug;
    this.createDate = data.createDate;
    this.title = data.title;
    this.description = data.content;
  }
}

module.exports = Post;