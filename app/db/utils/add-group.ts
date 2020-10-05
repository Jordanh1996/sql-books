import _ from 'lodash';
import { connection } from '../connection';
import { insertGroup } from '../tables/group/queries/insert-group';
import { insertGroupWords } from '../tables/group_word/queries/insert-group-words';

export interface AddGroupParams {
  name: string;
  words: string[];
}

export const addGroup = async ({
  name,
  words,
}: AddGroupParams): Promise<void> => {
  try {
    await connection.query('BEGIN');
    const group_id = await insertGroup({ name });
    if (words.length) {
      await insertGroupWords(group_id, words);
    }

    await connection.query('COMMIT');
  } catch (e) {
    await connection.query('ROLLBACK');
    throw e;
  }
};
