export interface IConfig {
  AWS_REGION: string;
  XPLOR_GROWTH_EVENT_BUS_NAME: string | undefined;
  INBOX_API_EVENT_BUS_SOURCE_NAME: string | undefined;
  INBOX_API_EVENT_BUS_DETAIL_TYPE_PREFIX: string | undefined;
  DB_HOST: string | undefined;
  DB_PORT: number | undefined;
  DB_USERNAME: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_NAME: string | undefined;
  LOG_LEVEL: string;

  DEFAULT_PAGE_VALUE: number;
  DEFAULT_LIMIT_VALUE: number;

  IS_OFFLINE: boolean;
  LOCALSTACK_ENDPOINT_URL?: string;
  LOCAL_AWS_ACCESS_KEY_ID: string;
  LOCAL_AWS_SECRET_ACCESS_KEY: string;
}
