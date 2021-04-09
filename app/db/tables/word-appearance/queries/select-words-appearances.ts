import { getConnection } from '../../../connection';

export interface SelectWordsOptions {
  books?: number[];
  groups?: number[];
  line?: number;
  paragraph?: number;
  sentence?: number;
  offset?: number;
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
  line,
  paragraph,
  sentence,
  offset,
}: SelectWordsOptions): Promise<WordCount[]> => {
  const conditions = [];
  if (books) {
    conditions.push(createBooksCondition(books));
  }
  if (groups?.length) {
    conditions.push(createGroupsCondition(groups));
  }

  let queryString = 
    `SELECT COUNT(word) AS "count", word
    FROM word_appearance
    NATURAL JOIN word
    ${groups?.length ? 'JOIN group_word ON group_word.word_id = word.word_id' : ''}`;

  if (groups?.length)
    conditions.push(`group_id IN (${groups.join(', ')})`);
  if (typeof line === 'number')
    conditions.push(`line = ${line}`);
  if (typeof paragraph === 'number')
    conditions.push(`paragraph = ${paragraph}`);
  if (typeof sentence === 'number')
    conditions.push(`sentence = ${sentence}`);
  if (typeof offset === 'number')
    conditions.push(`"offset" = ${offset}`);

  if (conditions.length)
    queryString = [queryString, conditions.join(' AND ')].join(' WHERE ');

  queryString += ' GROUP BY word';

  const res = await getConnection().query(queryString);

  return res.rows.map((row) => ({ ...row, count: parseInt(row.count) }));
};

export const selectWordsAppearances = async ({
  words,
  options: { books, groups, line, paragraph, sentence, offset },
}: SelectWordsAppearancesOptions): Promise<WordAppearance[]> => {
  const conditions = [];
  if (books) {
    conditions.push(createBooksCondition(books));
  }

  let queryString =
    `SELECT word, line, "offset", file_path, title, paragraph, sentence
    FROM word_appearance 
    NATURAL JOIN book
    NATURAL JOIN word
    ${groups?.length ? 'JOIN group_word ON group_word.word_id = word.word_id' : ''}`;

  if (groups?.length)
    conditions.push(`group_id IN (${groups.join(', ')})`);
  if (typeof line === 'number')
    conditions.push(`line = ${line}`);
  if (typeof paragraph === 'number')
    conditions.push(`paragraph = ${paragraph}`);
  if (typeof sentence === 'number')
    conditions.push(`sentence = ${sentence}`);
  if (typeof offset === 'number')
    conditions.push(`"offset" = ${offset}`);

  conditions.push(`word IN (${words.map((word) => `'${word}'`).join(', ')})`);

  queryString = [queryString, conditions.join(' AND ')].join(' WHERE ');

  return (await getConnection().query(queryString)).rows;
};

export const countWords = async (books: number[], distinct?: string) => {
  let queryString = `SELECT count(${distinct ? `DISTINCT ${distinct}` : '*'})
  FROM word_appearance wa
  JOIN word w ON w.word_id = wa.word_id`;

  if (books.length) {
    queryString += ` WHERE book_id IN (${books.join(', ')})`;
  }

  const res = await getConnection().query(queryString);

  return res.rows[0].count;
};

export const countMaxColumn = async (
  books: number[],
  columnName: string
): Promise<number> => {
  const res = await getConnection().query(`
    SELECT SUM(max) FROM (
      SELECT MAX("${columnName}")
      FROM word_appearance wa
      JOIN word w ON w.word_id = wa.word_id
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
  const res = await getConnection().query(`
    SELECT AVG(count) FROM (
      SELECT COUNT(*)
      FROM word_appearance wa
      JOIN word w ON w.word_id = wa.word_id
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
  const res = await getConnection().query(`
    SELECT AVG(sum) FROM (
      SELECT SUM(LENGTH(w.word))
      FROM word_appearance wa
      JOIN word w ON w.word_id = wa.word_id
      ${books.length ? `WHERE book_id IN (${books.join(', ')})` : ''}
      GROUP BY book_id${groupBy ? `, "${groupBy}"` : ''}
    ) AS sub
  `);

  return res.rows[0].avg ? parseFloat(res.rows[0].avg) : 'N/A';
};

export const sumLetters = async (books: number[]): Promise<number> => {
  const res = await getConnection().query(
    `SELECT SUM(LENGTH(w.word)) 
    FROM word_appearance wa
    JOIN word w ON w.word_id = wa.word_id
    ${books.length ? `WHERE book_id IN (${books.join(', ')})` : ''}`
  );
  return parseFloat(res.rows[0].sum) || 0;
};
