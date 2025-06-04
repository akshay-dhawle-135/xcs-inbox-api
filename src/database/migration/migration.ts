import type { APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import { buildApiResponse } from '../../utils/responseUtils';
import { AppDataSource } from '../database';
import withLogger from '../../middlewares/logger';
import withDatabaseConnection from '../../middlewares/database';
import { withErrorHandler } from '../../middlewares/error';
import HTTP_STATUS from '../../constants/httpStatusCodes';

const migrationHandler = async (): Promise<APIGatewayProxyResult> => {
  const migrationResult = await AppDataSource.runMigrations();
  return buildApiResponse(HTTP_STATUS.OK, migrationResult);
};

const runMigrations = middy(migrationHandler)
  .use(withLogger())
  .use(withDatabaseConnection())
  .use(withErrorHandler());

export { runMigrations };
