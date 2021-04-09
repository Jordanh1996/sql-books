import { getConnection } from '../connection';

export const dropTables = () => {
  return getConnection().query(
    `DROP TABLE IF EXISTS book, word, word_appearance, "group", group_word, phrase, phrase_word;`
  );
};
