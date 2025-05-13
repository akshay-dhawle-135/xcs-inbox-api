import type { APIGatewayProxyEvent } from 'aws-lambda';

export interface InboxAPIGatewayEvent<TBody = unknown, TPath = unknown, TQuery = unknown>
  extends Omit<APIGatewayProxyEvent, 'body' | 'pathParameters' | 'queryStringParameters'> {
  body: TBody;
  pathParameters: TPath;
  queryStringParameters: TQuery;
}
