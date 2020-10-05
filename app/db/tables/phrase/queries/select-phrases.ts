import { connection } from '../../../connection';
import { Phrase } from '../phrase.interface';

export interface SelectPhraseOptions {
  phrase?: string;
}

const createPhraseCondition = (phrase: string) =>
  ` WHERE phrase LIKE '%${phrase}%'`;

export const selectPhrases = async (
  options: SelectPhraseOptions
): Promise<Phrase[]> => {
  let queryString = `SELECT * FROM phrase`;

  if (options.phrase) queryString += createPhraseCondition(options.phrase);

  const res = await connection.query(queryString);

  return res.rows;
};

export interface PhraseMatch {
  book_id: number;
  title: string;
  author: string;
  paragraph: number;
  sentence: number;
  file_path: string;
  phrase: string;
  start_offset: number;
  end_offset: number;
}

export const findPhrase = async (phrase_id: number): Promise<PhraseMatch[]> => {
  const res = await connection.query(`
    SELECT book_id, title, author, paragraph, sentence, file_path, phrase, MIN("offset") AS start_offset, (MAX("offset") + LENGTH(regexp_replace(phrase, '^.* ', ''))) AS end_offset FROM (
      SELECT
        book.book_id AS book_id, 
        file_path,
        title,
        author,
        sentence, 
        paragraph,
        phrase.phrase_id AS phrase_id, 
        phrase_word.index AS phrase_index, 
        "offset", 
        word_count,
        phrase.phrase AS phrase,
        word.index - phrase_word.index AS seq
      FROM word
      JOIN phrase_word ON word.word = phrase_word.word
      JOIN phrase ON phrase.phrase_id = phrase_word.phrase_id
      JOIN book ON word.book_id = book.book_id
      WHERE phrase.phrase_id = ${phrase_id}
    ) as sub
    GROUP BY book_id, file_path, title, author, seq, sentence, paragraph, word_count, phrase
    HAVING count(DISTINCT phrase_index) = word_count
  `);

  return res.rows;
};
