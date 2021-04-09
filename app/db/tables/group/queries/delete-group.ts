import { getConnection } from '../../../connection';

export const deleteGroup = async (id: number): Promise<void> => {
  await getConnection().query(
    `DELETE FROM "group" CASCADE
    WHERE group_id = $1`,
    [id]
  );
};
