import { DynamoDB } from 'aws-sdk';
import { Post } from './Post';

const dynamo = new DynamoDB.DocumentClient();

const TableName = 'POST';
const SlugIndex = 'PostSlugIndex';

export class PostRepository {
  findAll = async () => {
    const postResults = await dynamo.scan({
      TableName
    }).promise();
    
    console.log(postResults);
    
    if (!postResults.Items || postResults.Items.length === 0) {
      return [];
    } else {
      const postsData = postResults.Items;
      
      return postsData.map((postData) => new Post(postData)).reverse();
    }
  }

  findPostById = async (id: string) => {
    const postResults = await dynamo.query({
      TableName,
      KeyConditionExpression: "postId = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }).promise();
    
    console.log(postResults);
    
    if (!postResults.Items || postResults.Items.length === 0) {
      return undefined;
    } else {
      return new Post(postResults.Items[0]);
    }
  };

  findPostBySlug = async (slug: string) => {
    const postResults = await dynamo.query({
      TableName,
      IndexName: SlugIndex,
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
          ":slug": slug
      }
    }).promise();
    
    console.log(postResults);
    
    if (!postResults.Items || postResults.Items.length === 0) {
      return [];
    } else {
      const postsData = postResults.Items;
      
      return postsData.map((postData) => new Post(postData)).reverse();
    }
  };

  savePost = async (post: Post) => {
    await dynamo.put({
      TableName,
      Item: post
    }).promise();
  };
}