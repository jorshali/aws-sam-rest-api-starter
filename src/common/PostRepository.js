const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const Post = require('./Post');

const TableName = 'POST';
const SlugIndex = 'SlugIndex';

class PostRepository {
  constructor(context) {
    this.context = context;
  }

  findPostBySlug = async (slug) => {
    const postResults = await dynamo.query({
      TableName,
      IndexName: SlugIndex,
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
          ":slug": slug
      }
    }).promise();
    
    if (!postResults.Items || postResults.Items.length === 0) {
      return [];
    } else {
      const postsData = postResults.Items;
      
      return postsData.map((postData) => new Post(postData)).reverse();
    }
  }

  savePost = async (post) => {
    await dynamo.put({
      TableName,
      Item: post
    }).promise();
  };
}

module.exports = PostRepository;