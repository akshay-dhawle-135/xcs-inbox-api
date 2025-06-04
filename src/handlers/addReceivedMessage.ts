import type { APIGatewayEvent } from 'aws-lambda';
import { withMiddy } from '../middlewares/withMiddy';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';
import { EventType } from '../types/middy.interface';

const addReceivedMessage = async (event: APIGatewayEvent) => {
  logger.info('addReceivedMessage event received:', event);
  return buildApiResponse(202, { message: 'Received message processed successfully!' });
};

const handler = withMiddy(
  addReceivedMessage,
  { sqs: { validation: true, parseBody: true } },
  EventType.SQS,
);

export { handler };
