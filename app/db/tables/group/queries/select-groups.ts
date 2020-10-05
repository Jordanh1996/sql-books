import { GroupWithWords, Group } from '../group.interface';
import { connection } from '../../../connection';

export interface SelectGroupOptions {
  // title?: string;
  // author?: string;
  // words?: string[];
}

// const createTitleCondition = (title: string) => mysql.format('title LIKE %?%', [title]);

// const createAuthorCondition = (author: string) => mysql.format('author LIKE %?%', [author]);

// const createWordsAppearanceCondition = (words: string[]) => {

// }

// const createConditions = (selectBooksOptions): string[] => {

// };

export const selectGroupsWithWords = async (
  options: SelectGroupOptions
): Promise<GroupWithWords[]> => {
  const res = await connection.query(
    `SELECT g.group_id as group_id, name, word
    FROM "group" g
    LEFT JOIN group_word gw ON g.group_id=gw.group_id`
  );

  const rows: { word: string; group_id: number; name: string }[] = res.rows;

  return Object.values(
    rows.reduce((acc, cur) => {
      if (acc[cur.group_id]) {
        acc[cur.group_id].words.push(cur.word);
      } else {
        const { group_id, name, word } = cur;
        acc[cur.group_id] = { group_id, name, words: word ? [word] : [] };
      }

      return acc;
    }, {})
  );
};

export const selectGroups = async (): Promise<Group[]> => {
  const res = await connection.query(`SELECT * FROM "group"`);

  return res.rows;
};
