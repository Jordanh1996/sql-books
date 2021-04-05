export interface NewGroup {
  name: string;
}

export interface Group extends NewGroup {
  group_id: number;
}

export interface GroupWithWords extends Group {
  words: string[];
  words_ids: number[];
}
