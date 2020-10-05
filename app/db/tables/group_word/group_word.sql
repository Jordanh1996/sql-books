CREATE TABLE IF NOT EXISTS group_word (
  group_id INTEGER NOT NULL,
  word VARCHAR(63) NOT NULL,
  PRIMARY KEY (group_id, word),
  FOREIGN KEY (group_id) REFERENCES "group"(group_id)
    ON DELETE CASCADE
)