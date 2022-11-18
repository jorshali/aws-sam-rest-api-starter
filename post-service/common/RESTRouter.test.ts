import { describe, expect, test, beforeEach, jest} from '@jest/globals';
import { RESTRouter } from './RESTRouter';
import { CreateHandler, DeleteHandler, FindByIdHandler, FindHandler, RESTHandler, UpdateHandler } from './RESTHandler';
import { CustomRoute } from './RESTRoute';
import { Post } from './Post';

describe('Crud router module', () => {
  let router: RESTRouter<Post>;

  const body = '{"postId": "1","slug": "my-first-post", "createDate": 1238381727, "title": "My First Post", "content": "This is my first post"}';

  const createHandler = jest.fn<CreateHandler<Post>>();
  const findHandler = jest.fn<FindHandler<Post>>();
  const findByIdHandler = jest.fn<FindByIdHandler<Post>>();
  const updateHandler = jest.fn<UpdateHandler<Post>>();
  const deleteHandler = jest.fn<DeleteHandler<Post>>();
  const customHandler = jest.fn<RESTHandler>();

  beforeEach(() => {
    router = new RESTRouter<Post>('/post-example')
      .onCreate(createHandler)
      .onFind(findHandler)
      .onFindById(findByIdHandler)
      .onUpdate(updateHandler)
      .onDelete(deleteHandler);
  });

  test("handles create", async () => {
    await router.handleRequest({
      httpMethod: 'POST',
      path: '/post-example',
      body
    });

    expect(createHandler.mock.calls.length).toBe(1);
    expect(findHandler.mock.calls.length).toBe(0);
    expect(findByIdHandler.mock.calls.length).toBe(0);
    expect(updateHandler.mock.calls.length).toBe(0);
    expect(deleteHandler.mock.calls.length).toBe(0);
  });

  test("handles find", async () => {
    await router.handleRequest({
      httpMethod: 'GET',
      path: '/post-example',
      body
    });

    expect(createHandler.mock.calls.length).toBe(0);
    expect(findHandler.mock.calls.length).toBe(1);
    expect(findByIdHandler.mock.calls.length).toBe(0);
    expect(updateHandler.mock.calls.length).toBe(0);
    expect(deleteHandler.mock.calls.length).toBe(0);
  });

  test("handles findById", async () => {
    await router.handleRequest({
      httpMethod: 'GET',
      path: '/post-example/1',
      body: null
    });

    expect(createHandler.mock.calls.length).toBe(0);
    expect(findHandler.mock.calls.length).toBe(0);
    expect(findByIdHandler.mock.calls.length).toBe(1);
    expect(updateHandler.mock.calls.length).toBe(0);
    expect(deleteHandler.mock.calls.length).toBe(0);
  });

  test("handles update", async () => {
    await router.handleRequest({
      httpMethod: 'PUT',
      path: '/post-example/1',
      body
    });

    expect(createHandler.mock.calls.length).toBe(0);
    expect(findHandler.mock.calls.length).toBe(0);
    expect(findByIdHandler.mock.calls.length).toBe(0);
    expect(updateHandler.mock.calls.length).toBe(1);
    expect(deleteHandler.mock.calls.length).toBe(0);
  });

  test("handles delete", async () => {
    await router.handleRequest({
      httpMethod: 'DELETE',
      path: '/post-example/1',
      body: null
    });

    expect(createHandler.mock.calls.length).toBe(0);
    expect(findHandler.mock.calls.length).toBe(0);
    expect(findByIdHandler.mock.calls.length).toBe(0);
    expect(updateHandler.mock.calls.length).toBe(0);
    expect(deleteHandler.mock.calls.length).toBe(1);
  });

  test("custom route", async () => {
    await router.onCustomRoute(new CustomRoute('GET', '/post-example/:id/custom', customHandler));

    await router.handleRequest({
      httpMethod: 'GET',
      path: '/post-example/22/custom',
      body: null
    });

    expect(createHandler.mock.calls.length).toBe(0);
    expect(findHandler.mock.calls.length).toBe(0);
    expect(findByIdHandler.mock.calls.length).toBe(0);
    expect(updateHandler.mock.calls.length).toBe(0);
    expect(deleteHandler.mock.calls.length).toBe(0);
    expect(customHandler.mock.calls.length).toBe(1);
  });
});