import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { AwsFunctionRouter } from './common/AwsFunctionRouter';
import { AwsRequestContext } from './common/AwsRequestContext';
import { PostRepository } from './common/PostRepository';
import { Utility } from './common/Utility';

const router = new AwsFunctionRouter({
    basePath: '/post-service',
    includeCORS: true
  })
  .get('', async (route) => {
    const postRepository = new PostRepository();

    return route.okResponse(await postRepository.findAll());
  })
  .get('/:id', async (route, requestContext) => {
    const postRepository = new PostRepository();

    const id = route.getPathParams(requestContext).id;
    const post = await postRepository.findPostById(id);

    if (!post) {
      return route.errorResponse(StatusCodes.NOT_FOUND);
    }

    return route.okResponse(post);
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
