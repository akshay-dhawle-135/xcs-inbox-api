/* eslint-disable @typescript-eslint/no-explicit-any */
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import withSqsJsonBodyParser from '@middy/sqs-json-body-parser';
import type { Context } from 'aws-lambda';
import { ValidationInputProps } from './validation';

import {
  withDatabaseConnection,
  withErrorHandler,
  withLogger,
  withQueryAndPathParser,
  withQueueEventValidation,
  withValidation,
} from './index';
import {
  ApiGatewayMiddlewareOptions,
  EventType,
  MiddlewareConfig,
  SqsMiddlewareOptions,
  SupportedEventTypes,
} from '../types/middy.interface';

const getValidationOptions = <TBody = unknown, TPath = unknown, TQuery = unknown>(
  validation: ValidationInputProps<TBody, TPath, TQuery>,
) => {
  const { bodySchema, pathSchema, querySchema, customValidation } = validation;
  const validationOptions: ValidationInputProps<TBody, TPath, TQuery> = {};

  if (bodySchema) validationOptions.bodySchema = bodySchema;
  if (pathSchema) validationOptions.pathSchema = pathSchema;
  if (querySchema) validationOptions.querySchema = querySchema;
  if (customValidation) validationOptions.customValidation = customValidation;

  const isValid = bodySchema || pathSchema || querySchema || customValidation;
  return {
    isValid,
    validationOptions,
  };
};

function apiGatewayMiddy<TBody = unknown, TPath = unknown, TQuery = unknown, Result = unknown>(
  chain: middy.MiddyfiedHandler<any, Result, Error, Context, {}>,
  config: ApiGatewayMiddlewareOptions<TBody, TPath, TQuery>,
) {
  const { parse, validation } = config;

  if (parse?.body) {
    chain = chain.use(httpJsonBodyParser());
  }

  if (parse?.query) {
    chain = chain.use(withQueryAndPathParser());
  }

  if (validation) {
    const { isValid, validationOptions } = getValidationOptions<TBody, TPath, TQuery>(validation);
    if (isValid) {
      chain = chain.use(withValidation(validationOptions));
    }
  }

  return chain;
}

function sqsMiddy<Result>(
  chain: middy.MiddyfiedHandler<any, Result, Error, Context, {}>,
  config: SqsMiddlewareOptions,
) {
  if (config.validation) {
    chain = chain.use(withQueueEventValidation());
  }

  if (config.parseBody) {
    chain = chain.use(withSqsJsonBodyParser());
  }

  return chain;
}

export function withMiddy<TBody = unknown, TPath = unknown, TQuery = unknown, Result = any>(
  handler: (event: any, context: Context) => Promise<Result>,
  config: MiddlewareConfig<TBody, TPath, TQuery>,
  type: SupportedEventTypes = EventType.ApiGateway,
) {
  const mergedConfig: MiddlewareConfig<TBody, TPath, TQuery> = {
    enableLogger: true,
    handleErrors: true,
    ...config,
  };

  let chain = middy(handler);

  if (mergedConfig.enableLogger) {
    chain = chain.use(withLogger());
  }

  if (type === EventType.ApiGateway && mergedConfig.apiGateway) {
    chain = apiGatewayMiddy<TBody, TPath, TQuery, Result>(chain, mergedConfig.apiGateway);
  }

  if (type === EventType.SQS && mergedConfig.sqs) {
    chain = sqsMiddy<Result>(chain, mergedConfig.sqs);
  }

  if (mergedConfig.useDatabaseConnection) {
    chain = chain.use(withDatabaseConnection());
  }

  if (mergedConfig.handleErrors) {
    chain = chain.use(withErrorHandler());
  }

  return chain;
}
