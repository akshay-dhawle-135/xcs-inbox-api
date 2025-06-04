import type { APIGatewayProxyResult } from 'aws-lambda';
import { IGetMessagesPath, IGetMessagesQuery } from '../dtos/message/message';
import { withMiddy } from '../middlewares/withMiddy';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';
import {
  getConversationsMessagesPathSchema as pathSchema,
  getConversationsMessagesQuerySchema as querySchema,
} from '../validations/message';

type Event = InboxAPIGatewayEvent<unknown, IGetMessagesPath, IGetMessagesQuery>;

const getConversationMessages = async (event: Event): Promise<APIGatewayProxyResult> => {
  logger.info('getConversationMessages event received:', event);
  return buildApiResponse(200, { message: 'Messages fetched successfully!' });
};

const handler = withMiddy(getConversationMessages, {
  apiGateway: {
    parse: { body: true, query: true },
    validation: { pathSchema, querySchema },
  },
  useDatabaseConnection: true,
});

export { handler };
