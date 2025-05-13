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
import { getConversationsQuerySchema as querySchema } from '../validations/conversation';

type IQuery = z.infer<typeof querySchema>;
type Event = InboxAPIGatewayEvent<unknown, unknown, IQuery>;

const getConversations = async (event: Event): Promise<APIGatewayProxyResult> => {
  logger.info('getConversations event received:', event);
  return buildApiResponse(200, { message: 'Conversations fetched successfully!' });
};

const handler = middy(getConversations)
  .use(httpJsonBodyParser())
  .use(withQueryAndPathParser())
  .use(withLogger())
  .use(withValidation({ querySchema }))
  .use(withErrorHandler());

export { handler };
