import { connectDatabase, disconnectDatabase } from '../database/database';

// middy middleware to connect to the database
const withDatabaseConnection = () => {
  return {
    before: async () => {
      await connectDatabase();
    },
    after: async () => {
      await disconnectDatabase();
    },
    onError: async () => {
      await disconnectDatabase();
    },
  };
};

export default withDatabaseConnection;
