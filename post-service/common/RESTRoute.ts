import { APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { CreateHandler, DeleteHandler, FindByIdHandler, FindHandler, RESTHandler, UpdateHandler } from './RESTHandler';
import { RESTMinimalEvent } from './RESTMinimalEvent';

const { match } = require('node-match-path')

export abstract class RESTRoute<T> {
  constructor(private httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE', private path: string) {
  }

  isMatch(event: RESTMinimalEvent) {
    return (this.httpMethod.toUpperCase() === event.httpMethod.toUpperCase() && match(this.path, event.path).matches);
  }
  
  getParams(url: string) {
    return match(this.path, url).params || {};
  }

  async handleRequestWithBody(event: RESTMinimalEvent, callback: (obj: T) => Promise<APIGatewayProxyResult>) {
    try {
      if (!event.body) {
        return this.errorResponse(StatusCodes.BAD_REQUEST);
      } else {
        return await callback(JSON.parse(event.body));
      }
    } catch(e) {
      console.error(e);
      return this.errorResponse(StatusCodes.BAD_REQUEST);
    }
  }

  okResponse(result: any) {
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(result)
    };
  }

  errorResponse(statusCode: StatusCodes) {
    return {
      statusCode,
      body: getReasonPhrase(statusCode)
    };
  }

  async handle(event: RESTMinimalEvent): Promise<APIGatewayProxyResult> {
    try {
      const result = await this.handleImpl(event);

      return result;
    } catch (e) {
      console.error(e);

      return this.errorResponse(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  abstract handleImpl(event: RESTMinimalEvent): Promise<APIGatewayProxyResult>;
}

export class CreateRoute<T> extends RESTRoute<T> {
  constructor(path: string, private handler: CreateHandler<T>) {
    super('POST', path);
  }

  async handleImpl(event: RESTMinimalEvent): Promise<APIGatewayProxyResult> {
    return await this.handleRequestWithBody(event, async (obj) => {
      const result = await this.handler(event, obj);

      return this.okResponse(result);
    });
  }
}

export class FindRoute<T> extends RESTRoute<T> {
  constructor(path: string, private handler: FindHandler<T>) {
    super('GET', path);
  }

  async handleImpl(event: RESTMinimalEvent): Promise<APIGatewayProxyResult> {
    const result = await this.handler(event);

    return this.okResponse(result);
  }
}

export class FindByIdRoute<T> extends RESTRoute<T> {
  constructor(path: string, private handler: FindByIdHandler<T>) {
    super('GET', path);
  }

  async handleImpl(event: RESTMinimalEvent): Promise<APIGatewayProxyResult> {
    const id = this.getParams(event.path).id;
    const result = await this.handler(event, id);

    if (!result) {
      return this.errorResponse(StatusCodes.NOT_FOUND);
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(result)
    }
  }
}

export class UpdateRoute<T> extends RESTRoute<T> {
  constructor(path: string, private handler: UpdateHandler<T>) {
    super('PUT', path);
  }

  async handleImpl(event: RESTMinimalEvent): Promise<APIGatewayProxyResult> {
    const id = this.getParams(event.path).id;

    return await this.handleRequestWithBody(event, async (obj) => {
      const result = await this.handler(event, id, obj);

      return this.okResponse(result);
    });
  }
}

export class DeleteRoute<T> extends RESTRoute<T> {
  constructor(path: string, private handler: DeleteHandler<T>) {
    super('DELETE', path);
  }

  async handleImpl(event: RESTMinimalEvent): Promise<APIGatewayProxyResult> {
    const result = await this.handler(event, this.getParams(event.path).id);

    return this.okResponse(result);
  }
}

export class CustomRoute<T> extends RESTRoute<T> {
  constructor(httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, private handler: RESTHandler) {
    super(httpMethod, path);
  }

  async handleImpl(event: RESTMinimalEvent): Promise<APIGatewayProxyResult> {
    return await this.handler(event, this.getParams(event.path), event.body || '');
  }
}