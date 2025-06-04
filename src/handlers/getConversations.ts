import type { APIGatewayProxyResult } from 'aws-lambda';
import { buildPaginationResponse } from '../../src/utils/common';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { IGetConversationQuery as IQuery } from '../dtos/message/conversation';
import { withMiddy } from '../middlewares/withMiddy';
import { fetchConversations } from '../services/conversation';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';
import { getConversationsQuerySchema as querySchema } from '../validations/conversation';

type InboxEvent = InboxAPIGatewayEvent<unknown, unknown, IQuery>;

const getConversations = async (event: InboxEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Received getConversations event:', event.queryStringParameters);

  const { limit, offset } = event.queryStringParameters;

  const [conversations, total] = await fetchConversations({ offset, limit });

  const response = buildPaginationResponse({
    page: offset,
    limit: limit,
    data: conversations,
    total,
  });

  return buildApiResponse(HTTP_STATUS.OK, response);
};

const handler = withMiddy(getConversations, {
  apiGateway: {
    parse: { body: true, query: true },
    validation: { querySchema },
  },
  useDatabaseConnection: true,
});

export { handler };
