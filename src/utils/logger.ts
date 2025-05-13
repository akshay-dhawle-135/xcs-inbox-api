import winston from 'winston';

export let logger: winston.Logger;

const recreateLogger = () => {
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
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
