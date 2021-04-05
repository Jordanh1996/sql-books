CREATE TABLE IF NOT EXISTS group_word (
  group_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  PRIMARY KEY (group_id, word_id),
  FOREIGN KEY (word_id) REFERENCES word(word_id),
  FOREIGN KEY (group_id) REFERENCES "group"(group_id)
    ON DELETE CASCADE
)