import { NewBook } from '../book.interface';
import { connection } from '../../../connection';

export const insertBooks = async (
  books: NewBook[]
): Promise<{ book_id: number }[]> => {
  let offset = 1;
  const valuesTemplate = books.map(
    () => ` ($${offset++}, $${offset++}, $${offset++}, $${offset++})`
  );
  const values = books.reduce(
    (acc, { title, author, file_path, release_date }) => [
      ...acc,
      title,
      author,
      file_path,
      release_date,
    ],
    []
  );

  const res = await connection.query(
    `INSERT INTO book (title, author, file_path, release_date)
    VALUES${valuesTemplate} RETURNING book_id`,
    values
  );

  return res.rows;
};