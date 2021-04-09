import { GroupWithWords, Group } from '../group.interface';
import { connection } from '../../../connection';

export interface SelectGroupOptions {
  name: string;
  words?: string[];
}

export const selectGroupsWithWords = async (
  options: SelectGroupOptions
): Promise<GroupWithWords[]> => {
  const { rows } = await connection.query<{ word: string; word_id: number; group_id: number; name: string; }>(
    `SELECT g.group_id as group_id, name, gw.word_id AS word_id, w.word AS word
    FROM "group" g
    LEFT JOIN group_word gw ON g.group_id = gw.group_id
    LEFT JOIN word w ON w.word_id = gw.word_id`
  );

  return Object.values(
    rows.reduce((acc, cur) => {
      if (acc[cur.group_id]) {
        acc[cur.group_id].words.push(cur.word);
        acc[cur.group_id].words_ids.push(cur.word_id);
      } else {
        const { group_id, name, word, word_id } = cur;

        acc[cur.group_id] = { group_id, name, words: [word], words_ids: [word_id] };
      }

      return acc;
    }, {})
  );
};

export const selectGroups = async (): Promise<Group[]> => {
  const res = await connection.query(`SELECT * FROM "group"`);

  return res.rows;
};
