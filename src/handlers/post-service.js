const { currentUser } = require('../common/Utility');
const { PostRepository } = require('../common/PostRepository');
const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  let body;
  let statusCode = StatusCodes.OK;
  
  const headers = defaultHeaders();

  try {
    const user = await currentUser(event, context, {
      useEmail: true
    });

    if (user.account.system !== 'rest-api-starter') {
      statusCode = StatusCodes.FORBIDDEN;
      throw new Error('Not Authorized');
    }

    const postRepository = new PostRepository(context);

    switch (event.httpMethod) {
      case 'GET':
        const slug = event.queryStringParameters.postSlug;

        if (!slug) {
          statusCode = StatusCodes.BAD_REQUEST;
          throw new Error('A post slug must be provided');
        }

        const post = await postRepository.findPostBySlug(slug);

        body = post;

        break;
      case 'PUT':
        // TODO implement this

        break;
      case 'POST':
        // TODO implement this
        
        break;
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = statusCode != StatusCodes.OK ? statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
    
    console.error(err);

    body = {
      result: 'FAILURE',
      message: err.message
    }
  } finally {
    body = JSON.stringify(body);
  }

  console.log('sending response');
  console.log(statusCode);

  return {
    statusCode,
    body,
    headers,
  };
};
