import { Book } from '../book.interface';
import { connection } from '../../../connection';

export interface SelectBooksOptions {
  title?: string;
  author?: string;
  words?: string[];
}

const createTitleCondition = (title: string): string => {
  return `title LIKE '%${title}%'`;
};

const createAuthorCondition = (author: string): string => {
  return `author LIKE '%${author}%'`;
};

const createWordsAppearanceCondition = (words: string[]): string => {
  return `
    book_id IN (
      SELECT book_id
      FROM word_appearance
      NATURAL JOIN word
      WHERE word IN (${words.map((word) => `'${word}'`).join(', ')})
      GROUP BY book_id
      HAVING count(DISTINCT word) = ${words.length}
    )
  `;
};

export const selectBooks = async (
  options: SelectBooksOptions
): Promise<Book[]> => {
  const conditions: string[] = [];
  if (options.title) conditions.push(createTitleCondition(options.title));
  if (options.author) conditions.push(createAuthorCondition(options.author));
  if (options.words && options.words.length)
    conditions.push(createWordsAppearanceCondition(options.words));

  let queryString = 'SELECT * FROM book';

  if (conditions.length) {
    queryString = [queryString, conditions.join(' AND ')].join(' WHERE ');
  }

  const res = await connection.query(queryString);

  return res.rows;
};
