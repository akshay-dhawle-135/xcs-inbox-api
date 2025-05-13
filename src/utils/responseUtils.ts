import type { APIGatewayProxyResult } from 'aws-lambda';
import { HttpError } from 'http-errors';

interface ApiResponse<T> {
  message?: string;
  data?: T;
  status: 'success' | 'error';
  metadata?: object;
}

const createApiResponse = <T>(
  statusCode: number,
  responseData: ApiResponse<T>,
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(responseData),
});

export const buildApiResponse = <T>(statusCode: number, data: T): APIGatewayProxyResult =>
  createApiResponse(statusCode, { status: 'success', ...data });

export const buildApiErrorResponse = (error: Error | null): APIGatewayProxyResult => {
  if (error instanceof HttpError) {
    return createApiResponse(error.statusCode, {
      status: 'error',
      message: error.message,
      ...(error.metadata && { metadata: error.metadata }),
    });
  }
  return createApiResponse(500, { status: 'error', message: 'Internal Server Error' });
};

export const handleResponse = (statusCode: number, body: object) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode,
    body: JSON.stringify(body),
  };
};

export const handleError = (error: Error) => {
  console.error(error);
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: 'Internal Server Error',
    }),
  };
};
