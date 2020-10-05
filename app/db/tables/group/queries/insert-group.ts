import { NewGroup } from '../group.interface';
import { connection } from '../../../connection';

export const insertGroup = async ({ name }: NewGroup): Promise<number> => {
  const res = await connection.query(
    `INSERT INTO "group" (name)
      VALUES ($1) RETURNING group_id`,
    [name]
  );

  return res.rows[0].group_id;
};
