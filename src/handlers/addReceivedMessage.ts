import type { APIGatewayEvent } from 'aws-lambda';
import { buildApiResponse } from '../utils/responseUtils';
import { logger } from '../utils/logger';
import middy from '@middy/core';
import withLogger from '../middlewares/logger';
import withSqsJsonBodyParser from '@middy/sqs-json-body-parser';

const addReceivedMessage = async (event: APIGatewayEvent) => {
  logger.info('addReceivedMessage event received:', event);
  return buildApiResponse(202, { message: 'Received message processed successfully!' });
};

const handler = middy(addReceivedMessage).use(withLogger()).use(withSqsJsonBodyParser());

export { handler };
