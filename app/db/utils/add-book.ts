import { promises as fs } from 'fs';
import _ from 'lodash';
import { connection } from '../connection';
import { NewBook } from '../tables/book/book.interface';
import { insertBooks } from '../tables/book/queries/insert-books';
import { insertWordsAppearances } from '../tables/word-appearance/queries/insert-words-appearances';
import { getWords } from '../../utils/book/getWords';
import { upsertWords } from '../tables/word/queries/upsert-words';
import { selectWords } from '../tables/word/queries/select-words';

const CHUNK_SIZE = 1000;

export const addBook = async (book: NewBook): Promise<number> => {
  const content = await fs.readFile(book.file_path, 'utf8');

  try {
    await connection.query('BEGIN');
    // INSERT to book
    const [{ book_id }] = await insertBooks([book]);

    // parse the book text
    const wordsAppearances = getWords(content);

    // remove duplicate words and normalize to string[]
    const wordsSet = [...new Set(wordsAppearances.map(({ word }) => word))];

    // Add every word if it doesnt't exist
    await upsertWords(wordsSet);

    // SELECT the words for their word_id + Create a dictionary for better runtime in the next statement
    const words = _.keyBy(await selectWords(wordsSet), 'word');

    // Normalize the word appearances
    let chunks = _.chunk(
      wordsAppearances.map((wordAppearance) => ({ 
        ...wordAppearance,
        word_id: words[wordAppearance.word].word_id,
        book_id,
      })),
      CHUNK_SIZE
    );
    
    // INSERT to word_appearance in chunks to prevent UI lags
    for (const chunk of chunks) {
      await insertWordsAppearances(chunk);
    }

    await connection.query('COMMIT');
    return book_id;
  } catch (e) {
    await connection.query('ROLLBACK');
    throw e;
  }
};
