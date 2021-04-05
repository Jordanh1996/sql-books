import { connection } from '../../../connection';
import { Phrase, PhraseWithWords } from '../phrase.interface';

export const selectPhrases = async (): Promise<PhraseWithWords[]> => {
  const { rows } = await connection.query<Phrase & { word: string; word_index: number }>(
    `SELECT 
      phrase.phrase_id AS phrase_id,
      word_count,
      word_index,
      word
    FROM phrase
    NATURAL JOIN phrase_word
    NATURAL JOIN word`
  );

  return Object.values(
    rows.reduce((acc, cur) => {
      if (!acc[cur.phrase_id]) {
        acc[cur.phrase_id] = {
          phrase_id: cur.phrase_id,
          word_count: cur.word_count,
          phrase: [],
        };
      }

      acc[cur.phrase_id].phrase[cur.word_index] = cur.word;

      return acc;
    }, {})
  ).map((phrase: any) => {
    phrase.phrase = phrase.phrase.join(' ');

    return phrase;
  });
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
    SELECT phrase_id, book_id, title, author, paragraph, sentence, file_path, MIN("offset") AS start_offset, MAX(end_offset) AS end_offset FROM (
      SELECT
        book.book_id AS book_id, 
        file_path,
        title,
        author,
        sentence, 
        paragraph,
        phrase.phrase_id AS phrase_id, 
        phrase_word.word_index AS phrase_index, 
        "offset",
        "offset" + LENGTH(word.word) AS end_offset,
        word_count,
        word_appearance.index - phrase_word.word_index AS seq
      FROM word
      JOIN word_appearance ON word.word_id = word_appearance.word_id
      JOIN phrase_word ON word.word_id = phrase_word.word_id
      JOIN phrase ON phrase.phrase_id = phrase_word.phrase_id
      JOIN book ON word_appearance.book_id = book.book_id
      WHERE phrase.phrase_id = ${phrase_id}
    ) AS sub
    GROUP BY book_id, file_path, title, author, seq, sentence, paragraph, word_count, phrase_id
    HAVING count(DISTINCT phrase_index) = word_count
  `);

  return res.rows;
};
