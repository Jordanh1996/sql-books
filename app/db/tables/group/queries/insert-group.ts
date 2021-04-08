import { Group, NewGroup } from '../group.interface';
import { connection } from '../../../connection';

export const insertGroup = async ({ name }: NewGroup): Promise<number> => {
  const res = await connection.query(
    `INSERT INTO "group" (name)
      VALUES ($1) RETURNING group_id`,
    [name]
  );

  return res.rows[0].group_id;
};

export const insertGroups = async (groups: Group[]) => {
  let offset = 1;
  const valuesTemplate = groups.map(
    () => ` ($${offset++}, $${offset++})`
  );
  const values = groups.map(({ group_id, name }) => [group_id, name]).flat();

  await connection.query(
    `INSERT INTO "group"
    (group_id, name)
    VALUES${valuesTemplate}`,
    values
  );
};
