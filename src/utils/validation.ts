import createHttpError from 'http-errors';
import { isEmpty } from 'lodash';
import { ZodIssueCode, z } from 'zod';
import HTTP_STATUS from '../constants/httpStatusCodes';

const formatMessage = (issue: z.ZodIssue): string => {
  const message =
    issue.code === ZodIssueCode.invalid_type
      ? `${issue.path.join('.')} is ${issue.message}`
      : issue.message;
  return message;
};

export const validateSchema = <T>(
  schema: z.ZodType<T> | undefined,
  data: unknown,
  schemaType: string,
) => {
  if (!schema && !isEmpty(data)) {
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, `Request ${schemaType} is not allowed`);
  }
  if (!schema) return;

  const result = schema.safeParse(data || {});
  if (!result.success) {
    const message = formatMessage(result.error.errors[0]);
    const fieldName = result.error.errors[0].path[0];
    throw createHttpError(HTTP_STATUS.BAD_REQUEST, { message, metadata: { fieldName } });
  }
  return result;
};
