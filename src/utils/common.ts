import { flow, isFinite, isString, lowerCase, mapValues, toNumber } from 'lodash';
import ConfigService from '../config/config';
import { PaginationMetaParams, PaginationMetadata } from '../types/common.interface';

const { Config } = new ConfigService();

const convertToBoolean = (value: string | undefined) =>
  isString(value) ? ({ true: true, false: false }[lowerCase(value)] ?? value) : value;

const convertToNumber = (value: string | undefined) =>
  isString(value) && isFinite(toNumber(value)) ? toNumber(value) : value;

const transformValue = flow(convertToBoolean, convertToNumber);

export const convertValues = (obj: Record<string, string | undefined> | {}) =>
  mapValues(obj, transformValue);

// response format refer: https://messaging-docs.dev.xplorcs.com/docs/api/Templates#:~:text=Get%20a%20list%20of%20templates
export function buildPaginationResponse<T>({
  page = Config.DEFAULT_PAGE_VALUE,
  limit = Config.DEFAULT_LIMIT_VALUE,
  data = [],
  total,
}: PaginationMetaParams<T>): PaginationMetadata<T> {
  const pageCount = Math.ceil(total / limit);

  return {
    metadata: {
      total,
      per_page: limit,
      page,
      page_count: pageCount,
    },
    data,
  };
}

export function getPaginationParams(
  page: number | undefined = Config.DEFAULT_PAGE_VALUE,
  limit: number | undefined = Config.DEFAULT_LIMIT_VALUE,
) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
