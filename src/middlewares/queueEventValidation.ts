import { CloudEvent } from 'cloudevents';
import createHttpError from 'http-errors';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { logger } from '../utils/logger';
import { z } from 'zod';

const EventRecordSchema = z.object({
  body: z.string(),
});

const EventSchema = z.object({
  Records: z.array(EventRecordSchema).nonempty('Records array is empty'),
});

const isValidSqsEvent = (request: Record<string, unknown>) => {
  const event = request.event;
  if (event === null || typeof event !== 'object' || !('Records' in event)) {
    logger.error('Invalid SQS event: missing event body');
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, {
      message: 'Invalid SQS event: missing event body',
    });
  }
  const parsedEvent = EventSchema.parse(event);
  return parsedEvent.Records[0].body;
};

const isValidEventbridgeEvent = (eventBody: string) => {
  const eventDetail = JSON.parse(eventBody).detail;

  if (!eventDetail) {
    logger.error('Invalid EventBridge event: missing event detail');
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, {
      message: 'Invalid EventBridge event: missing event detail',
    });
  }

  return eventDetail;
};

const isValidCloudEvent = (eventDetail: Record<string, unknown>) => {
  const cloudevent = new CloudEvent(eventDetail);
  const isValid = cloudevent.validate();
  if (!isValid) {
    logger.error('CloudEvent validation failed', { eventDetail });
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, { message: 'Invalid CloudEvent' });
  }
};

export const withQueueEventValidation = () => {
  return {
    before: async (request: { event: Record<string, unknown> }) => {
      try {
        const eventBody = isValidSqsEvent(request);
        const eventDetail = isValidEventbridgeEvent(eventBody);
        isValidCloudEvent(eventDetail);
        logger.info('Event validation successful');
        return eventDetail;
      } catch (error) {
        logger.error('Error during event processing', { error });
        throw error;
      }
    },
  };
};
