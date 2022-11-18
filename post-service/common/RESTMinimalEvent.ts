export type RESTMinimalEvent = {
  httpMethod: string;
  path: string;
  body: string | null;
}