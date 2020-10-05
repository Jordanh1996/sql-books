import React from 'react';
import clsx from 'clsx';
import { Book } from '../../../db/tables/book/book.interface';
import { BookTable } from './BookTable';
import { BookFilter } from './book-filter/BookFilter';

export interface BookListProps {
  removeBook: (book: Book) => void;
  onOpenBook?: (book: Book) => void;
  getBooks: () => {};
  books: Book[];
  loading: boolean;
}

export const BookList = ({
  getBooks,
  removeBook,
  onOpenBook,
  books,
  loading,
}: BookListProps) => {
  return (
    <div className={clsx('column', 'expand')}>
      <BookFilter onFilterClick={getBooks} />
      <BookTable
        books={books}
        loading={loading}
        onDelete={removeBook}
        onOpenBook={onOpenBook}
      />
    </div>
  );
};
