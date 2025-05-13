import type { APIGatewayProxyResult } from 'aws-lambda';
import { buildApiResponse } from '../utils/responseUtils';
import { logger } from '../utils/logger';
import middy from '@middy/core';
import withLogger from '../middlewares/logger';
import withValidation from '../middlewares/validation';
import { z } from 'zod';
import {
  addMessageBodySchema as bodySchema,
  addMessagePathSchema as pathSchema,
} from '../validations/message';
import { withErrorHandler } from '../middlewares/error';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';

type IBody = z.infer<typeof bodySchema>;
type IPath = z.infer<typeof pathSchema>;

const addMessage = async (
  event: InboxAPIGatewayEvent<IBody, IPath>,
): Promise<APIGatewayProxyResult> => {
  logger.info('addMessage event received:', event);
  return buildApiResponse(201, { message: 'Message added successfully!' });
};

const handler = middy(addMessage)
  .use(httpJsonBodyParser())
  .use(withLogger())
  .use(withValidation({ bodySchema, pathSchema }))
  .use(withErrorHandler());

export { handler };
