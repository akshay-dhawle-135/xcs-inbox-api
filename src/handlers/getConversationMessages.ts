import type { APIGatewayProxyResult } from 'aws-lambda';
import { buildApiResponse } from '../utils/responseUtils';
import { logger } from '../utils/logger';
import middy from '@middy/core';
import withLogger from '../middlewares/logger';
import withValidation from '../middlewares/validation';
import { z } from 'zod';
import { withErrorHandler } from '../middlewares/error';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import withQueryAndPathParser from '../middlewares/parser';
import {
  getConversationsMessagesPathSchema as pathSchema,
  getConversationsMessagesQuerySchema as querySchema,
} from '../validations/message';

type IPath = z.infer<typeof pathSchema>;
type IQuery = z.infer<typeof querySchema>;
type Event = InboxAPIGatewayEvent<unknown, IPath, IQuery>;

const getConversationMessages = async (event: Event): Promise<APIGatewayProxyResult> => {
  logger.info('getConversationMessages event received:', event);
  return buildApiResponse(200, { message: 'Messages fetched successfully!' });
};

const handler = middy(getConversationMessages)
  .use(httpJsonBodyParser())
  .use(withQueryAndPathParser())
  .use(withLogger())
  .use(withValidation({ pathSchema, querySchema }))
  .use(withErrorHandler());

export { handler };
