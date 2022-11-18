import { describe, expect, beforeEach, test, jest } from '@jest/globals';
import { CreateHandler, FindByIdHandler, FindHandler, RESTHandler } from './RESTHandler';
import { CreateRoute, FindByIdRoute, FindRoute, RESTRoute } from './RESTRoute';
import { Post } from './Post';

describe('Route module', () => {
  const findHandler = jest.fn<FindHandler<Post>>();
  const findByIdHandler = jest.fn<FindByIdHandler<Post>>();
  const createHandler = jest.fn<CreateHandler<Post>>();

  beforeEach(() => {

  });

  test("parses a route to get params", () => {
    const route = new FindByIdRoute('/employee/:id', findByIdHandler);
    const params = route.getParams('/employee/22');

    expect(params.id).toBe('22');
  });

  test("parses a route to get params but none found", () => {
    const route = new FindRoute('/employee', findHandler);
    const params = route.getParams('/employee/22');

    expect(params.id).toBeFalsy();
  });

  test("is a match", () => {
    const route = new CreateRoute('/employee/:id', createHandler);

    const isMatch = route.isMatch({
      httpMethod: 'POST',
      path: '/employee/22',
      body: ''
    });

    expect(isMatch).toBeTruthy();
  });

  test("is not a match", () => {
    const route = new FindByIdRoute('/:id', findByIdHandler);

    const isMatch = route.isMatch({
      httpMethod: 'GET',
      path: '/employee/22',
      body: ''
    });

    expect(isMatch).toBeFalsy();
  });
});