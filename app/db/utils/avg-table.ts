import { getConnection } from '../connection';

export const avgTable = async (
  tableName: string,
  groupBy: string
): Promise<number | string> => {
  const res = await getConnection().query(
    `SELECT AVG(count) AS average FROM (SELECT COUNT(*) AS count FROM "${tableName}" GROUP BY "${groupBy}") AS sub`
  );

  return res.rows[0].average ? parseFloat(res.rows[0].average) : 'N/A';
};
