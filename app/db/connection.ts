import { Client } from 'pg';
import { createTables } from './tables/create-tables';

let connection: Client;

export const connect = async (username: string, password?: string): Promise<void> => {
  try {
    connection = new Client({
      host: 'localhost',
      database: 'books',
      user: username,
      password,
      port: 5432,
    });
    await connection.connect();
    try {
      await createTables();
    } catch (err) {
      console.error('Faild to sync tables', err);
      process.exit(2);
    }
  } catch (err) {
    console.error('Faild to connect to database', err);
    throw err;
  }
};

export const getConnection = () => connection;
