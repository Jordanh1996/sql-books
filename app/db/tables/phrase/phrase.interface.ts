export interface Phrase {
  phrase_id: number;
  word_count: number;
}

export interface PhraseWithWords extends Phrase {
  phrase: string;
}
