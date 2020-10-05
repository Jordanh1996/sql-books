import { connection } from '../../../connection';
import { NewPhrase } from '../phrase.interface';

export const insertPhrase = async ({ phrase }: NewPhrase): Promise<void> => {
  await connection.query(
    `INSERT INTO phrase (phrase)
      VALUES ($1)`,
    [phrase]
  );
};
