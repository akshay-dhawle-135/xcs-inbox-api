import type { APIGatewayEvent } from 'aws-lambda';
import { withMiddy } from '../middlewares/withMiddy';
import { EventType } from '../types/middy.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';

const addSentMessage = async (event: APIGatewayEvent) => {
  logger.info('addSentMessage event received:', event);
  return buildApiResponse(202, { message: 'Sent message processed successfully!' });
};

const handler = withMiddy(
  addSentMessage,
  { sqs: { validation: true, parseBody: true } },
  EventType.SQS,
);

export { handler };
