import { connection } from '../../../connection';
import { Word } from '../../word/word.interface';

export const insertGroupWords = async (
  groupId: number,
  wordsIds: Word['word_id'][]
): Promise<void> => {
  let offset = 1;
  const valuesTemplate = wordsIds.map(() => ` ($${offset++}, $${offset++})`);
  const values = wordsIds.map((word_id) => [groupId, word_id]).flat();

  await connection.query(
    `INSERT INTO group_word (group_id, word_id)
      VALUES${valuesTemplate};`,
    values
  );
};
