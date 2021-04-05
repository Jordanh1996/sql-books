CREATE TABLE IF NOT EXISTS phrase_word (
  phrase_id SERIAL,
  word_index INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  FOREIGN KEY (phrase_id) REFERENCES phrase(phrase_id)
    ON DELETE CASCADE,
  FOREIGN KEY (word_id) REFERENCES word(word_id),
  PRIMARY KEY (phrase_id, word_index)
)