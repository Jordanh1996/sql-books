import React, { useMemo, useCallback, useState } from 'react';
import { promises as fs } from 'fs';
import styles from './WordsTable.css';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { VirtualizedTable } from '../../common/VirtualizedTable';
import { WordAppearance } from '../../../db/tables/word/queries/select-words';
import DescriptionIcon from '@material-ui/icons/Description';
import { OpenedBook, BookModal } from '../../common/BookModal';

export interface WordTableProps {
  words: WordAppearance[];
}

export const WordTable = ({ words }: WordTableProps) => {
  const [opened, setOpened] = useState<OpenedBook>({
    open: false,
    title: null,
    content: null,
  });

  const onMatchClick = useCallback(
    async (word: WordAppearance) => {
      const content = await fs.readFile(word.file_path, 'utf8');
      const matchesInBook = words
        .filter(
          (el) => el.file_path === word.file_path && el.word === word.word
        )
        .map(({ offset, word }) => ({
          start: offset,
          end: offset + word.length,
        }));
      const matchIndex = matchesInBook.findIndex(
        (el) => el.start === word.offset
      );

      setOpened({
        open: true,
        title: word.title,
        content,
        firstMatchIndex: matchIndex,
        matches: matchesInBook,
      });
    },
    [words, setOpened]
  );

  const toggleBookModal = useCallback(() => {
    setOpened({ ...opened, open: !opened.open });
  }, [opened, setOpened]);

  const wordsWithActions = useMemo(
    () =>
      words.map((word) => ({
        ...word,
        actions: (
          <IconButton color="primary" onClick={() => onMatchClick(word)}>
            <DescriptionIcon />
          </IconButton>
        ),
      })),
    [words]
  );

  return (
    <>
      <Paper className={styles.container}>
        <VirtualizedTable
          rowCount={wordsWithActions.length}
          rowGetter={({ index }) => wordsWithActions[index]}
          columns={[
            {
              label: 'Word',
              dataKey: 'word',
            },
            {
              label: 'Title',
              dataKey: 'title',
              flexGrow: 2,
            },
            {
              label: 'Line',
              dataKey: 'line',
            },
            {
              label: 'Offset',
              dataKey: 'offset',
            },
            {
              label: 'File Path',
              dataKey: 'file_path',
              flexGrow: 3,
            },
            {
              label: 'actions',
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
};
