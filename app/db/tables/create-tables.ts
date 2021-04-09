import path from 'path';
import { promises as fs } from 'fs';
import { getConnection } from '../connection';

const createTable = async (sqlPath: string): Promise<void> => {
  const sql = await fs.readFile(sqlPath, 'utf8');

  await getConnection().query(sql);
};

export const createTables = async (): Promise<void> => {
  try {
    const base = path.join(process.cwd(), 'app', 'db', 'tables');
    await createTable(path.join(base, 'word', 'word.sql'));
    await createTable(path.join(base, 'book', 'book.sql'));
    await createTable(path.join(base, 'word-appearance', 'word-appearance.sql'));
    await createTable(path.join(base, 'group', 'group.sql'));
    await createTable(path.join(base, 'group-word', 'group-word.sql'));
    await createTable(path.join(base, 'phrase', 'phrase.sql'));
    await createTable(path.join(base, 'phrase-word', 'phrase-word.sql'));
  } catch(err) {
    console.error(err);
    throw err;
  }
};
