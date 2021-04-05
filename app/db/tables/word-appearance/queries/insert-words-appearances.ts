import { WordAppearance } from '../word-appearance.interface';
import { connection } from '../../../connection';

export const insertWordsAppearances = async (words: WordAppearance[]): Promise<void> => {
  let paramCount = 1;
  const valuesTemplate = words.map(
    () =>
      ` ($${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++})`
  );
  const values = words.reduce(
    (acc, { word_id, book_id, index, offset, sentence, line, paragraph }) => [
      ...acc,
      word_id,
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
    `INSERT INTO word_appearance (word_id, book_id, index, "offset", sentence, line, paragraph)
    VALUES${valuesTemplate};`,
    values
  );
};
