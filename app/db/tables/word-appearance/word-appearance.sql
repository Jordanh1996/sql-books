CREATE TABLE IF NOT EXISTS word_appearance (
  word_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  index INTEGER NOT NULL,
  "offset" INTEGER NOT NULL,
  sentence INTEGER NOT NULL,
  line INTEGER NOT NULL,
  paragraph INTEGER NOT NULL,
  PRIMARY KEY(word_id, book_id, index),
  FOREIGN KEY (word_id) REFERENCES word(word_id),
  FOREIGN KEY (book_id) REFERENCES book(book_id)
    ON DELETE CASCADE
)