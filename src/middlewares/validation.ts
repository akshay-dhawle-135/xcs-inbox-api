import type { Request } from '@middy/core';
import middy from '@middy/core';
import type { APIGatewayProxyResult } from 'aws-lambda';
import createHttpError from 'http-errors';
import { isEmpty } from 'lodash';
import { z, ZodIssueCode } from 'zod';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';

interface InputProps<TBody, TPath, TQuery> {
  bodySchema?: z.ZodType<TBody>;
  pathSchema?: z.ZodType<TPath>;
  querySchema?: z.ZodType<TQuery>;
}

const formatMessage = (issue: z.ZodIssue): string => {
  const message =
    issue.code === ZodIssueCode.invalid_type
      ? `${issue.path.join('.')} is ${issue.message}`
      : issue.message;
  return message;
};

const validateSchema = <T>(schema: z.ZodType<T> | undefined, data: unknown, schemaType: string) => {
  if (!schema && !isEmpty(data)) {
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, `Request ${schemaType} is not allowed`);
  }
  if (!schema) return;

  const result = schema.safeParse(data || {});
  if (!result.success) {
    const message = formatMessage(result.error.errors[0]);
    const fieldName = result.error.errors[0].path[0];
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, { message, metadata: { fieldName } });
  }
};

const withValidation = <TBody, TPath, TQuery>({
  bodySchema,
  pathSchema,
  querySchema,
}: InputProps<TBody, TPath, TQuery>): middy.MiddlewareObj<
  InboxAPIGatewayEvent,
  APIGatewayProxyResult
> => {
  return {
    before: ({
      event: { body, pathParameters, queryStringParameters },
    }: Request<InboxAPIGatewayEvent, APIGatewayProxyResult>) => {
      validateSchema(bodySchema, body, 'body');

      validateSchema(pathSchema, pathParameters, 'pathParameters');

      validateSchema(querySchema, queryStringParameters, 'queryStringParameters');
    },
  };
};

export default withValidation;
