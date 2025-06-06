import type { Request } from '@middy/core';
import { buildApiErrorResponse } from '../utils/responseUtils';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const withErrorHandler = () => ({
  onError: async (request: Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
    return buildApiErrorResponse(request.error);
  },
});
