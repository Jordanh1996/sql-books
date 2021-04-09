import { Client } from 'pg';
import { createTables } from './tables/create-tables';

const connection = new Client({
  host: 'localhost',
  database: 'books',
  user: 'postgres',
  port: 5432,
  query_timeout: 50000,
});

export const connect = async (): Promise<void> => {
  try {
    await connection.connect();;
    try {
      await createTables();
    } catch (err) {
      console.error('Faild to sync tables', err);
      process.exit(2);
    }
  } catch (err) {
    console.error('Faild to connect to database', err);
    process.exit(1);
  }
};

export { connection };
