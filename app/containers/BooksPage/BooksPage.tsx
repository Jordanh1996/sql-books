import React, { useState, useCallback, useEffect } from 'react';
import { promises as fs } from 'fs';
import clsx from 'clsx';
import styles from './BooksPage.css';
import { BookList } from '../../components/books/book-list/BookList';
import { BookForm } from '../../components/books/book-form/BookForm';
import { Book } from '../../db/tables/book/book.interface';
import {
  selectBooks,
  SelectBooksOptions,
} from '../../db/tables/book/queries/select-books';
import { deleteBook } from '../../db/tables/book/queries/delete-book';
import { BookModal, OpenedBook } from '../../components/common/BookModal';

export const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [lastFilter, setLastFilter] = useState<SelectBooksOptions>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [openedBook, setOpenedBook] = useState<OpenedBook>({
    open: false,
    title: null,
    content: null,
  });

  const toggleBookModal = useCallback(() => {
    setOpenedBook({ ...openedBook, open: !openedBook.open });
  }, [openedBook, setOpenedBook]);

  const openBook = useCallback(
    async (book: Book) => {
      const content = await fs.readFile(book.file_path, 'utf8');
      setOpenedBook({
        open: true,
        title: `${book.title} - ${book.author}`,
        content,
      });
    },
    [setOpenedBook]
  );

  const getBooks = useCallback(
    async (options: SelectBooksOptions = {}) => {
      setLastFilter(options);
      setLoading(true);
      const books = await selectBooks(options);
      setBooks(books);
      setLoading(false);
    },
    [setLoading, setBooks]
  );

  const removeBook = useCallback(
    (book: Book) => {
      deleteBook(book.book_id);
      setBooks(books.filter((cur) => cur.book_id !== book.book_id));
    },
    [setBooks, books]
  );

  useEffect(() => {
    getBooks({});
  }, []);

  return (
    <div className={clsx('column', 'align-center', 'full-page-height')}>
      <div className={clsx('justify-center', styles.formWrapper)}>
        <BookForm onAddBook={() => getBooks(lastFilter)} />
      </div>
      <BookList
        getBooks={getBooks}
        removeBook={removeBook}
        onOpenBook={openBook}
        loading={loading}
        books={books}
      />
      <BookModal
        open={openedBook.open}
        onClose={toggleBookModal}
        title={openedBook.title}
        content={openedBook.content}
      />
    </div>
  );
};
