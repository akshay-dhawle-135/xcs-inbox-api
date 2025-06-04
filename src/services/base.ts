import createHttpError from 'http-errors';
import type { EntityTarget, FindManyOptions, FindOneOptions } from 'typeorm';
import { EntityNotFoundError } from 'typeorm';
import HTTP_STATUS from '../constants/httpStatusCodes';
import { AppDataSource } from '../database/database';
import { BaseEntity } from '../database/entities/BaseEntity';
import { logger } from '../utils/logger';

export const getEntityName = <T extends BaseEntity>(entityTarget: EntityTarget<T>) => {
  return typeof entityTarget === 'function' ? entityTarget.name : entityTarget.toString();
};

export const getRepository = <T extends BaseEntity>(entityTarget: EntityTarget<T>) => {
  return AppDataSource.getRepository(entityTarget);
};

export const buildEntity = <T extends BaseEntity>(
  entityTarget: EntityTarget<T>,
  data: Partial<T>,
) => {
  const entityRepository = getRepository(entityTarget);
  return entityRepository.create(data as T);
};

export const save = async <T extends BaseEntity>(
  entityTarget: EntityTarget<T>,
  data: Partial<T>,
) => {
  const target = await getEntityName(entityTarget);
  logger.debug(`saving new entity data: ${target}`, { data });

  const entityRepository = getRepository(entityTarget);
  const entityResponse = await entityRepository.save<T>(data as T);

  logger.debug(`data saved for entity: ${target}`, { data });
  return entityResponse;
};

export const findAndCount = async <T extends BaseEntity>(
  entityTarget: EntityTarget<T>,
  options?: FindManyOptions<T>,
) => {
  const entityRepository = getRepository(entityTarget);
  return entityRepository.findAndCount(options);
};

export const findOne = async <T extends BaseEntity>(
  entityTarget: EntityTarget<T>,
  options: FindOneOptions<T>,
) => {
  const entityRepository = getRepository(entityTarget);
  return entityRepository.findOne(options);
};

export const findOneOrFail = async <T extends BaseEntity>(
  entityTarget: EntityTarget<T>,
  options: FindOneOptions<T>,
) => {
  const entity = getEntityName(entityTarget);
  try {
    const entityRepository = getRepository(entityTarget);
    const entityResponse = await entityRepository.findOneOrFail(options);
    return entityResponse;
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      const id = error.criteria.where.id;
      throw createHttpError(HTTP_STATUS.NOT_FOUND, `No ${entity} found with id: ${id}`);
    }
    throw error;
  }
};
