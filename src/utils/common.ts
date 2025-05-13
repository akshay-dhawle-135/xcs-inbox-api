import { isFinite, toNumber, lowerCase, isString, mapValues, flow } from 'lodash';
import { PaginationMetadata, PaginationParams } from '../types/common.interface';
import ConfigService from '../config/config';

const { Config } = new ConfigService();

const convertToBoolean = (value: string | undefined) =>
  isString(value) ? ({ true: true, false: false }[lowerCase(value)] ?? value) : value;

const convertToNumber = (value: string | undefined) =>
  isString(value) && isFinite(toNumber(value)) ? toNumber(value) : value;

const transformValue = flow(convertToBoolean, convertToNumber);

export const convertValues = (obj: Record<string, string | undefined> | {}) =>
  mapValues(obj, transformValue);

export function buildPaginationResponse<T>({
  page = Config.DEFAULT_PAGE_VALUE,
  limit = Config.DEFAULT_LIMIT_VALUE,
  data = [],
}: PaginationParams<T>): PaginationMetadata<T> {
  const total = data.length;
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
  page: number = Config.DEFAULT_PAGE_VALUE,
  limit: number = Config.DEFAULT_LIMIT_VALUE,
) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
