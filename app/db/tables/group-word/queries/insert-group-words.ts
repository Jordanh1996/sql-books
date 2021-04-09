import { getConnection } from '../../../connection';
import { Word } from '../../word/word.interface';
import { GroupWord } from '../group-word.interface';

export const insertGroupWords = async (
  groupId: number,
  wordsIds: Word['word_id'][]
): Promise<void> => {
  let offset = 1;
  const valuesTemplate = wordsIds.map(() => ` ($${offset++}, $${offset++})`);
  const values = wordsIds.map((word_id) => [groupId, word_id]).flat();

  await getConnection().query(
    `INSERT INTO group_word (group_id, word_id)
      VALUES${valuesTemplate};`,
    values
  );
};

export const insertGroupsWords = async (groupsWords: GroupWord[]) => {
  let offset = 1;
  const valuesTemplate = groupsWords.map(() => ` ($${offset++}, $${offset++})`);
  const values = groupsWords.map(({ group_id, word_id }) => [group_id, word_id]).flat();

  await getConnection().query(
    `INSERT INTO group_word (group_id, word_id)
      VALUES${valuesTemplate};`,
    values
  );
}
