import { connection } from '../../../connection';
import { Phrase } from '../phrase.interface';

export const insertPhrase = async (
  { word_count }: Omit<Phrase, 'phrase_id'>
): Promise<Phrase['phrase_id']> => {
  const { rows } = await connection.query<{ phrase_id: number }>(
    `INSERT INTO phrase (word_count)
    VALUES ($1)
    RETURNING phrase_id`,
    [word_count]
  );

  return rows[0].phrase_id;
};
