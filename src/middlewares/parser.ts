import type { Request } from '@middy/core';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import { convertValues } from '../utils/common';

const withQueryAndPathParser = () => ({
  before: (request: Request<InboxAPIGatewayEvent, APIGatewayProxyResult>) => {
    const { queryStringParameters, pathParameters } = request.event;

    if (queryStringParameters) {
      request.event.queryStringParameters = convertValues(queryStringParameters);
    }

    if (pathParameters) {
      request.event.pathParameters = convertValues(pathParameters);
    }
  },
});

export default withQueryAndPathParser;
