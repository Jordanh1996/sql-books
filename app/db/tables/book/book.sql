CREATE TABLE IF NOT EXISTS book (
  book_id SERIAL,
  title VARCHAR(63),
  author VARCHAR(63),
  file_path VARCHAR(255) NOT NULL UNIQUE,
  release_date DATE,
  PRIMARY KEY (book_id)
)