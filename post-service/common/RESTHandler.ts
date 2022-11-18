import { APIGatewayProxyResult } from "aws-lambda";
import { RESTMinimalEvent } from "./RESTMinimalEvent";

export type RESTHandler = (event: RESTMinimalEvent, params: {[key: string]: string}, body?: string) => Promise<APIGatewayProxyResult>;

export type CreateHandler<T> = (event: RESTMinimalEvent, body: T) => Promise<T>;
export type FindHandler<T> = (event: RESTMinimalEvent) => Promise<T[]>;
export type FindByIdHandler<T> = (event: RESTMinimalEvent, id: string) => Promise<T | null>;
export type UpdateHandler<T> = (event: RESTMinimalEvent, id: string, body: T) => Promise<T>;
export type DeleteHandler<T> = (event: RESTMinimalEvent, id: string) => Promise<T>;
