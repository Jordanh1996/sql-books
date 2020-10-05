import { Client } from 'pg';
import { createTables } from './tables/create-tables';

const connection = new Client({
  host: 'localhost',
  database: 'books',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  query_timeout: 5000,
});

const p = connection.connect();

export const connect = async (): Promise<void> => {
  try {
    await p;
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
