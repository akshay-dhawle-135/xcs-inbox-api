import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { Contact } from '../database/entities/Contact';
import { Conversation } from '../database/entities/Conversation';
import { ConversationContact } from '../database/entities/ConversationContact';
import { DeliveryStatus } from '../database/entities/DeliveryStatus';
import { Message } from '../database/entities/Message';
import { InitialMigration1747041654194 } from '../database/entities/migrations/1747041654194-InitialMigration';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [DeliveryStatus, Message, Conversation, Contact, ConversationContact],
  migrations: [InitialMigration1747041654194],
});

const withDataSourceConnection = <TArgs extends unknown[], TReturn>(
  dataSourceFn: (...args: TArgs) => TReturn,
): ((...args: TArgs) => Promise<TReturn>) => {
  if (dataSource.isInitialized) {
    return async (...args: TArgs): Promise<TReturn> => Promise.resolve(dataSourceFn(...args));
  }
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      await dataSource.initialize();
      const fn = await dataSourceFn(...args);
      return fn;
    } finally {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    }
  };
};

export { dataSource, withDataSourceConnection };
