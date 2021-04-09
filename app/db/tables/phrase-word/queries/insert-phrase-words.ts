import { getConnection } from '../../../connection';
import { Word } from '../../word/word.interface';
import { PhraseWord } from '../phrase-word.interface';

export const insertPhraseWords = async (
  phraseId: number,
  wordsIds: Word['word_id'][]
): Promise<void> => {
  let offset = 1;
  const valuesTemplate = wordsIds.map(() => ` ($${offset++}, $${offset++}, $${offset++})`);
  const values = wordsIds.map((word_id, i) => [phraseId, word_id, i]).flat();

  await getConnection().query(
    `INSERT INTO phrase_word (phrase_id, word_id, word_index)
    VALUES${valuesTemplate};`,
    values
  );
};

export const insertPhrasesWords = async (phrasesWords: PhraseWord[]) => {
  let offset = 1;
  const valuesTemplate = phrasesWords.map(() => ` ($${offset++}, $${offset++}, $${offset++})`);
  const values = phrasesWords.map(({ phrase_id, word_index, word_id }) => [phrase_id, word_index, word_id]).flat();

  await getConnection().query(
    `INSERT INTO phrase_word (phrase_id, word_index, word_id)
      VALUES${valuesTemplate};`,
    values
  );
};
