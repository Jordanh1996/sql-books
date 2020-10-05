import React from 'react';
import styles from './WordList.css';
import Chip from '@material-ui/core/Chip';

export interface WordListProps {
  words: string[];
  onDelete?: (word: string) => void;
}

export const WordList = ({ words, onDelete = () => {} }: WordListProps) => {
  return (
    <>
      {words.map((word) => (
        <Chip
          className={styles.chip}
          key={word}
          label={word}
          onDelete={() => onDelete(word)}
        />
      ))}
    </>
  );
};
