import { getConnection } from '../../../connection';

export const upsertWords = async (words: string[]): Promise<void> => {
  let paramCount = 1;
  const valuesTemplate = words.map(
    () => ` ($${paramCount++})`
  );

  await getConnection().query(
    `INSERT INTO word (word)
    VALUES${valuesTemplate}
    ON CONFLICT DO NOTHING;`,
    words
  );
};
