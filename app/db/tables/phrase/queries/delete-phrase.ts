import { connection } from '../../../connection';

export const deletePhrase = async (id: number): Promise<void> => {
  await connection.query(
    `DELETE FROM phrase
    WHERE phrase_id = $1`,
    [id]
  );
};
