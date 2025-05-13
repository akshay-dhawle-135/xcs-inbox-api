import type { SQSEvent, SQSRecord, EventBridgeEvent } from 'aws-lambda';
import { CloudEvent } from 'cloudevents';
import {
  MessageCreatedEvent,
  MessageDeliveryEvent,
  MessageReceivedEvent,
  MessageSentEvent,
} from './message.interface';

// customising events
interface InboxSQSRecord<T> extends Omit<SQSRecord, 'body'> {
  body: T;
}

interface InboxCloudEvent<T> extends Omit<CloudEvent<T>, 'data'> {
  data: T;
}

interface InboxEventBridgeEvent<T> extends Omit<EventBridgeEvent<string, T>, 'detail'> {
  detail: InboxCloudEvent<T>;
}

export interface InboxSQSEvent<T> extends Omit<SQSEvent, 'Records'> {
  Records: InboxSQSRecord<T>[];
}

export type MessageReceiveCloudEvent = InboxEventBridgeEvent<MessageReceivedEvent>;
export type MessageSentCloudEvent = InboxEventBridgeEvent<MessageSentEvent>;
export type MessageDeliveryCloudEvent = InboxEventBridgeEvent<MessageDeliveryEvent>;
export type MessageCreatedCloudEvent = InboxEventBridgeEvent<MessageCreatedEvent>;
