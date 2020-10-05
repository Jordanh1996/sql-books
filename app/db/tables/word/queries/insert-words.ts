import { Word } from '../word.interface';
import { connection } from '../../../connection';

export const insertWords = async (words: Word[]): Promise<void> => {
  let paramCount = 1;
  const valuesTemplate = words.map(
    () =>
      ` ($${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++})`
  );
  const values = words.reduce(
    (acc, { word, book_id, index, offset, sentence, line, paragraph }) => [
      ...acc,
      word,
      book_id,
      index,
      offset,
      sentence,
      line,
      paragraph,
    ],
    []
  );

  await connection.query(
    `INSERT INTO word (word, book_id, index, "offset", sentence, line, paragraph)
    VALUES${valuesTemplate};`,
    values
  );
};
