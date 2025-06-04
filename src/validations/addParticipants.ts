import { z } from 'zod';
import { InboxAPIGatewayEvent } from '../types/apigateway.interface';
import HTTP_STATUS from '../constants/httpStatusCodes';
import createHttpError from 'http-errors';
import { validateSchema } from '../utils/validation';

// schemas
export const addParticipantPathSchema = z.object({
  conversationId: z.string().uuid(),
});

export const internalContactSchema = z
  .object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().optional(),
    phone_number: z.string().refine((val) => /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Invalid E.164 phone number format',
    }),
  })
  .strict();

export const externalContactSchema = z
  .object({
    external_account_id: z.string(),
    contact_source: z.string(),
  })
  .strict();

export const addParticipantBodySchema = internalContactSchema.merge(externalContactSchema);

// custom validation
const internalFields = Object.keys(internalContactSchema.shape);
const externalFields = Object.keys(externalContactSchema.shape);

function detectContactTypeFields(obj: Record<string, string | undefined>) {
  if (!obj || typeof obj !== 'object') {
    return { hasInternal: false, hasExternal: false };
  }
  const hasInternal = internalFields.some((f) => f in obj);
  const hasExternal = externalFields.some((f) => f in obj);
  return { hasInternal, hasExternal };
}

export function validateAddParticipantPayload(event: InboxAPIGatewayEvent) {
  const payload = event.body as Record<string, string | undefined>;
  const { hasInternal, hasExternal } = detectContactTypeFields(payload);

  const errorMessage = `Payload must include either internal contact fields (${internalFields.join(',')}) or external contact fields (${externalFields.join(',')})`;
  if (hasInternal && hasExternal) {
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, { message: `${errorMessage}, but not both.` });
  }

  if (!hasInternal && !hasExternal) {
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, { message: errorMessage });
  }

  validateSchema(addParticipantPathSchema, event.pathParameters, 'pathParameters');

  if (hasInternal) {
    validateSchema(internalContactSchema, payload, 'body');
  }

  if (hasExternal) {
    validateSchema(externalContactSchema, payload, 'body');
  }
}
