import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { AwsRequestContext, AwsFunctionRouter } from 'aws-rest-api-router';
const { v4: uuidv4 } = require('uuid');

import { BlogPostRepository } from './common/BlogPostRepository';
import { Utility } from './common/Utility';
import { BlogPost } from './common/BlogPost';

const blogPostRepository = new BlogPostRepository();

const router = new AwsFunctionRouter<BlogPost>({
    basePath: '/blogposts',
    includeCORS: true
  })
  .post('', async (route, requestContext) => {
    const blogPost = route.parseBody(requestContext);
    blogPost.postId = uuidv4();

    await blogPostRepository.savePost(blogPost);
    
    return route.okResponse(blogPost);
  })
  .get('', async (route) => {
    return route.okResponse(await blogPostRepository.findAll());
  })
  .get('/:id', async (route, requestContext) => {
    const id = route.getPathParams(requestContext).id;
    const blogPost = await blogPostRepository.findPostById(id);

    if (!blogPost) {
      return route.errorResponse(StatusCodes.NOT_FOUND);
    }

    return route.okResponse(blogPost);
  })
  .put('/:id', async (route, requestContext) => {
    const id = route.getPathParams(requestContext).id;
    const blogPostUpdateDetails = route.parseBody(requestContext);

    const blogPost = await blogPostRepository.findPostById(id);

    if (!blogPost) {
      return route.errorResponse(StatusCodes.NOT_FOUND);
    }

    blogPost.title = blogPostUpdateDetails.title;
    blogPost.content = blogPostUpdateDetails.content;
    blogPost.slug = blogPostUpdateDetails.slug;

    await blogPostRepository.savePost(blogPost);

    return route.okResponse(blogPost);
  })
  .delete('/:id', async (route, requestContext) => {
    const id = route.getPathParams(requestContext).id;
    const blogPost = await blogPostRepository.findPostById(id);

    if (!blogPost) {
      return route.errorResponse(StatusCodes.NOT_FOUND);
    }

    await blogPostRepository.deletePost(id);

    return route.okResponse();
  });

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const user = await Utility.currentUser(event, {
    useEmail: true
  });

  if (user.account.system !== 'rest-api-starter') {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      body: getReasonPhrase(StatusCodes.FORBIDDEN)
    };
  }

  return await router.handle(new AwsRequestContext(event, context));
};
