import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import type { DataSourceOptions } from 'typeorm';
import ConfigService from '../config/config';

import { Contact } from '../database/entities/Contact';
import { Conversation } from '../database/entities/Conversation';
import { ConversationContact } from '../database/entities/ConversationContact';
import { DeliveryStatus } from '../database/entities/DeliveryStatus';
import { Message } from '../database/entities/Message';
import { InitialMigration1747041654194 } from './entities/migrations/1747041654194-InitialMigration';
import { Message1747740425070 } from './entities/migrations/1747740425070-Message';
import { Contact1748861425669 } from './entities/migrations/1748861425669-Contact';
import { Contact1748867326940 } from './entities/migrations/1748867326940-Contact';
import { Contact1748868729794 } from './entities/migrations/1748868729794-Contact';

const { Config } = new ConfigService();

// note: we'll replace console.log with logger once implemented
const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [DeliveryStatus, Message, Conversation, Contact, ConversationContact],
  subscribers: [],
  migrations: [
    InitialMigration1747041654194,
    Message1747740425070,
    Contact1748861425669,
    Contact1748867326940,
    Contact1748868729794,
  ],
  maxQueryExecutionTime: 1000, // Log queries taking >1s
};

export const AppDataSource = new DataSource(databaseConfig);

export const connectDatabase = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error(
        `Database connection error: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    try {
      await AppDataSource.destroy();
      console.log('Database disconnected');
    } catch (error) {
      console.error('Database disconnection failed:', error);
    }
  }
};
