import type { Request } from '@middy/core';
import middy from '@middy/core';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { validateSchema } from '../utils/validation';

export interface ValidationInputProps<TBody, TPath, TQuery> {
  bodySchema?: z.ZodType<TBody>;
  pathSchema?: z.ZodType<TPath>;
  querySchema?: z.ZodType<TQuery>;
  customValidation?: (event: InboxAPIGatewayEvent) => void;
}

const withValidation = <TBody, TPath, TQuery>({
  bodySchema,
  pathSchema,
  querySchema,
  customValidation,
}: ValidationInputProps<TBody, TPath, TQuery>): middy.MiddlewareObj<
  InboxAPIGatewayEvent,
  APIGatewayProxyResult
> => {
  return {
    before: ({
      event: { body, pathParameters, queryStringParameters },
      event,
    }: Request<InboxAPIGatewayEvent, APIGatewayProxyResult>) => {
      // either custom validation run or in built validation present in this middleware
      if (customValidation) {
        return customValidation(event);
      }

      validateSchema(bodySchema, body, 'body');
      validateSchema(pathSchema, pathParameters, 'pathParameters');
      validateSchema(querySchema, queryStringParameters, 'queryStringParameters');
    },
  };
};

export default withValidation;
