import { createLogger, closeLogger } from '../utils/logger';

const withLogger = () => ({
  before: async () => {
    await createLogger();
  },
  after: async () => {
    await closeLogger();
  },
  onError: async () => {
    await closeLogger();
  },
});

export default withLogger;
