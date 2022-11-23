import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { RequestContext } from "generic-rest-api-router";

export class AwsRequestContext implements RequestContext {
  constructor(private event: APIGatewayProxyEvent, private context: Context) {
  }

  getHttpMethod(): string {
    return this.event.httpMethod;
  }

  getPath(): string {
    return this.event.path;
  }
  
  getBody(): string {
    return this.event.body || '';
  }
}