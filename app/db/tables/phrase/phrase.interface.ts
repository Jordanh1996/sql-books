export interface NewPhrase {
  phrase: string;
}

export interface Phrase extends NewPhrase {
  phrase_id: number;
  word_count: number;
}
