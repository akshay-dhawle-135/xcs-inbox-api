import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { publishEvent } from '../aws/eventbridge';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { buildApiResponse } from '../utils/responseUtils';
import { addConversationBodySchema as bodySchema } from '../validations/conversation';

type IBody = z.infer<typeof bodySchema>;

const addConversation = async (
  event: InboxAPIGatewayEvent<IBody>,
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('addConversation event received:', event);

    await publishEvent(
      "xplor/growth/transactional_messaging",
      "com.xplortechnologies.growth.transactional_messaging.message.received",
      { message: "hello world, from app"}
    )
    return buildApiResponse(201, { message: 'Conversation added successfully!' });    
  } catch (error) {
    return buildApiResponse(500, { message: 'Conversation added failed!' });    
  }

};

const handler = middy(addConversation)

export { handler };
