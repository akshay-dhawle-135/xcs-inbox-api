import winston from 'winston';
import ConfigService from '../config/config';

const { Config } = new ConfigService();
export let logger: winston.Logger;

const consoleDevFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}${metaString}`;
  }),
);

const datadogJsonFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.json(),
);

const recreateLogger = () => {
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: Config.IS_OFFLINE ? consoleDevFormat : datadogJsonFormat,
    transports: [new winston.transports.Console()],
  });
};

const createLogger = (): winston.Logger => {
  if (!logger || !logger.writable) {
    recreateLogger();
  }
  return logger;
};

const closeLogger = async () => {
  const loggerClosed = new Promise((resolve) => logger.on('finish', resolve));
  // https://github.com/winstonjs/winston/issues/1250
  logger.end();
  return loggerClosed;
};

export { createLogger, closeLogger };
