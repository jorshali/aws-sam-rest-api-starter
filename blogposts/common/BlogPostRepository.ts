import { DynamoDB } from 'aws-sdk';
import { BlogPost } from './BlogPost';

const dynamo = new DynamoDB.DocumentClient();

const TableName = 'BLOG_POST';
const SlugIndex = 'PostSlugIndex';

export class BlogPostRepository {
  findAll = async () => {
    const postResults = await dynamo.scan({
      TableName
    }).promise();
    
    console.log(postResults);
    
    if (!postResults.Items || postResults.Items.length === 0) {
      return [];
    } else {
      const postsData = postResults.Items;
      
      return postsData.map((postData) => new BlogPost(postData)).reverse();
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
      return new BlogPost(postResults.Items[0]);
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
      
      return postsData.map((postData) => new BlogPost(postData)).reverse();
    }
  };

  savePost = async (post: BlogPost) => {
    return await dynamo.put({
      TableName,
      Item: post
    }).promise();
  };

  deletePost = async (id: string) => {
    return await dynamo.delete({ 
      TableName,
      Key: { postId: id }
    });
  }
}