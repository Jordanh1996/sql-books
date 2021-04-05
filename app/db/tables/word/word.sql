CREATE TABLE IF NOT EXISTS word (
  word_id SERIAL,
  word VARCHAR(63) NOT NULL,
  PRIMARY KEY (word_id),
  CONSTRAINT unique_word UNIQUE ("word")
)