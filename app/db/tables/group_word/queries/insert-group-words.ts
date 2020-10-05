import { connection } from '../../../connection';

export const insertGroupWords = async (
  id: number,
  words: string[]
): Promise<void> => {
  let offset = 1;
  const valuesTemplate = words.map(() => ` ($${offset++}, $${offset++})`);
  const values = words.map((word) => [id, word]).flat();

  await connection.query(
    `INSERT INTO group_word (group_id, word)
      VALUES${valuesTemplate};`,
    values
  );
};
