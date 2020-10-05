import { connection } from '../../../connection';

export const deleteBook = async (id: number): Promise<void> => {
  await connection.query(
    `DELETE FROM book CASCADE
    WHERE book_id = $1`,
    [id]
  );
};
