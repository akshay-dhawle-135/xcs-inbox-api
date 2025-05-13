import { from } from 'env-var';
import { IConfig } from '../types/config.interface';

const { get } = from(process.env);

class ConfigService {
  Config: IConfig;

  constructor() {
    this.Config = {
      AWS_REGION: get('AWS_REGION').default('us-east-1').asString(),
      XPLOR_GROWTH_EVENT_BUS_NAME: get('XPLOR_GROWTH_EVENT_BUS_NAME').asString(),
      DB_HOST: get('DB_HOST').asString(),
      DB_PORT: get('DB_PORT').asInt(),
      DB_USERNAME: get('DB_USERNAME').asString(),
      DB_PASSWORD: get('DB_PASSWORD').asString(),
      DB_NAME: get('DB_NAME').asString(),
      LOG_LEVEL: get('LOG_LEVEL').default('info').asString(),
      INBOX_API_EVENT_BUS_SOURCE_NAME: get('INBOX_API_EVENT_BUS_SOURCE_NAME').asString(),
      INBOX_API_EVENT_BUS_DETAIL_TYPE_PREFIX: get(
        'INBOX_API_EVENT_BUS_DETAIL_TYPE_PREFIX',
      ).asString(),

      // pagination config
      DEFAULT_PAGE_VALUE: 1,
      DEFAULT_LIMIT_VALUE: 10,

      IS_OFFLINE: get('IS_OFFLINE').default('false').asBool(),
      LOCALSTACK_ENDPOINT_URL: get('LOCALSTACK_ENDPOINT_URL').asString(),
      LOCAL_AWS_ACCESS_KEY_ID: get('LOCAL_AWS_ACCESS_KEY_ID').default('test').asString(),
      LOCAL_AWS_SECRET_ACCESS_KEY: get('LOCAL_AWS_SECRET_ACCESS_KEY').default('test').asString(),
    };
  }
}

export default ConfigService;
