import type { APIGatewayEvent } from 'aws-lambda';
import { withMiddy } from '../middlewares/withMiddy';
import { EventType } from '../types/middy.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';

const updateMessageStatus = async (event: APIGatewayEvent) => {
  logger.info('updateMessageStatus event received:', event);
  return buildApiResponse(202, { message: 'Message status updated successfully!' });
};

const handler = withMiddy(
  updateMessageStatus,
  { sqs: { validation: true, parseBody: true } },
  EventType.SQS,
);

export { handler };
