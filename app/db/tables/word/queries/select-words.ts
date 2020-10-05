import { connection } from '../../../connection';

export interface SelectWordsOptions {
  books?: number[];
  groups?: number[];
}

export interface SelectWordsAppearancesOptions {
  words: string[];
  options: SelectWordsOptions;
}

export interface WordCount {
  word: string;
  count: number;
}

export interface WordAppearance {
  word: string;
  line: number;
  offset: number;
  file_path: string;
  title: string;
}

const createGroupsCondition = (groups: number[]): string => {
  return `word IN (SELECT word FROM group_word WHERE group_id IN (${groups.join(
    ', '
  )}))`;
};

const createBooksCondition = (books: number[]): string => {
  return `book_id IN (${books.join(', ')})`;
};

export const selectWordsCount = async ({
  books,
  groups,
}: SelectWordsOptions): Promise<WordCount[]> => {
  const conditions = [];
  if (books) {
    conditions.push(createBooksCondition(books));
  }
  if (groups) {
    conditions.push(createGroupsCondition(groups));
  }

  let queryString = 'SELECT COUNT(word) AS "count", word FROM word';

  if (conditions.length) {
    queryString = [queryString, conditions.join(' AND ')].join(' WHERE ');
  }

  queryString += ' GROUP BY word';

  const res = await connection.query(queryString);

  return res.rows.map((row) => ({ ...row, count: parseInt(row.count) }));
};

export const selectWordsAppearances = async ({
  words,
  options: { books },
}: SelectWordsAppearancesOptions): Promise<WordAppearance[]> => {
  const conditions = [];
  if (books) {
    conditions.push(createBooksCondition(books));
  }

  let queryString =
    'SELECT word, line, "offset", file_path, word, title FROM word NATURAL JOIN book';

  conditions.push(`word IN (${words.map((word) => `'${word}'`).join(', ')})`);

  queryString = [queryString, conditions.join(' AND ')].join(' WHERE ');

  return (await connection.query(queryString)).rows;
};

export const countWords = async (books: number[], distinct?: string) => {
  let queryString = `SELECT count(${
    distinct ? `DISTINCT ${distinct}` : '*'
  }) FROM word`;

  if (books.length) {
    queryString += ` WHERE book_id IN (${books.join(', ')})`;
  }

  const res = await connection.query(queryString);

  return res.rows[0].count;
};

export const countMaxColumn = async (
  books: number[],
  columnName: string
): Promise<number> => {
  const res = await connection.query(`
    SELECT SUM(max) FROM (
      SELECT MAX("${columnName}")
      FROM word
      ${books.length ? `WHERE book_id IN (${books.join(', ')})` : ''}
      GROUP BY book_id
    ) AS sub
  `);

  return parseFloat(res.rows[0].sum) || 0;
};

export const averageWords = async (
  books: number[],
  groupBy: string
): Promise<string | number> => {
  const res = await connection.query(`
    SELECT AVG(count) FROM (
      SELECT COUNT(*)
      FROM word
      ${books.length ? `WHERE book_id IN (${books.join(', ')})` : ''}
      GROUP BY book_id, ${groupBy}
    ) AS sub
  `);

  return res.rows[0].avg ? parseFloat(res.rows[0].avg) : 'N/A';
};

export const averageLetters = async (
  books: number[],
  groupBy?: string
): Promise<string | number> => {
  const res = await connection.query(`
    SELECT AVG(sum) FROM (
      SELECT SUM(LENGTH(word))
      FROM word
      ${books.length ? `WHERE book_id IN (${books.join(', ')})` : ''}
      GROUP BY book_id${groupBy ? `, "${groupBy}"` : ''}
    ) AS sub
  `);

  return res.rows[0].avg ? parseFloat(res.rows[0].avg) : 'N/A';
};

export const sumLetters = async (books: number[]): Promise<number> => {
  const res = await connection.query(
    `SELECT SUM(LENGTH(word)) FROM word ${
      books.length ? `WHERE book_id IN (${books.join(', ')})` : ''
    }`
  );
  return parseFloat(res.rows[0].sum) || 0;
};
