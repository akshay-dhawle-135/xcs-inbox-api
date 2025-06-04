import type { APIGatewayEvent } from 'aws-lambda';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { buildApiResponse } from '../utils/responseUtils';

const handler = async (event: APIGatewayEvent) => {
  const response = { message: 'Your function executed successfully!', input: event };
  return buildApiResponse(HTTP_STATUS.OK, response);
};

export { handler };
