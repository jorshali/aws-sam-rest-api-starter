import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Post } from './common/Post';
import { PostRepository } from './common/PostRepository';
import { RESTRouter } from './common/RESTRouter';
import { Utility } from './common/Utility';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  console.log(event.httpMethod);
  console.log(event.path);

  const user = await Utility.currentUser(event, {
    useEmail: true
  });

  if (user.account.system !== 'rest-api-starter') {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      body: getReasonPhrase(StatusCodes.FORBIDDEN)
    };
  }

  const postRepository = new PostRepository();

  const router = new RESTRouter<Post>('/post-service')
    .onFind(async (e) => {
      return await postRepository.findAll();
    })
    .onFindById(async (e, id) => {
      return await postRepository.findPostById(id);
    });

  return router.handleRequest(event);
};
