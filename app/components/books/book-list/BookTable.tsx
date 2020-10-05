import React, { useMemo } from 'react';
import moment from 'moment';
import styles from './BookTable.css';
import { Book } from '../../../db/tables/book/book.interface';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DescriptionIcon from '@material-ui/icons/Description';
import { VirtualizedTable } from '../../common/VirtualizedTable';

export interface BookTableProps {
  books: Book[];
  loading: boolean;
  onDelete: (book: Book) => void;
  onOpenBook?: (book: Book) => void;
}

export const BookTable = ({
  books,
  loading,
  onDelete = () => {},
  onOpenBook = () => {},
}: BookTableProps) => {
  const booksWithActions = useMemo(
    () =>
      books.map((book) => ({
        ...book,
        release_date: moment(book.release_date).format('MMMM Do YYYY'),
        actions: (
          <>
            <IconButton
              color="primary"
              onClick={() => onOpenBook(book)}
              key="read"
            >
              <DescriptionIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => onDelete(book)}
              key="delete"
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      })),
    [books]
  );

  if (loading) {
    return <CircularProgress size={80} />;
  } else {
    return (
      <Paper className={styles.container}>
        <VirtualizedTable
          rowCount={booksWithActions.length}
          rowGetter={({ index }) => booksWithActions[index]}
          columns={[
            {
              label: 'Title',
              dataKey: 'title',
              flexGrow: 2,
            },
            {
              label: 'Author',
              dataKey: 'author',
              flexGrow: 2,
            },
            {
              label: 'Release Date',
              dataKey: 'release_date',
              flexGrow: 0.5,
            },
            {
              label: 'File System Path',
              dataKey: 'file_path',
              flexGrow: 3.5,
            },
            {
              label: 'Actions',
              dataKey: 'actions',
              flexGrow: 0.5,
            },
          ]}
        />
      </Paper>
    );
  }
};
