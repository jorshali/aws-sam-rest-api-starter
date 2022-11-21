import { APIGatewayProxyResult } from "aws-lambda";
import { FunctionRouter } from "simple-rest-api-router";
import { AwsRequestContext } from "./AwsRequestContext";
import { Post } from "./Post";

export class AwsFunctionRouter extends FunctionRouter<Post, AwsRequestContext> {
  async handle(requestContext: AwsRequestContext): Promise<APIGatewayProxyResult> {
    const response = await super.handleRequest(requestContext);

    console.log(response.headers);
    
    return {
      headers: response.headers,
      statusCode: response.statusCode,
      body: response.body || ''
    }
  }
}