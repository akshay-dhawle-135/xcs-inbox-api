import type { EventBridgeClientConfig } from '@aws-sdk/client-eventbridge';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import ConfigService from '../config/config';
import { logger } from '../utils/logger';
import { CloudEvent } from 'cloudevents';

const { Config } = new ConfigService();

let eventBridgeClient: EventBridgeClient | null = null;

const createLocalEventBridgeClient = (): EventBridgeClient => {
  const clientConfig: EventBridgeClientConfig = {
    endpoint: Config.LOCALSTACK_ENDPOINT_URL,
    region: Config.AWS_REGION,
    credentials: {
      accessKeyId: Config.LOCAL_AWS_ACCESS_KEY_ID,
      secretAccessKey: Config.LOCAL_AWS_SECRET_ACCESS_KEY,
    },
  };
  return new EventBridgeClient(clientConfig);
};

const createAwsEventBridgeClient = (): EventBridgeClient => {
  return new EventBridgeClient({ region: Config.AWS_REGION });
};

export const getEventBridgeClient = (): EventBridgeClient => {
  if (!eventBridgeClient) {
    eventBridgeClient = Config.IS_OFFLINE
      ? createLocalEventBridgeClient()
      : createAwsEventBridgeClient();
  }
  return eventBridgeClient;
};

export const publishEvent = async <T>(source: string, type: string, data: T): Promise<void> => {
  try {
    const cloudEvent = new CloudEvent({ source, type, data });
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: cloudEvent.source,
          DetailType: cloudEvent.type,
          Detail: JSON.stringify(cloudEvent),
          EventBusName: Config.XPLOR_GROWTH_EVENT_BUS_NAME,
        },
      ],
    });

    const client = getEventBridgeClient();
    const response = await client.send(command);

    logger.info(`Event published successfully: Type=${type}, Response=${JSON.stringify(response)}`);
  } catch (error) {
    logger.error(`Failed to publish event: ${error instanceof Error ? error.message : error}`);
  }
};
