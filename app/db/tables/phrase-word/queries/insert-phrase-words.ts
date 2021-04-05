import { connection } from '../../../connection';
import { Word } from '../../word/word.interface';

export const insertPhraseWords = async (
  phraseId: number,
  wordsIds: Word['word_id'][]
): Promise<void> => {
  let offset = 1;
  const valuesTemplate = wordsIds.map(() => ` ($${offset++}, $${offset++}, $${offset++})`);
  const values = wordsIds.map((word_id, i) => [phraseId, word_id, i]).flat();

  await connection.query(
    `INSERT INTO phrase_word (phrase_id, word_id, word_index)
    VALUES${valuesTemplate};`,
    values
  );
};
