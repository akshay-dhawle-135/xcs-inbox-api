import type { APIGatewayProxyResult } from 'aws-lambda';
import { ApiStatus } from '../constants/enums';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { Conversation } from '../database/entities/Conversation';
import { ApiResponseDTO } from '../dtos/common/apiResponse';
import { ICreateConversationBody } from '../dtos/message/conversation';
import { withMiddy } from '../middlewares/withMiddy';
import { createConversation } from '../services/conversation';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';
import { addConversationBodySchema as bodySchema } from '../validations/conversation';

export const addConversation = async (
  event: InboxAPIGatewayEvent<ICreateConversationBody>,
): Promise<APIGatewayProxyResult> => {
  logger.debug('Received addConversation event: body', event.body);

  const conversation = await createConversation(event.body);

  const response: ApiResponseDTO<Conversation> = {
    data: conversation,
    status: ApiStatus.SUCCESS,
    message: 'Conversation added successfully!',
  };

  return buildApiResponse(HTTP_STATUS.CREATED, response);
};

const handler = withMiddy(addConversation, {
  useDatabaseConnection: true,
  apiGateway: {
    parse: { body: true },
    validation: { bodySchema },
  },
});

export { handler };
