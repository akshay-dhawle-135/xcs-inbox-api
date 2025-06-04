import type { APIGatewayProxyResult } from 'aws-lambda';
import { HttpError } from 'http-errors';
import ERROR_MESSAGES from '../constants/errorMessages';
import { ApiResponseDTO } from '../dtos/common/apiResponse';
import { logger } from './logger';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { QueryFailedErrorCode } from '../constants/enums';
import { QueryFailedError } from 'typeorm';

const createApiResponse = <T>(
  statusCode: number,
  responseData: ApiResponseDTO<T>,
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(responseData),
});

export const buildApiResponse = <T>(statusCode: number, data: T): APIGatewayProxyResult =>
  createApiResponse(statusCode, { status: 'success', ...data });

export const buildApiErrorResponse = (error: Error | null): APIGatewayProxyResult => {
  logger.error(error);

  if (error instanceof QueryFailedError) {
    let code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = error.driverError.detail;

    switch (error.driverError.code) {
      case QueryFailedErrorCode.UNIQUE_VIOLATION:
        code = HTTP_STATUS.CONFLICT;
        break;
      case QueryFailedErrorCode.FOREIGN_KEY_VIOLATION:
        code = HTTP_STATUS.BAD_REQUEST;
        break;
      case QueryFailedErrorCode.NOT_NULL_VIOLATION:
        code = HTTP_STATUS.BAD_REQUEST;
        break;
      case QueryFailedErrorCode.CHECK_VIOLATION:
        code = HTTP_STATUS.BAD_REQUEST;
        break;
      default:
        message = ERROR_MESSAGES.DB_QUERY_ERROR;
        break;
    }

    return createApiResponse(code, {
      status: 'error',
      message,
    });
  }

  if (error instanceof HttpError) {
    return createApiResponse(error.statusCode, {
      status: 'error',
      message: error.message,
      ...(error.metadata && { metadata: error.metadata }),
    });
  }
  return createApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
    status: 'error',
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};
