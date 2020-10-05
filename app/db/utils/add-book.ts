import { promises as fs } from 'fs';
import _ from 'lodash';
import { connection } from '../connection';
import { NewBook } from '../tables/book/book.interface';
import { insertBooks } from '../tables/book/queries/insert-books';
import { insertWords } from '../tables/word/queries/insert-words';
import { getWords } from '../../utils/book/getWords';

export const addBook = async (book: NewBook): Promise<number> => {
  const content = await fs.readFile(book.file_path, 'utf8');

  try {
    await connection.query('BEGIN');
    const [{ book_id }] = await insertBooks([book]);
    const words = getWords(content).map((word) => ({ ...word, book_id }));

    let chunks = _.chunk(words, 1000);
    for (const chunk of chunks) {
      await insertWords(chunk);
    }

    await connection.query('COMMIT');
    return book_id;
  } catch (e) {
    await connection.query('ROLLBACK');
    throw e;
  }
};
