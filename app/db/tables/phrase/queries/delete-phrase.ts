import { getConnection } from '../../../connection';

export const deletePhrase = async (id: number): Promise<void> => {
  await getConnection().query(
    `DELETE FROM phrase
    WHERE phrase_id = $1`,
    [id]
  );
};
