import { ValidationInputProps } from '../middlewares/validation';

export interface CommonMiddlewareOptions {
  enableLogger?: boolean;
  useDatabaseConnection?: boolean;
  handleErrors?: boolean;
}

export interface ApiGatewayMiddlewareOptions<TBody = unknown, TPath = unknown, TQuery = unknown> {
  parse?: {
    body?: boolean;
    query?: boolean;
  };
  validation?: ValidationInputProps<TBody, TPath, TQuery>;
}

export interface SqsMiddlewareOptions {
  validation?: boolean;
  parseBody?: boolean;
}

export interface MiddlewareConfig<TBody = unknown, TPath = unknown, TQuery = unknown>
  extends CommonMiddlewareOptions {
  apiGateway?: ApiGatewayMiddlewareOptions<TBody, TPath, TQuery>;
  sqs?: SqsMiddlewareOptions;
}

export enum EventType {
  ApiGateway = 'apiGateway',
  SQS = 'sqs',
}

export type SupportedEventTypes = EventType.ApiGateway | EventType.SQS;
