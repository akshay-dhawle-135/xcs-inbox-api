import type { APIGatewayProxyResult } from 'aws-lambda';
import { IAddParticipantBody, IAddParticipantPath } from '../dtos/message/participant';
import { withMiddy } from '../middlewares/withMiddy';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { logger } from '../utils/logger';
import { buildApiResponse } from '../utils/responseUtils';
import { validateAddParticipantPayload } from '../validations/addParticipants';

const addParticipants = async (
  event: InboxAPIGatewayEvent<IAddParticipantBody, IAddParticipantPath>,
): Promise<APIGatewayProxyResult> => {
  logger.debug('addParticipants event body received:', event.body);
  return buildApiResponse(201, { message: 'Participants added successfully!' });
};

const handler = withMiddy(addParticipants, {
  apiGateway: {
    parse: { body: true },
    validation: { customValidation: validateAddParticipantPayload },
  },
});

export { handler };
