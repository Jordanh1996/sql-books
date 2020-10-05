CREATE TABLE IF NOT EXISTS word (
  word VARCHAR(63) NOT NULL,
  book_id INTEGER NOT NULL,
  index INTEGER NOT NULL,
  "offset" INTEGER NOT NULL,
  sentence INTEGER NOT NULL,
  line INTEGER NOT NULL,
  paragraph INTEGER NOT NULL,
  PRIMARY KEY(word, book_id, index),
  FOREIGN KEY (book_id) REFERENCES book(book_id)
    ON DELETE CASCADE
)