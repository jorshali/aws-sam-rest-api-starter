import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { CreateHandler, DeleteHandler, FindByIdHandler, FindHandler, UpdateHandler } from './RESTHandler';
import { RESTMinimalEvent } from './RESTMinimalEvent';
import { CreateRoute, DeleteRoute, FindByIdRoute, FindRoute, RESTRoute, UpdateRoute } from './RESTRoute';

export class RESTRouter<T> {
  private routes: RESTRoute<T>[];
  private customRoutes: RESTRoute<T>[];

  constructor(private basePath: string) {
    this.routes = [];
    this.customRoutes = [];
  }

  onCreate(handler: CreateHandler<T>) {
    this.routes.push(new CreateRoute(this.basePath, handler));

    return this;
  }

  onFind(handler: FindHandler<T>) {
    this.routes.push(new FindRoute(this.basePath, handler));

    return this;
  }

  onFindById(handler: FindByIdHandler<T>) {
    this.routes.push(new FindByIdRoute(`${this.basePath}/:id`, handler));

    return this;
  }

  onUpdate(handler: UpdateHandler<T>) {
    this.routes.push(new UpdateRoute(`${this.basePath}/:id`, handler));

    return this;
  }

  onDelete(handler: DeleteHandler<T>) {
    this.routes.push(new DeleteRoute(`${this.basePath}/:id`, handler));

    return this;
  }
  
  onCustomRoute(restRoute: RESTRoute<T>) {
    this.routes.push(restRoute);

    return this;
  }

  calculateRoute(event: RESTMinimalEvent) {
    if (this.customRoutes.length > 0) {
      const customRoute = this.customRoutes.find((route) => {
        return route.isMatch(event);
      });

      if (customRoute) {
        return customRoute;
      }
    }

    return this.routes.find((route) => {
      return route.isMatch(event);
    });
  }

  async handleRequest(event: RESTMinimalEvent) {
    const route = this.calculateRoute(event);

    if (route) {
      const result = await route.handle(event) || {};

      result.headers = result.headers || {};
      // add CORS headers
      result.headers['Content-Type'] = 'application/json';
      result.headers['Access-Control-Allow-Origin'] = '*';

      return result;
    }

    return {
      statusCode: StatusCodes.FORBIDDEN,
      body: getReasonPhrase(StatusCodes.FORBIDDEN)
    };
  }
}