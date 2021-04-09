import { getConnection } from '../../../connection';
import { Word } from '../word.interface';

export const insertWords = async (words: Word[]): Promise<void> => {
  let paramCount = 1;
  const valuesTemplate = words.map(
    () => ` ($${paramCount++}, $${paramCount++})`
  );

  await getConnection().query(
    `INSERT INTO word (word_id, word)
    VALUES${valuesTemplate};`,
    words.map(({ word_id, word }) => [word_id, word]).flat()
  );
};
