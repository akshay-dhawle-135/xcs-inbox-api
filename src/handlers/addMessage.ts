import type { APIGatewayProxyResult } from 'aws-lambda';
import { ApiStatus } from '../constants/enums';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { Message } from '../database/entities/Message';
import { ApiResponseDTO } from '../dtos/common/apiResponse';
import { ICreateMessageBody, ICreateMessagePath } from '../dtos/message/message';
import { withMiddy } from '../middlewares/withMiddy';
import { databaseValidations, saveMessage } from '../services/message';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';
import {
  addMessageBodySchema as bodySchema,
  addMessagePathSchema as pathSchema,
} from '../validations/message';

const addMessage = async (
  event: InboxAPIGatewayEvent<ICreateMessageBody, ICreateMessagePath>,
): Promise<APIGatewayProxyResult> => {
  logger.debug('Received addMessage event: body', event.body);

  const { conversationId: conversation_id } = event.pathParameters;
  const messageBody = { ...event.body, conversation_id };

  await databaseValidations({
    conversationId: conversation_id,
    contactId: messageBody.sender_contact_id,
  });

  const message = await saveMessage(messageBody);

  const response: ApiResponseDTO<Message> = {
    data: message,
    status: ApiStatus.SUCCESS,
    message: 'Message added successfully!',
  };
  return buildApiResponse(HTTP_STATUS.CREATED, response);
};

const handler = withMiddy(addMessage, {
  useDatabaseConnection: true,
  apiGateway: {
    parse: { body: true },
    validation: { bodySchema, pathSchema },
  },
});

export { handler };
