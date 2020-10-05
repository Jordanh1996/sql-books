import React from 'react';
import clsx from 'clsx';
import styles from './PhraseList.css';
import { PhraseTable } from './PhraseTable';
import { PhraseFilter } from '../phrase-filter/PhraseFilter';
import { Phrase } from '../../../db/tables/phrase/phrase.interface';

export interface PhraseListProps {
  getPhrases: () => {};
  onSearchClick: (phrase: Phrase) => void;
  removePhrase: (phrase: Phrase) => void;
  phrases: Phrase[];
  loading: boolean;
}

export const PhraseList = ({
  getPhrases,
  onSearchClick,
  removePhrase,
  phrases,
  loading,
}: PhraseListProps) => {
  return (
    <div className={clsx('column', 'expand')}>
      <PhraseFilter onFilterClick={getPhrases} />
      <div className={clsx(styles.tableWrapper)}>
        <PhraseTable
          phrases={phrases}
          loading={loading}
          onSearchClick={onSearchClick}
          onDelete={removePhrase}
        />
      </div>
    </div>
  );
};
