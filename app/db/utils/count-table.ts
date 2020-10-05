import { connection } from '../connection';

export const countTable = async (tableName: string): Promise<number> => {
  const res = await connection.query(
    `SELECT COUNT(*) AS count FROM "${tableName}"`
  );

  return res.rows[0].count;
};
