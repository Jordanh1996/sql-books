import _ from 'lodash';
import { connection } from '../connection';
import { insertPhraseWords } from '../tables/phrase-word/queries/insert-phrase-words';
import { insertPhrase } from '../tables/phrase/queries/insert-phrase';
import { selectWords } from '../tables/word/queries/select-words';
import { upsertWords } from '../tables/word/queries/upsert-words';

export interface AddPhraseParams {
  phrase: string;
}

export const addPhrase = async ({
  phrase,
}: AddPhraseParams): Promise<void> => {
  if (
    !phrase.length
    || !phrase.match(/^[a-z]+( [a-z]+)+$/)
  ) return;

  const wordsStrings = phrase.split(' ');

  try {
    await connection.query('BEGIN');

    // INSERT the group
    const phrase_id = await insertPhrase({ word_count: wordsStrings.length });

    // INSERT the words if they don't exist
    await upsertWords(wordsStrings);

    // SELECT the group word for their word_ids
    const words = _.keyBy(
      await selectWords(wordsStrings),
      'word'
    );

    await insertPhraseWords(
      phrase_id,
      wordsStrings.map(word => words[word].word_id)
    );

    await connection.query('COMMIT');
  } catch (e) {
    await connection.query('ROLLBACK');
    throw e;
  }
};
