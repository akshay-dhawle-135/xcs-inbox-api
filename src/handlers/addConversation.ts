import type { APIGatewayProxyResult } from 'aws-lambda';
import { buildApiResponse } from '../utils/responseUtils';
import { logger } from '../utils/logger';
import middy from '@middy/core';
import withLogger from '../middlewares/logger';
import withValidation from '../middlewares/validation';
import { z } from 'zod';
import { addConversationBodySchema as bodySchema } from '../validations/conversation';
import { withErrorHandler } from '../middlewares/error';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';

type IBody = z.infer<typeof bodySchema>;

const addConversation = async (
  event: InboxAPIGatewayEvent<IBody>,
): Promise<APIGatewayProxyResult> => {
  logger.info('addConversation event received:', event);
  logger.info('addConversation event received:', event);
  return buildApiResponse(201, { message: 'Conversation added successfully!' });
};

const handler = middy(addConversation)
  .use(httpJsonBodyParser())
  .use(withLogger())
  .use(withValidation({ bodySchema }))
  .use(withErrorHandler());

export { handler };
