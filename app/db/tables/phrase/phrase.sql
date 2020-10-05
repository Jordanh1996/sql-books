CREATE TABLE IF NOT EXISTS phrase (
  phrase_id SERIAL,
  phrase VARCHAR(255) NOT NULL UNIQUE,
  word_count INTEGER GENERATED ALWAYS AS (CHAR_LENGTH(phrase) - CHAR_LENGTH(REPLACE(phrase, ' ', '')) + 1) STORED,
  PRIMARY KEY (phrase_id),
  CONSTRAINT valid_sentence CHECK (phrase ~ '^[a-z]+( [a-z]+)+$')
)