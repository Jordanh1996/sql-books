import { promises as fs } from 'fs';
import { connection } from '../connection';

const createTable = async (sqlPath: string): Promise<void> => {
  const sql = await fs.readFile(sqlPath, 'utf8');

  await connection.query(sql);
};

export const createTables = async (): Promise<void> => {
  await createTable(__dirname + '/book/book.sql');
  await createTable(__dirname + '/word/word.sql');
  await createTable(__dirname + '/group/group.sql');
  await createTable(__dirname + '/group_word/group_word.sql');
  await createTable(__dirname + '/phrase/phrase.sql');
  await createTable(__dirname + '/phrase_word/phrase_word.sql');
};
