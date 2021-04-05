
import { connection } from '../../../connection';
import { Word } from '../word.interface';

export const selectWords = async (words: string[]): Promise<Word[]> => {
  let placeholderIndex = 1;
  const placeholders = words.map(() => '$' + placeholderIndex++);

  const { rows } = await connection.query<Word>(
    `SELECT word, word_id FROM word
    WHERE word IN (${placeholders.join(', ')})`,
    words
  );

  return rows;
};
