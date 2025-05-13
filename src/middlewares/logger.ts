import { createLogger, closeLogger } from '../utils/logger';

const withLogger = () => ({
  before: async () => {
    createLogger();
  },
  after: async () => {
    await closeLogger();
  },
  onError: async () => {
    await closeLogger();
  },
});

export default withLogger;
