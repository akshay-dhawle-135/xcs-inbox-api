import type { APIGatewayProxyResult } from 'aws-lambda';
import { ApiStatus } from '../constants/enums';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { Conversation } from '../database/entities/Conversation';
import { ApiResponseDTO } from '../dtos/common/apiResponse';
import { IGetConversationPath } from '../dtos/message/conversation';
import { withMiddy } from '../middlewares/withMiddy';
import { findConversationById } from '../services/conversation';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';
import { addConversationPathSchema as pathSchema } from '../validations/conversation';

const getConversation = async (
  event: InboxAPIGatewayEvent<unknown, IGetConversationPath>,
): Promise<APIGatewayProxyResult> => {
  logger.info('Received getConversation event:', event.pathParameters);

  const { conversationId } = event.pathParameters;

  const conversation = await findConversationById(conversationId);

  const response: ApiResponseDTO<Conversation> = {
    data: conversation,
    status: ApiStatus.SUCCESS,
    message: 'Conversations fetched successfully!',
  };
  return buildApiResponse(HTTP_STATUS.OK, response);
};

const handler = withMiddy(getConversation, {
  apiGateway: {
    parse: { query: true },
    validation: { pathSchema },
  },
  useDatabaseConnection: true,
});

export { handler };
