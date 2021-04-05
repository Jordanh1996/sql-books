import React, { useMemo } from 'react';
import styles from './PhraseTable.css';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { Phrase } from '../../../db/tables/phrase/phrase.interface';
import SearchIcon from '@material-ui/icons/Search';
import { VirtualizedTable } from '../../common/VirtualizedTable';

export interface PhraseTableProps {
  phrases: Phrase[];
  loading: boolean;
  onSearchClick: (phrase: Phrase) => void;
  onDelete: (phrase: Phrase) => void;
}

export const PhraseTable = ({
  phrases,
  loading,
  onSearchClick,
  onDelete = () => {},
}: PhraseTableProps) => {
  const phrasesWithActions = useMemo(
    () =>
      phrases.map((phrase) => ({
        ...phrase,
        actions: (
          <>
            <IconButton
              color="primary"
              onClick={() => onSearchClick(phrase)}
              key="search"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => onDelete(phrase)}
              key="delete"
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      })),
    [phrases]
  );

  if (loading) {
    return <CircularProgress size={80} />;
  } else {
    return (
      <Paper className={styles.container}>
        <VirtualizedTable
          rowCount={phrasesWithActions.length}
          rowGetter={({ index }) => phrasesWithActions[index]}
          columns={[
            {
              label: 'Phrase',
              dataKey: 'phrase',
            },
            {
              label: 'Words Count',
              dataKey: 'word_count',
            },
            {
              label: 'Actions',
              dataKey: 'actions',
            },
          ]}
        />
      </Paper>
    );
  }
};
