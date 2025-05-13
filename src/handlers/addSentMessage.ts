import type { APIGatewayEvent } from 'aws-lambda';
import { buildApiResponse } from '../utils/responseUtils';
import { logger } from '../utils/logger';
import middy from '@middy/core';
import withLogger from '../middlewares/logger';
import withSqsJsonBodyParser from '@middy/sqs-json-body-parser';

const addSentMessage = async (event: APIGatewayEvent) => {
  logger.info('addSentMessage event received:', event);
  return buildApiResponse(202, { message: 'Sent message processed successfully!' });
};

const handler = middy(addSentMessage).use(withLogger()).use(withSqsJsonBodyParser());

export { handler };
