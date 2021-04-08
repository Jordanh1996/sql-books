import { connection } from '../connection';

export const dropTables = () => {
  return connection.query(
    `DROP TABLE book, word, word_appearance, "group", group_word, phrase, phrase_word;`
  );
};