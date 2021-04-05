import React, { useState, useEffect, useCallback } from 'react';
import styles from './GeneralStatistics.css';
import { BoxList } from '../../common/BoxList';
import { countTable } from '../../../db/utils/count-table';
import { avgTable } from '../../../db/utils/avg-table';
import { displayDecimal } from '../../../utils/math/afterDotNum';

export const GeneralStatistics = () => {
  const [bookCount, setBooksCount] = useState<string | number>('Loading...');
  const [groupCount, setGroupCount] = useState<string | number>('Loading...');
  const [phraseCount, setPhraseCount] = useState<string | number>('Loading...');
  const [groupAvg, setGroupAvg] = useState<string | number>('Loading...');
  const [phraseAvg, setPhraseAvg] = useState<string | number>('Loading...');
  const [wordAvg, setWordAvg] = useState<string | number>('Loading...');

  const getGeneralStatistics = useCallback(async () => {
    countTable('book').then(setBooksCount);
    countTable('group').then(setGroupCount);
    countTable('phrase').then(setPhraseCount);
    avgTable('group_word', 'group_id').then(setGroupAvg);
    avgTable('phrase_word', 'phrase_id').then(setPhraseAvg);
    avgTable('word_appearance', 'book_id').then(setWordAvg);
  }, []);

  useEffect(() => {
    getGeneralStatistics();
  }, []);

  return (
    <BoxList
      title="General Statistics"
      list={[
        { label: 'Books Count:', value: bookCount },
        { label: 'Groups Count:', value: groupCount },
        { label: 'Phrases Count:', value: phraseCount },
        {
          label: 'Average Words in Books',
          value: displayDecimal(wordAvg),
        },
        {
          label: 'Average Words in Group:',
          value: displayDecimal(groupAvg),
        },
        {
          label: 'Average Words in Phrase:',
          value: displayDecimal(phraseAvg),
        },
      ]}
      className={styles.wrapper}
    />
  );
};
