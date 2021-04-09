import { Book, NewBook } from '../book.interface';
import { getConnection } from '../../../connection';

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

  const res = await getConnection().query(
    `INSERT INTO book
    (title, author, file_path, release_date)
    VALUES${valuesTemplate} RETURNING book_id`,
    values
  );

  return res.rows;
};

export const insertBooksWithIds = async (
  books: Book[]
) => {
  let offset = 1;
  const valuesTemplate = books.map(
    () => ` ($${offset++}, $${offset++}, $${offset++}, $${offset++}, $${offset++})`
  );
  const values = books.reduce(
    (acc, { book_id, title, author, file_path, release_date }) => [
      ...acc,
      book_id,
      title,
      author,
      file_path,
      release_date,
    ],
    []
  );

  const res = await getConnection().query(
    `INSERT INTO book
    (book_id, title, author, file_path, release_date)
    VALUES${valuesTemplate}`,
    values
  );

  return res.rows;
};
