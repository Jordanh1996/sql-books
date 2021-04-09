import { getConnection } from '../../../connection';
import { Phrase } from '../phrase.interface';

export const insertPhrase = async (
  { word_count }: Omit<Phrase, 'phrase_id'>
): Promise<Phrase['phrase_id']> => {
  const { rows } = await getConnection().query<{ phrase_id: number }>(
    `INSERT INTO phrase (word_count)
    VALUES ($1)
    RETURNING phrase_id`,
    [word_count]
  );

  return rows[0].phrase_id;
};

export const insertPhrases = async (phrases: Phrase[]) => {
  let offset = 1;
  const valuesTemplate = phrases.map(
    () => ` ($${offset++}, $${offset++})`
  );
  const values = phrases.map(({ phrase_id, word_count }) => [phrase_id, word_count]).flat();

  await getConnection().query(
    `INSERT INTO phrase
    (phrase_id, word_count)
    VALUES${valuesTemplate}`,
    values
  );
};
