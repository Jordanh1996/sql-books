import _ from 'lodash';
import { connection } from '../connection';
import { insertGroup } from '../tables/group/queries/insert-group';
import { insertGroupWords } from '../tables/group-word/queries/insert-group-words';
import { selectWords } from '../tables/word/queries/select-words';
import { upsertWords } from '../tables/word/queries/upsert-words';

export interface AddGroupParams {
  name: string;
  words: string[];
}

export const addGroup = async ({
  name,
  words: wordsStrings,
}: AddGroupParams): Promise<void> => {
  if (!wordsStrings.length) return;

  try {
    await connection.query('BEGIN');

    // INSERT the group
    const group_id = await insertGroup({ name });

    // INSERT the words if they don't exist
    await upsertWords(wordsStrings);

    // SELECT the group word for their word_ids
    const words = _.keyBy(
      await selectWords(wordsStrings),
      'word'
    );

    await insertGroupWords(
      group_id,
      wordsStrings.map(word => words[word].word_id)
    );

    await connection.query('COMMIT');
  } catch (e) {
    await connection.query('ROLLBACK');
    throw e;
  }
};
