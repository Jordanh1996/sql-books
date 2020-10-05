import React, { useMemo, useCallback, useState } from 'react';
import { promises as fs } from 'fs';
import styles from './MatchTable.css';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import { PhraseMatch } from '../../../db/tables/phrase/queries/select-phrases';
import { VirtualizedTable } from '../../common/VirtualizedTable';
import { BookModal, OpenedBook } from '../../common/BookModal';

export interface MatchTableProps {
  matches: PhraseMatch[];
}

export const MatchTable = ({ matches }: MatchTableProps) => {
  const [opened, setOpened] = useState<OpenedBook>({
    open: false,
    title: null,
    content: null,
  });

  const onMatchClick = useCallback(
    async (match: PhraseMatch) => {
      const content = await fs.readFile(match.file_path, 'utf8');
      const matchesInBook = matches
        .filter((el) => el.book_id === match.book_id)
        .map((match) => ({ start: match.start_offset, end: match.end_offset }));
      const matchIndex = matchesInBook.findIndex(
        (el) => el.start === match.start_offset
      );

      setOpened({
        open: true,
        title: `${match.title} - ${match.author}`,
        content,
        firstMatchIndex: matchIndex,
        matches: matchesInBook,
      });
    },
    [matches, setOpened]
  );

  const toggleBookModal = useCallback(() => {
    setOpened({ ...opened, open: !opened.open });
  }, [opened, setOpened]);

  const matchesWithActions = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        actions: (
          <IconButton color="primary" onClick={() => onMatchClick(match)}>
            <DescriptionIcon />
          </IconButton>
        ),
      })),
    [matches]
  );

  if (matches.length) {
    return (
      <>
        <Paper className={styles.container}>
          <VirtualizedTable
            rowCount={matchesWithActions.length}
            rowGetter={({ index }) => matchesWithActions[index]}
            columns={[
              {
                label: 'Phrase',
                dataKey: 'phrase',
              },
              {
                label: 'Title',
                dataKey: 'title',
              },
              {
                label: 'Paragraph',
                dataKey: 'paragraph',
              },
              {
                label: 'Sentence',
                dataKey: 'sentence',
              },
              {
                label: 'Actions',
                dataKey: 'actions',
              },
            ]}
          />
        </Paper>
        <BookModal
          open={opened.open}
          onClose={toggleBookModal}
          title={opened.title}
          content={opened.content}
          matches={opened.matches}
          firstMatchIndex={opened.firstMatchIndex}
        />
      </>
    );
  }

  return null;
};
